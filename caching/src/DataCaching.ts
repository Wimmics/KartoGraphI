import dayjs, { Dayjs } from "dayjs";
import duration from 'dayjs/plugin/duration.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(duration);
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
import * as Global from "./GlobalUtils.js";
import * as Logger from "./LogUtils.js";
import * as Sparql from "./SparqlUtils.js";
import { EndpointItem, JSONValue, JSONObject, JSONArray, KeywordsEndpointDataObject, TripleCountDataObject, VocabEndpointDataObject, SPARQLFeatureDataObject, SPARQLJSONResult, EndpointServerDataObject, SPARQLJSONResultBinding, ClassCountDataObject, PropertyCountDataObject, QualityMeasureDataObject, LanguageListDataObject, FAIRDataObject } from './DataTypes.js';

const dataFilePrefix = "./data/";
export const dataCachedFilePrefix = "./data/cache/";
const timezoneMap = Global.readJSONFile(dataFilePrefix + 'timezoneMap.json');
const endpointIpMap = Global.readJSONFile(dataFilePrefix + 'endpointIpGeoloc.json');

export const geolocFilename = dataCachedFilePrefix + "geolocData.json";
export const vocabEndpointFilename = dataCachedFilePrefix + "vocabEndpointData.json";
export const endpointKeywordsFilename = dataCachedFilePrefix + "endpointKeywordsData.json";
export const sparqlCoverageFilename = dataCachedFilePrefix + "sparqlCoverageData.json";
export const sparqlFeaturesFilename = dataCachedFilePrefix + "sparqlFeaturesData.json";
export const tripleCountFilename = dataCachedFilePrefix + "tripleCountData.json";
export const classCountFilename = dataCachedFilePrefix + "classCountData.json";
export const propertyCountFilename = dataCachedFilePrefix + "propertyCountData.json";
export const categoryTestCountFilename = dataCachedFilePrefix + "categoryTestCountData.json";
export const totalCategoryTestCountFilename = dataCachedFilePrefix + "totalCategoryTestCountData.json";
export const endpointTestsDataFilename = dataCachedFilePrefix + "endpointTestsData.json";
export const totalRuntimeDataFilename = dataCachedFilePrefix + "totalRuntimeData.json";
export const averageRuntimeDataFilename = dataCachedFilePrefix + "averageRuntimeData.json";
export const classPropertyDataFilename = dataCachedFilePrefix + "classPropertyData.json";
export const datasetDescriptionDataFilename = dataCachedFilePrefix + "datasetDescriptionData.json";
export const shortUriDataFilename = dataCachedFilePrefix + "shortUriData.json";
export const rdfDataStructureDataFilename = dataCachedFilePrefix + "rdfDataStructureData.json";
export const readableLabelDataFilename = dataCachedFilePrefix + "readableLabelData.json";
export const blankNodesDataFilename = dataCachedFilePrefix + "blankNodesData.json";
export const languageListDataFilename = dataCachedFilePrefix + "languagesData.json";
export const endpointServerDataFilename = dataCachedFilePrefix + "endpointServerData.json";
export const fairnessDataFilename = dataCachedFilePrefix + "fairnessData.json";
const vocabKeywordsMapFilename = dataFilePrefix + "vocabularyKeywordMap.json";
const endpointKeywordsMapFilename = dataFilePrefix + "endpointKeywordMap.json";

export const LOVFilename = dataFilePrefix + "knownVocabulariesLOV.json";
export const prefixccFilename = dataFilePrefix + "knownVocabulariesPrefixcc.json"
export const ebiFilename = dataFilePrefix + "knownVocabulariesEBIac.json"
export const knownVocabulariesFilename = dataFilePrefix + "knowVocabularies.json";

export function endpointMapfill() {
    Logger.info("endpointMapfill START")
    let endpointGeolocData = [];

    // Marked map with the geoloc of each endpoint
    return Global.readJSONFile("../scripts/geolocation_script/geo_pos.json").then(endpointsgeolocRaw => {
        let endpointItemMap: Map<string, EndpointItem> = new Map<string, EndpointItem>();
        (endpointsgeolocRaw as Array<JSONObject>).forEach(rawEndpointGeoloc => {

            let endpointItem: EndpointItem = {
                city: (rawEndpointGeoloc.city as string),
                country: (rawEndpointGeoloc.country as string),
                region: (rawEndpointGeoloc.continent as string),
                org: (rawEndpointGeoloc.org as string),
                lat: (rawEndpointGeoloc.lat as number),
                lon: (rawEndpointGeoloc.lon as number),
                endpoint: (rawEndpointGeoloc.endpoint as string)
            };
            endpointItemMap.set(rawEndpointGeoloc.endpoint as string, endpointItem);
        });
        return endpointItemMap
    })
        .then(endpointItemMap => {
            endpointItemMap.forEach((endpointItem, endpoint) => {
                let popupString = `${endpointItem.endpoint},\n`;
                if (endpointItem.region != undefined) {
                    popupString += `Continent: ${endpointItem.region},\n`;
                }
                if (endpointItem.country != undefined) {
                    popupString += `Country: ${endpointItem.country},\n`;
                }
                if (endpointItem.city != undefined) {
                    popupString += `City: ${endpointItem.city},\n`;
                }
                if (endpointItem.org != undefined) {
                    popupString += `Organization: ${endpointItem.org}\n`;
                }
                endpointItem.popupHTML = popupString;
            })

            endpointItemMap.forEach((endpointItem, endpoint) => {
                endpointGeolocData.push(endpointItem);
            });
            return Promise.resolve(endpointGeolocData);
        })
        .then(endpointGeolocData => {
            try {
                let content = JSON.stringify(endpointGeolocData);
                Logger.info("endpointMapfill END")
                return Global.writeFile(geolocFilename, content)
            } catch (err) {
                Logger.error(err)
            }
        })
        .catch(error => {
            Logger.error(error)
        })
}


