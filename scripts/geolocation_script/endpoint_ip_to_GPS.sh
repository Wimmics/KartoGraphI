#! /bin/bash

if [ $# -gt 1 ]
  then
    echo "Too many arguments supplied"
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


jsonld_catalog_prefix='{ "@context": { "endpointURL": { "@id": "http://rdfs.org/ns/void#endpointURL", "@type": "@id" }, "createdAt": "http://purl.org/pav/createdAt", "lat": { "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#lat", "@type": "xsd:float" }, "lon": { "@id": "http://www.w3.org/2003/01/geo/wgs84_pos#lon", "@type": "xsd:float" }, "xsd": "http://www.w3.org/2001/XMLSchema#", "ip_address": { "@id": "http://rdfs.org/sioc/ns#ip_address", "@type": "xsd:string" } }, "@graph":'
jsonld_catalog_suffix='}'

just_endpoints_csv=endpoints.csv
just_ips_csv=endpoints_ips.csv
endpoints_and_ips_jsonld=endpoints_and_ips.jsonld

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
    IP_JSON_TEMP_FILE=$(mktemp)
    tmp_endpoints_ips_csv=$(mktemp)

    while read url; do
        # Remove protocol from url
        url_without_protocol="${url#*://}"
        url_only_domain="${url_without_protocol%%/*}"
        ip_result=`getent hosts $url_only_domain | awk '{ print $1 ; exit }'`
        echo $ip_result >> $tmp_endpoints_ips_csv
        echo "{ \"@id\":\"$url\", \"endpointURL\":\"$url\", \"ip_address\":\"$ip_result\" }" >> $IP_JSON_TEMP_FILE
    done <endpoints.csv

    if [ ! -e $endpoints_and_ips_jsonld ] ; then
        echo "Previous endpoints and IPs file not found. Creating a new one."
        endpoint_ip_array_content=`cat $IP_JSON_TEMP_FILE`
        echo $jsonld_catalog_prefix > $endpoints_and_ips_jsonld
        echo $endpoint_ip_array_content >> $endpoints_and_ips_jsonld
        echo $jsonld_catalog_suffix >> $endpoints_and_ips_jsonld
    fi

    sort -u $tmp_endpoints_ips_csv >> $just_ips_csv
    rm $tmp_endpoints_ips_csv
fi
echo "IPs retrieved"

# Get the geolocation of the IPs
echo "Retrieving geolocation of the IPs"

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
    data_argument="$(join_by , $(cat $BATCH_FILE))"
    if (( i % BATCH_SIZE == 0 )); then
        ith_result_json_file="result_json_$i.json"
        if [ ! -e $ith_result_json_file ]; then
            echo "curl http://ip-api.com/batch?fields=status,lat,lon,query --data \"[$data_argument]\" > $ith_result_json_file"
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
echo "Geolocation retrieved"

# Converting the geolocation results to JSON-LD
echo "Converting the geolocation results to JSON-LD"
for file in `ls | grep result_json_*.json` 
do
    result_file="$file.jsonld"
    if [ -e $result_file ]; then
        continue
    fi
    echo $jsonld_catalog_prefix > $result_file
    jsonld_inner_content=`./$jq_executable '[ .[] | select(.status == "success") | { "createdAt": { "lat": .lat, "lon": .lon }, "ip_address": .query } ]' $file`
    echo $jsonld_inner_content >> $result_file
    echo $jsonld_catalog_suffix >> $result_file
    rm $file
done
echo "Geolocation results converted to JSON-LD"

rm $just_endpoints_csv
rm $just_ips_csv



