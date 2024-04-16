#! /bin/bash

if [ $# -gt 1 ]
  then
    echo "Too many arguments supplied"
    exit 0
fi

endpoint_catalog=https://raw.githubusercontent.com/Wimmics/IndeGx/catalog_auto_refresh/catalogs/catalog.auto_refresh.ttl

if [ ! -z "$1" ]
  then
    endpoint_catalog=$1
fi

corese_version=4.5.0
corese_jar=corese-command-$corese_version.jar
jq_version=1.7.1
jq_executable=jq-linux64

if [ ! -e $corese_jar ]; then
    wget -q https://github.com/Wimmics/corese/releases/download/release-$corese_version/$corese_jar
fi

if [ ! -e $jq_executable ]; then
    wget -q https://github.com/jqlang/jq/releases/download/jq-$jq_version/$jq_executable
    chmod +x $jq_executable
fi

# Function to join an array by a delimiter: join_by delimiter array
function join_by {
  local d=${1-} f=${2-}
  if shift 2; then
    printf %s "$f" "${@/#/$d}"
  fi
}


jsonld_catalog_prefix='{
    "@context": {
        "endpointURL": {
            "@id": "http://rdfs.org/ns/void#sparqlEndpoint",
            "@type": "@id"
        },
        "createdAt": "http://purl.org/pav/createdAt",
        "lat": { 
            "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#lat",
            "@type": "xsd:string"
        },
        "lon": { 
            "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#lon",
            "@type": "xsd:string"
        },
        "xsd": "http://www.w3.org/2001/XMLSchema#",
        "ip_address": "http://rdfs.org/sioc/ns#ip_address"
    },
    "@graph":'
jsonld_catalog_suffix='}'

just_endpoints_csv=endpoints.csv
just_ips_csv=endpoints_ips.csv
endpoints_and_ips_jsonld=endpoints_and_ips.jsonld

if [ ! -e $endpoints_and_ips_jsonld ] ; then

    # Get the endpoints from a SPARQL query
    echo "Retrieving endpoints from the catalog"
    if [ ! -e $just_endpoints_csv ] ; then
        echo "Previous endpoints file not found. Creating a new one."
        echo "" > $just_endpoints_csv
        java -jar $corese_jar sparql -q endpoint_query.rq -i $endpoint_catalog -of csv -o $just_endpoints_csv
    fi
    echo "Endpoints retrieved"

    echo "Retrieving IPs from the endpoints"
    # Get the IPs of the endpoints
    if [ ! -e $just_ips_csv ] || [ ! -e $endpoints_and_ips_jsonld ] ; then
        echo "Previous IPs file not found. Creating a new one."
        echo "" > $just_ips_csv
        echo "" > $endpoints_and_ips_jsonld
        tmp_endpoint_ip_jsonld_file=$(mktemp)
        tmp_endpoints_ips_csv=$(mktemp)
        tmp_ips_csv=$(mktemp)

        while read url; do
            # Remove protocol from url
            url_without_protocol="${url#*://}"
            url_only_domain="${url_without_protocol%%/*}"
            ip_result=`getent hosts $url_only_domain | awk '{ print $1 ; exit }'`
            echo "$url;$ip_result" >> $tmp_endpoints_ips_csv
            echo $ip_result >> $tmp_ips_csv
        done < <(tail -n +2 endpoints.csv)

        sort -u $tmp_ips_csv >> $just_ips_csv 

        jq -Rsn '[inputs
                | . / "\n"
                | (.[] | select(length > 0) | . / ";") as $input
                | {"@id": $input[0], "endpointURL": $input[0], "ip_address": $input[1]} ]
            ' <$tmp_endpoints_ips_csv >$tmp_endpoint_ip_jsonld_file
        cat $tmp_endpoint_ip_jsonld_file

        tmp_endpoint_ip_array_content=`cat $tmp_endpoint_ip_jsonld_file`
        echo $jsonld_catalog_prefix > $endpoints_and_ips_jsonld
        echo $tmp_endpoint_ip_array_content >> $endpoints_and_ips_jsonld
        echo $jsonld_catalog_suffix >> $endpoints_and_ips_jsonld

        rm $tmp_endpoints_ips_csv
        rm $tmp_ips_csv
        rm $tmp_endpoint_ip_jsonld_file
    fi
    echo "IPs retrieved"
fi

# Get the geolocation of the IPs
echo "Retrieving geolocation of the IPs"

if ! ls result_json_*.json 1> /dev/null 2>&1 ; then
    # Separate the IP into batch of 100 because that is the limit of the geolocation service
    ## Batch size
    BATCH_SIZE=100

    ## Temporary file for batches
    BATCH_FILE=$(mktemp)

    ## Read IPs and batch them
    i=0
    while IFS= read -r line; do
        echo "\"$line\"" >> "$BATCH_FILE"
        let i+=1
        data_argument="$(join_by , $(cat $BATCH_FILE | grep .))"
        if (( i % BATCH_SIZE == 0 )); then
            ith_result_json_file="result_json_$i.json"
            if [ ! -e $ith_result_json_file ]; then
                curl http://ip-api.com/batch?fields=status,lat,lon,query --data "[$data_argument]" > $ith_result_json_file
                data_argument=""
            fi
            > "$BATCH_FILE" # Empty the file for the next batch
        fi
    done < endpoints_ips.csv

    # Get the last batch
    if [ -s $BATCH_FILE ]; then
        ith_result_json_file="result_json_$i.json"
        if [ ! -e $ith_result_json_file ]; then
            echo "curl http://ip-api.com/batch?fields=status,lat,lon,query --data \"[$data_argument]\" > $ith_result_json_file"
            curl http://ip-api.com/batch?fields=status,lat,lon,query --data "[$data_argument]" > $ith_result_json_file
        fi
    fi

    rm $BATCH_FILE
fi
echo "Geolocation retrieved"

# Converting the geolocation results to JSON-LD
echo "Converting the geolocation results to JSON-LD"
for file in `ls result_json_*.json` 
do
    echo $file
    result_file="$file.jsonld"
    if [ -e $result_file ]; then
        continue
    fi
    echo $jsonld_catalog_prefix > $result_file
    jsonld_inner_content=`./$jq_executable '[ .[] | select(.status == "success") | { "createdAt": { "lat": .lat|tostring, "lon": .lon|tostring }, "ip_address": .query } ]' $file`
    echo "./$jq_executable '[ .[] | select(.status == "success") | { "createdAt": { "lat": .lat|tostring, "lon": .lon|tostring }, "ip_address": .query } ]' $file"
    echo $jsonld_inner_content >> $result_file
    echo $jsonld_catalog_suffix >> $result_file
    rm $file
done
echo "Geolocation results converted to JSON-LD"

rm $just_endpoints_csv
rm $just_ips_csv

# Final RDF final generation

java -jar $corese_jar sparql -q final_result_generation_query.rq -i *.jsonld -of ttl -o endpoint_location.ttl