// https://obofoundry.org/ // No ontology URL available in ontology description
// http://prefix.cc/context // done
// http://data.bioontology.org/resource_index/resources?apikey=b86b12d8-dc46-4528-82e3-13fbdabf5191 // No ontology URL available in ontology description
// https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/list // done

// Retrieval of the list of LOV vocabularies to filter the ones retrieved in the index
export function retrieveKnownVocabularies(): Promise<Set<JSONObject>> {
    Logger.log("retrieveKnownVocabularies START")
    let knownVocabularies = new Set<JSONObject>();
    return Global.readJSONFile(knownVocabulariesFilename)
        .catch(error => {
            Logger.error(error);
            return [];
        })
        .then(existingKnowVocabularies => {
            knownVocabularies = new Set(existingKnowVocabularies as Array<JSONObject>);
            Logger.log(knownVocabularies.size, "vocabularies in existing file")
            if (knownVocabularies.size == 0) {
                return Global.readJSONFile(LOVFilename)
                    .catch(error => {
                        Logger.error(error);
                        return [];
                    })
                    .then(existingLOVResponse => {
                        Logger.log((existingLOVResponse as JSONArray).length, "element in existing LOV response file")
                        if ((existingLOVResponse as JSONArray).length == 0) {
                            return Global.fetchJSONPromise("https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/list");
                        }
                        return existingLOVResponse;
                    })
                    .then(responseLOV => {
                        Logger.log((responseLOV as JSONArray).length, "element in LOV response file")
                        if (responseLOV !== undefined) {
                            (responseLOV as JSONValue[]).forEach((item) => {
                                knownVocabularies.add(item["uri"])
                            });
                            Logger.log(knownVocabularies.size, "known vocabularies after LOV treatment")
                            let content = JSON.stringify(responseLOV);
                            return Global.writeFile(LOVFilename, content);
                        } else {
                            return Promise.reject("LOV response is undefined");
                        }
                    })
                    .then(() => {
                        return Global.readJSONFile(prefixccFilename)
                            .catch(error => {
                                Logger.error(error);
                                return {}
                            })
                    })
                    .then(prefixccJSON => {
                        let prefixCCanswerPromise = Promise.resolve(prefixccJSON);
                        if (Object.keys(prefixccJSON).length == 0) {
                            prefixCCanswerPromise = Global.fetchJSONPromise("http://prefix.cc/context")
                        }
                        return prefixCCanswerPromise
                            .then(responsePrefixCC => {
                                Logger.log(Object.keys(responsePrefixCC['@context']).length, "elements from Prefix.cc")
                                for (let prefix of Object.keys(responsePrefixCC['@context'])) {
                                    knownVocabularies.add(responsePrefixCC['@context'][prefix])
                                };
                                Logger.log(knownVocabularies.size, "known vocabularies after Prefix.cc treatment")
                                return Global.writeFile(prefixccFilename, JSON.stringify(responsePrefixCC))
                            })
                    })
                    .then(() => Global.writeFile(knownVocabulariesFilename, JSON.stringify([...knownVocabularies])))
                    .then(() => Promise.resolve(knownVocabularies))
            }
            Logger.log("retrieveKnownVocabularies END")
            return knownVocabularies
        })
}

export function allVocabFill(): Promise<void> {
    Logger.info("allVocabFill START")
    let endpointVocabMap: Map<string, string[]> = new Map();
    let vocabKeywords: Map<string, string[]> = new Map();
    let endpointKeywords: Map<string, string[]> = new Map();

    let knownVocabularies: Set<JSONObject> = new Set<JSONObject>();
    let vocabSet = new Set<string>()
    return retrieveKnownVocabularies()
        .then(retrievedKnownVocabularies => {
            knownVocabularies = retrievedKnownVocabularies;
            return Sparql.paginatedSparqlQueryToIndeGxPromise(`SELECT DISTINCT ?endpointUrl ?vocabulary {
            { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?dataset <http://rdfs.org/ns/void#vocabulary> ?vocabulary .
            FILTER(! STRSTARTS( STR(?endpointUrl), "http://ns.inria.fr/kg/index#" ))
        }`)
        })
        .then(json => {
            (json as JSONValue[]).forEach(bindingItem => {
                const endpointUrl = bindingItem["endpointUrl"].value;
                const vocabulary = bindingItem["vocabulary"].value;
                if (!endpointVocabMap.has(endpointUrl)) {
                    endpointVocabMap.set(endpointUrl, []);
                }
                if (knownVocabularies.has(vocabulary)) {
                    endpointVocabMap.get(endpointUrl).push(vocabulary);
                    vocabSet.add(vocabulary);
                }
            });
            return;
        })
        .then(() => {
            Logger.log(vocabSet.size, "vocabularies")
            return Global.readFile(vocabKeywordsMapFilename)
                .then(existingVocabKeywordMapString => {
                    vocabKeywords = Global.mapFromJSON(JSON.parse(existingVocabKeywordMapString));
                    Logger.log(vocabKeywords.size, "existing vocab/keywords associations")
                    return;
                })
                .catch(error => {
                    Logger.error(error);
                    vocabKeywords = new Map<string, string[]>();
                    return;
                })
        })
        .then(() => {
            return Global.readFile(endpointKeywordsMapFilename)
                .then(existingEndpointKeywordsMapString => {
                    endpointKeywords = Global.mapFromJSON(JSON.parse(existingEndpointKeywordsMapString))
                    Logger.log(endpointKeywords.size, "existing endpoint/keywords associations")
                    return;
                })
                .catch(error => {
                    Logger.error(error);
                    endpointKeywords = new Map<string, string[]>();
                    return;
                })
        })
        .then(() => {
            if (vocabKeywords.size == 0) {
                let queryArray = [...vocabSet].map((item, i) => {
                    Logger.log(`Querying LOV for ${item}`)
                    return Global.fetchJSONPromise(`https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/info?vocab=${item}`);
                })

                return Promise.allSettled(queryArray)
                    .then(jsonKeywordsArraySettled => {
                        let jsonKeywordsArray = Global.extractSettledPromiseValues(jsonKeywordsArraySettled);
                        jsonKeywordsArray.forEach(jsonKeywords => {
                            if (jsonKeywords !== undefined && jsonKeywords.nsp !== undefined && jsonKeywords.tags !== undefined) {
                                let vocab = jsonKeywords.nsp;
                                let keywordList = jsonKeywords.tags;

                                if (keywordList !== undefined) {
                                    keywordList.forEach(keyword => {
                                        if (!vocabKeywords.has(vocab)) {
                                            vocabKeywords.set(vocab, []);
                                        }
                                        vocabKeywords.get(vocab).push(keyword);
                                    })
                                }
                            }
                        })
                        return Global.writeFile(vocabKeywordsMapFilename, Global.mapToJSON(vocabKeywords));
                    })
            }
            return;
        })
        .then(() => {
            endpointVocabMap.forEach((vocabArray, endpointUrl, map) => {
                let keywordSet: Set<string> = new Set();
                vocabArray.forEach(vocab => {
                    if (vocabKeywords.has(vocab)) {
                        vocabKeywords.get(vocab).forEach(keyword => {
                            keywordSet.add(keyword);
                        })
                    }
                })
                endpointKeywords.set(endpointUrl, [...keywordSet]);
            })
            return;
        })
        .then(() => Global.writeFile(endpointKeywordsMapFilename, Global.mapToJSON(endpointKeywords)))
        .then(() => {
            Logger.info("vocabFill START")
            let endpointQuery = `SELECT DISTINCT ?endpointUrl { 
                        { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
                        UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
                        UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
                        FILTER(! STRSTARTS( STR(?endpointUrl), "http://ns.inria.fr/kg/index#" ))
                } 
                GROUP BY ?endpointUrl`;

            return Sparql.paginatedSparqlQueryToIndeGxPromise(endpointQuery).then(json => {
                if (json !== undefined) {
                    let endpointSet: Set<string> = new Set();
                    (json as JSONValue[]).forEach(bindingItem => {
                        const endpointUrl = bindingItem["endpointUrl"].value;
                        endpointSet.add(endpointUrl);
                    });
                    return endpointSet;
                } else {
                    return Promise.resolve(new Set<string>());
                }
            }).then(() => {
                let endpointVocabData: VocabEndpointDataObject[] = [];
                endpointVocabMap.forEach((vocabArray, endpointUrl, map) => {
                    endpointVocabData.push({ endpoint: endpointUrl, vocabularies: vocabArray });
                })
                let content = JSON.stringify(endpointVocabData);
                return Global.writeFile(vocabEndpointFilename, content)
                    .then(() => {
                        let endpointKeywordsData: KeywordsEndpointDataObject[] = [];
                        endpointKeywords.forEach((keywordArray, endpointUrl, map) => {
                            endpointKeywordsData.push({ endpoint: endpointUrl, keywords: keywordArray });
                        })
                        let content = JSON.stringify(endpointKeywordsData);
                        return Global.writeFile(endpointKeywordsFilename, content)
                    })
                    .then(() => {
                        Logger.info("vocabFill END")
                        return Promise.resolve();
                    })

            })
        }).catch(error => {
            Logger.error(error)
        })
}

export function SPARQLCoverageFill() {
    Logger.info("SPARQLCoverageFill START")
    // Create an histogram of the SPARQLES rules passed by endpoint.
    let sparqleFeaturesQuery = `PREFIX kgi: <http://ns.inria.fr/kg/index#>
    PREFIX sd: <http://www.w3.org/ns/sparql-service-description#>
    SELECT DISTINCT ?endpoint ?feature {
      {
        { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . }
        UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . }
        UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpoint . }
        ?dataset sd:feature ?feature . 
      } UNION {
        ?endpoint sd:feature ?feature . 
      }
      FILTER(isIRI(?endpoint))
      FILTER(STRSTARTS( STR(?feature), "https://sparqles.ai.wu.ac.at/#" ))
      FILTER(! STRSTARTS(STR(?endpoint), STR(kgi:)))
    }`
    return Sparql.paginatedSparqlQueryToIndeGxPromise(sparqleFeaturesQuery)
        .then(sparqlFeaturesResults => {
            let sparqlFeaturesDataArray: SPARQLFeatureDataObject[] = [];
            let sparqlFeaturesMap: Map<string, string[]> = new Map();
            (sparqlFeaturesResults as JSONValue[]).forEach((itemResult, i) => {
                let endpoint = itemResult["endpoint"].value;
                let feature = itemResult["feature"].value;
                if (!sparqlFeaturesMap.has(endpoint)) {
                    sparqlFeaturesMap.set(endpoint, []);
                }
                sparqlFeaturesMap.get(endpoint).push(feature);
            });
            sparqlFeaturesMap.forEach((featuresArray, endpoint) => {
                sparqlFeaturesDataArray.push({ endpoint: endpoint, features: featuresArray });
            });
            return Promise.resolve(sparqlFeaturesDataArray);

        }).then(sparqlFeaturesDataArray => {

            if (sparqlFeaturesDataArray.length > 0) {
                try {
                    let content = JSON.stringify(sparqlFeaturesDataArray);
                    Logger.info("SPARQLCoverageFill END")
                    return Global.writeFile(sparqlFeaturesFilename, content)
                } catch (err) {
                    Logger.error(err)
                    return Promise.reject(err);
                }
            }
        })
        .catch(error => {
            Logger.error(error)
        })
}

export function tripleDataFill() {
    Logger.info("tripleDataFill START")
    // Scatter plot of the number of triples through time
    let triplesSPARQLquery = `SELECT DISTINCT ?endpointUrl (MAX(?rawO) AS ?triples) {
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?curated <http://rdfs.org/ns/void#triples> ?rawO .
            FILTER(! STRSTARTS( STR(?endpointUrl), "http://ns.inria.fr/kg/index#" ))
    } GROUP BY ?endpointUrl`;

    type EndpointTripleIndexItem = { triples: number };
    return Sparql.paginatedSparqlQueryToIndeGxPromise(triplesSPARQLquery)
        .then(json => {
            let endpointTriplesDataIndex: Map<string, EndpointTripleIndexItem> = new Map();
            let endpointTriplesData: TripleCountDataObject[] = [];
            (json as JSONValue[]).forEach((itemResult, i) => {
                let endpointUrl = itemResult["endpointUrl"].value;
                let triples = Number.parseInt(itemResult["triples"].value);

                endpointTriplesDataIndex.set(endpointUrl, { triples: triples })
            });
            endpointTriplesDataIndex.forEach((tripleData, endpointUrl) => {
                endpointTriplesData.push({ endpoint: endpointUrl, triples: tripleData.triples })
            });
            return Promise.resolve(endpointTriplesData);
        })
        .then(endpointTriplesData => {
            try {
                let content = JSON.stringify(endpointTriplesData);
                return Global.writeFile(tripleCountFilename, content).then(() => {
                    Logger.info("tripleDataFill END");
                    return Promise.resolve();
                })
            } catch (err) {
                Logger.error(err)
                return Promise.reject(err);
            }
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject(error);
        });
}

export function serverHeadersFill(): Promise<void> {
    Logger.info("serverHeadersFill START")
    // Retrieves the shortest server name for one endpoint, to avoid names with version number
    const serverHeaderQuery = `PREFIX kgi: <http://ns.inria.fr/kg/index#>
    SELECT DISTINCT ?endpoint ?serverName {
      ?endpoint kgi:server ?serverName .
      FILTER(NOT EXISTS {
          ?endpoint kgi:server ?otherServerName .
        FILTER(?otherServerName != ?serverName)
        FILTER(STRLEN(?otherServerName) < STRLEN(?serverName))
        })
        FILTER(! STRSTARTS( STR(?endpoint), "http://ns.inria.fr/kg/index#" ))
    }`;
    return Sparql.paginatedSparqlQueryToIndeGxPromise(serverHeaderQuery)
        .then((serverHeadersResult: SPARQLJSONResultBinding[]) => {
            if (serverHeadersResult.length > 0) {
                try {
                    let endpointServerArray: EndpointServerDataObject[] = [];
                    serverHeadersResult.forEach(binding => {
                        if (binding.serverName != undefined && binding.endpoint != undefined) {
                            endpointServerArray.push({ endpoint: binding.endpoint.value as string, server: binding.serverName.value as string })
                        }
                    })
                    return Global.writeFile(endpointServerDataFilename, JSON.stringify(endpointServerArray)).then(() => {
                        Logger.info("serverHeadersFill END");
                        return;
                    });
                } catch (error) {
                    Logger.error(error)
                    Promise.reject(error)
                }
            } else {
                Promise.reject("No result found to the query for server names")
            }
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject(error);
        });
}

export function classDataFill() {
    Logger.info("classDataFill START")
    // Scatter plot of the number of classes through time
    let classesSPARQLquery = `SELECT DISTINCT ?endpointUrl (MAX(?rawO) AS ?count) { 
        { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
        UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
        UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
        ?curated <http://rdfs.org/ns/void#classes> ?rawO .
        FILTER(! STRSTARTS( STR(?endpointUrl), "http://ns.inria.fr/kg/index#" ))
} GROUP BY ?endpointUrl`;
    return Sparql.paginatedSparqlQueryToIndeGxPromise(classesSPARQLquery)
        .then(classCountQueryresults => {
            try {
                let classCountData: ClassCountDataObject[] = [];
                if ((classCountQueryresults as SPARQLJSONResultBinding[]).length > 0) {
                    (classCountQueryresults as SPARQLJSONResultBinding[]).forEach(classCountBinding => {
                        classCountData.push({ classes: Number.parseInt(classCountBinding.count.value), endpoint: classCountBinding.endpointUrl.value })
                    })
                    return Global.writeFile(classCountFilename, JSON.stringify(classCountData))
                        .then(() => {
                            Logger.info("classDataFill END");
                            return;
                        })
                } else {
                    return Promise.reject("No class count data found")
                }
            } catch (error) {
                return Promise.reject(error)
            }
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject(error);
        });
}

export function propertyDataFill() {
    Logger.info("propertyDataFill START")
    // Scatter plot of the number of classes through time
    let propertiesSPARQLquery = `SELECT DISTINCT ?endpointUrl (MAX(?rawO) AS ?count) { 
        { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
        UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
        UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
        ?curated <http://rdfs.org/ns/void#properties> ?rawO .
        FILTER(! STRSTARTS( STR(?endpointUrl), "http://ns.inria.fr/kg/index#" ))
} GROUP BY ?endpointUrl`;
    return Sparql.paginatedSparqlQueryToIndeGxPromise(propertiesSPARQLquery)
        .then(propertyCountQueryresults => {
            try {
                let propertyCountData: PropertyCountDataObject[] = [];
                if ((propertyCountQueryresults as SPARQLJSONResultBinding[]).length > 0) {
                    (propertyCountQueryresults as SPARQLJSONResultBinding[]).forEach(propertyCountBinding => {
                        propertyCountData.push({ properties: Number.parseInt(propertyCountBinding.count.value), endpoint: propertyCountBinding.endpointUrl.value })
                    })
                    return Global.writeFile(propertyCountFilename, JSON.stringify(propertyCountData))
                        .then(() => {
                            Logger.info("propertyDataFill END");
                            return;
                        })
                } else {
                    return Promise.reject("No propertyDataFill count data found")
                }
            } catch (error) {
                return Promise.reject(error)
            }
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject(error);
        });
}

export function shortUrisDataFill() {
    Logger.info("shortUrisDataFill START")
    // Scatter plot of the number of classes through time
    let shortUrisSPARQLquery = `SELECT DISTINCT ?endpointUrl (MAX(?measureRaw) as ?measure) {
        { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
        UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
        ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
        ?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode .
        ?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/shortUris.ttl> .
        ?measureNode <http://www.w3.org/ns/dqv#value> ?measureRaw .
        FILTER(! STRSTARTS( STR(?endpointUrl), "http://ns.inria.fr/kg/index#" ))
} GROUP BY ?endpointUrl ?measure`;
    return Sparql.paginatedSparqlQueryToIndeGxPromise(shortUrisSPARQLquery)
        .then(shortUrisCountQueryresults => {
            try {
                let shortUrisCountData: QualityMeasureDataObject[] = [];
                if ((shortUrisCountQueryresults as SPARQLJSONResultBinding[]).length > 0) {
                    (shortUrisCountQueryresults as SPARQLJSONResultBinding[]).forEach(propertyCountBinding => {
                        shortUrisCountData.push({ measure: Number.parseFloat(propertyCountBinding.measure.value), endpoint: propertyCountBinding.endpointUrl.value })
                    })
                    return Global.writeFile(shortUriDataFilename, JSON.stringify(shortUrisCountData))
                        .then(() => {
                            Logger.info("shortUrisDataFill END");
                            return;
                        })
                } else {
                    return Promise.reject("No short URIs count data found")
                }
            } catch (error) {
                return Promise.reject(error)
            }
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject(error);
        });
}

export function readableLabelsDataFill() {
    Logger.info("readableLabelsDataFill START")
    // Scatter plot of the number of classes through time
    let readableLabelsSPARQLquery = `SELECT DISTINCT ?endpointUrl (MAX(?measureRaw) as ?measure) {
        { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
        UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
        ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
        ?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode .
        ?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/readableLabels.ttl> .
        ?measureNode <http://www.w3.org/ns/dqv#value> ?measureRaw .
        FILTER(! STRSTARTS( STR(?endpointUrl), "http://ns.inria.fr/kg/index#" ))
} GROUP BY ?endpointUrl ?measure`;
    return Sparql.paginatedSparqlQueryToIndeGxPromise(readableLabelsSPARQLquery)
        .then(readableLabelsCountQueryresults => {
            try {
                let readableLabelsCountData: QualityMeasureDataObject[] = [];
                if ((readableLabelsCountQueryresults as SPARQLJSONResultBinding[]).length > 0) {
                    (readableLabelsCountQueryresults as SPARQLJSONResultBinding[]).forEach(readableLabelsBinding => {
                        readableLabelsCountData.push({ measure: Number.parseFloat(readableLabelsBinding.measure.value), endpoint: readableLabelsBinding.endpointUrl.value })
                    })
                    return Global.writeFile(readableLabelDataFilename, JSON.stringify(readableLabelsCountData))
                        .then(() => {
                            Logger.info("readableLabelsDataFill END");
                            return;
                        })
                } else {
                    return Promise.reject("No readable labels count data found")
                }
            } catch (error) {
                return Promise.reject(error)
            }
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject(error);
        });
}

export function rdfDataStructureDataFill() {
    Logger.info("rdfDataStructureDataFill START")
    let rdfDataStructureQuery = `SELECT DISTINCT ?endpointUrl (MAX(?measureRaw) as ?measure) {
        { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
        UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
        { ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
        ?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode .}
        UNION { ?curated <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode . }
        ?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/RDFDataStructures.ttl> .
        ?measureNode <http://www.w3.org/ns/dqv#value> ?measureRaw .
        FILTER(! STRSTARTS( STR(?endpointUrl), "http://ns.inria.fr/kg/index#" ))
        
      } GROUP BY ?endpointUrl ?measure` ;

    return Sparql.paginatedSparqlQueryToIndeGxPromise(rdfDataStructureQuery).then(rawRdfDataStructureDataQueryResults => {
        let rdfDataStructureData: QualityMeasureDataObject[] = [];
        if ((rawRdfDataStructureDataQueryResults as SPARQLJSONResultBinding[]).length > 0) {
            const rdfDataStructureDataQueryResults = rawRdfDataStructureDataQueryResults as SPARQLJSONResultBinding[];
            rdfDataStructureDataQueryResults.forEach((rdfDataStructureBinding, i) => {
                rdfDataStructureData.push({ measure: Number.parseFloat(rdfDataStructureBinding.measure.value), endpoint: rdfDataStructureBinding.endpointUrl.value })
            });
        }
        return Global.writeFile(rdfDataStructureDataFilename, JSON.stringify(rdfDataStructureData))
            .then(() => {
                Logger.info("rdfDataStructureDataFill END");
                return;
            })
    })
        .catch(error => {
            Logger.error(error);
        });
}

export function blankNodeDataFill() {
    Logger.info("blankNodeDataFill START")
    let blankNodeQuery = `SELECT DISTINCT ?endpointUrl (MAX(?measureRaw) as ?measure) {
        { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
        UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
        { ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
        ?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode .}
        UNION { ?curated <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode . }
        ?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/blankNodeUsage.ttl> .
        ?measureNode <http://www.w3.org/ns/dqv#value> ?measureRaw .
        FILTER(! STRSTARTS( STR(?endpointUrl), "http://ns.inria.fr/kg/index#" ))
        
      } GROUP BY ?endpointUrl ?measure` ;

    return Sparql.paginatedSparqlQueryToIndeGxPromise(blankNodeQuery).then(rawBlankNodeDataQueryResults => {
        let blankNodeData: QualityMeasureDataObject[] = [];
        if ((rawBlankNodeDataQueryResults as SPARQLJSONResultBinding[]).length > 0) {
            const blankNodeDataQueryResults = rawBlankNodeDataQueryResults as SPARQLJSONResultBinding[];
            blankNodeDataQueryResults.forEach((blankNodeBinding, i) => {
                blankNodeData.push({ measure: Number.parseFloat(blankNodeBinding.measure.value), endpoint: blankNodeBinding.endpointUrl.value })
            });
        }
        return Global.writeFile(blankNodesDataFilename, JSON.stringify(blankNodeData))
            .then(() => {
                Logger.info("blankNodeDataFill END");
                return;
            })
    })
        .catch(error => {
            Logger.error(error);
        });
}



export function endpointLanguagesDataFill(): Promise<void> {
    Logger.info("endpointLanguagesDataFill START")
    const endpointLanguageQuery = `PREFIX dcterms: <http://purl.org/dc/terms/>
    PREFIX schema: <http://schema.org/>
    SELECT DISTINCT ?endpointUrl ?lang {
      { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
      UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }                
      { ?curated schema:availableLanguage ?lang . }
      UNION { ?curated dcterms:language ?lang . }
      FILTER(! STRSTARTS( STR(?endpointUrl), "http://ns.inria.fr/kg/index#" ))
    } GROUP BY ?endpointUrl ?lang`;
    return Sparql.paginatedSparqlQueryToIndeGxPromise(endpointLanguageQuery).then(rawEndpointLanguagesDataQueryResults => {
        let endpointLanguageIndex: Map<string, string[]> = new Map();
        if ((rawEndpointLanguagesDataQueryResults as SPARQLJSONResultBinding[]).length > 0) {
            const endpointLanguagesDataQueryResults = rawEndpointLanguagesDataQueryResults as SPARQLJSONResultBinding[];
            endpointLanguagesDataQueryResults.forEach((endpointLanguageBinding, i) => {
                const endpointUrl = endpointLanguageBinding.endpointUrl.value;
                const language = endpointLanguageBinding.lang.value;
                if (!endpointLanguageIndex.has(endpointUrl)) {
                    endpointLanguageIndex.set(endpointUrl, []);
                }
                endpointLanguageIndex.get(endpointUrl).push(language);
            });
        }

        let endpointLanguagesData: LanguageListDataObject[] = [];
        endpointLanguageIndex.forEach((languagesArray, endpoint) => {
            endpointLanguagesData.push({ endpoint: endpoint, languages: languagesArray });
        });
        return Global.writeFile(languageListDataFilename, JSON.stringify(endpointLanguagesData))
            .then(() => {
                Logger.info("endpointLanguagesDataFill END");
                return;
            })
    })
        .catch(error => {
            Logger.error(error);
        });

}

export function fairnessDataFill() {
    Logger.log("fairnessDataFill START")
    const fairnessQuery = `PREFIX kgi: <http://ns.inria.fr/kg/index#>
PREFIX dc: <http://purl.org/dc/elements/1.1/>
PREFIX dataid: <http://dataid.dbpedia.org/ns/core#>
PREFIX sd: <http://www.w3.org/ns/sparql-service-description#>
PREFIX schema: <http://schema.org/>
PREFIX dcmitype: <http://purl.org/dc/dcmitype/>
PREFIX void: <http://rdfs.org/ns/void#>
PREFIX dcat: <http://www.w3.org/ns/dcat#>
PREFIX dqv: <http://www.w3.org/ns/dqv#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX prov: <http://www.w3.org/ns/prov#>
PREFIX sin: <http://www.exemple.com/sin#>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>
PREFIX dqv: <http://www.w3.org/ns/dqv#>
PREFIX earl: <http://www.w3.org/ns/earl#>
SELECT DISTINCT ?kg ?endpointUrl ?measureF1A ?measureF1B ?measureF2A ?measureF2B ?measureA11 ?measureA12 ?measureI1 ?measureI2 ?measureI3 ?measureR11 ?measureR12 ?measureR13 
WHERE {
  ?kg a ?datasetType .
  VALUES ?datasetType { dcat:Dataset void:Dataset }.
        { ?kg ?endpointLink ?endpointUrl . 
            VALUES ?endpointLink {
                dcat:endpointURL
                void:sparqlEndpoint
                sd:endpoint
                dcat:accessURL
            }
        }
        UNION {?kg dcat:accessService ?service .
            ?service dcat:endpointURL ?endpointUrl .  }
        UNION {?kg dcat:accessService ?service .
            ?service sd:endpoint ?endpointUrl . }
        UNION {?service dcat:servesDataset ?kg .
            ?service dcat:endpointURL ?endpointUrl . }
        UNION {?service dcat:servesDataset ?kg .
            ?service sd:endpoint ?endpointUrl . }
  
  OPTIONAL {
        ?kg dqv:hasQualityMeasurement ?measurementF1A, ?measurementF1B, ?measurementF2A, ?measurementF2B, ?measurementA11, ?measurementA12, ?measurementI1, ?measurementI2, ?measurementI3, ?measurementR11, ?measurementR12, ?measurementR13 .
        
        ?measurementF1A a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/F1#F1A> ;
            dqv:value ?measureF1A .
            
        ?measurementF1B a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/F1#F1B> ;
            dqv:value ?measureF1B .
            
        ?measurementF2A a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/F2#F2A> ;
            dqv:value ?measureF2A .
            
        ?measurementF2B a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/F2#F2B> ;
            dqv:value ?measureF2B .
            
        ?measurementA11 a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/A1#A11> ;
            dqv:value ?measureA11 .
            
        ?measurementA12 a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/A1#A12> ;
            dqv:value ?measureA12 .
            
        ?measurementI1 a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/I1> ;
            dqv:value ?measureI1 .
            
        ?measurementI2 a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/I2> ;
            dqv:value ?measureI2 .
            
        ?measurementI3 a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/I3> ;
            dqv:value ?measureI3 .
            
        ?measurementR11 a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/R1#R11> ;
            dqv:value ?measureR11 .
            
        ?measurementR12 a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/R1#R12> ;
            dqv:value ?measureR12 .
            
        ?measurementR13 a dqv:QualityMeasurement ;
            dqv:isMeasurementOf <https://w3id.org/fair/principles/latest/R1#R13> ;
            dqv:value ?measureR13 .
  }
  
  FILTER(STRSTARTS(STR(?kg), "http"))
  FILTER(! STRSTARTS(STR(?kg), STR(kgi:)))
  FILTER(! STRSTARTS(STR(?endpointUrl), STR(kgi:)))
} ORDER BY ?kg ?endpointUrl ?measureF1A ?measureF1B ?measureF2A ?measureF2B ?measureA11 ?measureA12 ?measureI1 ?measureI2 ?measureI3 ?measureR11 ?measureR12 ?measureR13 `

    return Sparql.paginatedSparqlQueryToIndeGxPromise(fairnessQuery).then(fairnessResultArray => {
        let fairnessDataArray: FAIRDataObject[] = [];
        (fairnessResultArray as SPARQLJSONResultBinding[]).forEach(fairnessBinding => {
            let itemF1A = 0;
            if(fairnessBinding.measureF1A != undefined) {
                itemF1A = Number.parseFloat(fairnessBinding.measureF1A.value);
            }
            let itemF1B = 0;
            if(fairnessBinding.measureF1B != undefined) {
                itemF1B = Number.parseFloat(fairnessBinding.measureF1B.value);
            }
            let itemF2A = 0;
            if(fairnessBinding.measureF2A != undefined) {
                itemF2A = Number.parseFloat(fairnessBinding.measureF2A.value);
            }
            let itemF2B = 0;
            if(fairnessBinding.measureF2B != undefined) {
                itemF2B = Number.parseFloat(fairnessBinding.measureF2B.value);
            }
            let itemA11 = 0;
            if(fairnessBinding.measureA11 != undefined) {
                itemA11 = Number.parseFloat(fairnessBinding.measureA11.value);
            }
            let itemA12 = 0;
            if(fairnessBinding.measureA12 != undefined) {
                itemA12 = Number.parseFloat(fairnessBinding.measureA12.value);
            }
            let itemI1 = 0;
            if(fairnessBinding.measureI1 != undefined) {
                itemI1 = Number.parseFloat(fairnessBinding.measureI1.value);
            }
            let itemI2 = 0;
            if(fairnessBinding.measureI2 != undefined) {
                itemI2 = Number.parseFloat(fairnessBinding.measureI2.value);
            }
            let itemI3 = 0;
            if(fairnessBinding.measureI3 != undefined) {
                itemI3 = Number.parseFloat(fairnessBinding.measureI3.value);
            }
            let itemR11 = 0;
            if(fairnessBinding.measureR11 != undefined) {
                itemR11 = Number.parseFloat(fairnessBinding.measureR11.value);
            }
            let itemR12 = 0;
            if(fairnessBinding.measureR12 != undefined) {
                itemR12 = Number.parseFloat(fairnessBinding.measureR12.value);
            }
            let itemR13 = 0;
            if(fairnessBinding.measureR13 != undefined) {
                itemR13 = Number.parseFloat(fairnessBinding.measureR13.value);
            }
            let fairResultObject: FAIRDataObject = {
                endpoint: fairnessBinding.endpointUrl.value,
                kg: fairnessBinding.kg.value,
                f1a: itemF1A,
                f1b: itemF1B,
                f2a: itemF2A,
                f2b: itemF2B,
                a11: itemA11,
                a12: itemA12,
                i1: itemI1,
                i2: itemI2,
                i3: itemI3,
                r11: itemR11,
                r12: itemR12,
                r13: itemR13
            };
            fairnessDataArray.push(fairResultObject);
        })

        return Global.writeFile(fairnessDataFilename, JSON.stringify(fairnessDataArray))
        .then(() => {
            Logger.info("fairnessDataFill END");
            return;
        })
        .catch(error => {
            Logger.error(error)
        })
    })
    .catch(error => {
        Logger.error(error);
    });
}