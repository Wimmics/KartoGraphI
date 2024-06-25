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
import { EndpointItem, JSONValue, JSONObject, JSONArray, KeywordsEndpointDataObject, TripleCountDataObject, VocabEndpointDataObject, SPARQLFeatureDataObject, SPARQLJSONResult, EndpointServerDataObject, SPARQLJSONResultBinding, ClassCountDataObject, PropertyCountDataObject, QualityMeasureDataObject, LanguageListDataObject } from './DataTypes.js';

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
// export function classAndPropertiesDataFill() {
//     Logger.info("classAndPropertiesDataFill START")
//     let classPartitionQuery = `CONSTRUCT { ?classPartition <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl ;
//             <http://rdfs.org/ns/void#class> ?c ;
//             <http://rdfs.org/ns/void#triples> ?ct ;
//             <http://rdfs.org/ns/void#classes> ?cc ;
//             <http://rdfs.org/ns/void#properties> ?cp ;
//             <http://rdfs.org/ns/void#distinctSubjects> ?cs ;
//             <http://rdfs.org/ns/void#distinctObjects> ?co . 
//     } WHERE { 
//             ?metadata <http://ns.inria.fr/kg/index#curated> ?curated . 
//             ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . 
//             ?base <http://rdfs.org/ns/void#classPartition> ?classPartition . 
//             ?classPartition <http://rdfs.org/ns/void#class> ?c . 
//             OPTIONAL { ?classPartition <http://rdfs.org/ns/void#triples> ?ct . } 
//             OPTIONAL { ?classPartition <http://rdfs.org/ns/void#classes> ?cc . }
//             OPTIONAL { ?classPartition <http://rdfs.org/ns/void#properties> ?cp . } 
//             OPTIONAL { ?classPartition <http://rdfs.org/ns/void#distinctSubjects> ?cs . } 
//             OPTIONAL { ?classPartition <http://rdfs.org/ns/void#distinctObjects> ?co . } 
//             FILTER(! isBlank(?c)) 
//     }`
//     let classSet = new Set();
//     let classCountsEndpointsMap = new Map();
//     let classPropertyCountsEndpointsMap = new Map();
//     let classContentData = [];
//     return Sparql.paginatedSparqlQueryToIndeGxPromise(classPartitionQuery)
//         .then(classPartitionStore => {
//             classPartitionStore = classPartitionStore as $rdf.Store;
//             let classStatements: $rdf.Statement[] = classPartitionStore.statementsMatching(null, RDFUtils.VOID("class"), null);
//             classStatements.forEach((classStatement, i) => {
//                 let c = classStatement.subject.value; //item.c.value;
//                 classSet.add(c);
//                 (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.SD("endpoint"), null).forEach((classEndpointStatement, i) => {
//                     let endpointUrl = classEndpointStatement.object.value;
//                     if (classCountsEndpointsMap.get(c) == undefined) {
//                         classCountsEndpointsMap.set(c, { class: c });
//                     }
//                     classCountsEndpointsMap.get(c).endpoints.add(endpointUrl);
//                 });
//                 (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.VOID("triples"), null).forEach((classTriplesStatement, i) => {
//                     let ct = Number.parseInt(classTriplesStatement.object.value);
//                     let currentClassItem = classCountsEndpointsMap.get(c);
//                     if (classCountsEndpointsMap.get(c).triples == undefined) {
//                         currentClassItem.triples = 0;
//                         classCountsEndpointsMap.set(c, currentClassItem);
//                     }
//                     currentClassItem.triples = currentClassItem.triples + ct;
//                     classCountsEndpointsMap.set(c, currentClassItem);
//                 });
//                 (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.VOID("classes"), null).forEach((classClassesStatement, i) => {
//                     let cc = Number.parseInt(classClassesStatement.object.value);
//                     let currentClassItem = classCountsEndpointsMap.get(c);
//                     if (classCountsEndpointsMap.get(c).classes == undefined) {
//                         currentClassItem.classes = 0;
//                         classCountsEndpointsMap.set(c, currentClassItem);
//                     }
//                     currentClassItem.classes = currentClassItem.classes + cc;
//                     classCountsEndpointsMap.set(c, currentClassItem);
//                 });
//                 (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.VOID("properties"), null).forEach((classPropertiesStatement, i) => {
//                     let cp = Number.parseInt(classPropertiesStatement.object.value);
//                     let currentClassItem = classCountsEndpointsMap.get(c);
//                     if (classCountsEndpointsMap.get(c).properties == undefined) {
//                         currentClassItem.properties = 0;
//                         classCountsEndpointsMap.set(c, currentClassItem);
//                     }
//                     currentClassItem.properties = currentClassItem.properties + cp;
//                     classCountsEndpointsMap.set(c, currentClassItem);
//                 });
//                 (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.VOID("distinctSubjects"), null).forEach((classDistinctSubjectsStatement, i) => {
//                     let cs = Number.parseInt(classDistinctSubjectsStatement.object.value);
//                     let currentClassItem = classCountsEndpointsMap.get(c);
//                     if (classCountsEndpointsMap.get(c).distinctSubjects == undefined) {
//                         currentClassItem.distinctSubjects = 0;
//                         classCountsEndpointsMap.set(c, currentClassItem);
//                     }
//                     currentClassItem.distinctSubjects = currentClassItem.distinctSubjects + cs;
//                     classCountsEndpointsMap.set(c, currentClassItem);
//                 });
//                 (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.VOID("distinctObjects"), null).forEach((classDistinctObjectsStatement, i) => {
//                     let co = Number.parseInt(classDistinctObjectsStatement.object.value);
//                     let currentClassItem = classCountsEndpointsMap.get(c);
//                     if (classCountsEndpointsMap.get(c).distinctObjects == undefined) {
//                         currentClassItem.distinctObjects = 0;
//                         classCountsEndpointsMap.set(c, currentClassItem);
//                     }
//                     currentClassItem.distinctObjects = currentClassItem.distinctObjects + co;
//                     classCountsEndpointsMap.set(c, currentClassItem);
//                 });
//                 if (classCountsEndpointsMap.get(c).endpoints == undefined) {
//                     let currentClassItem = classCountsEndpointsMap.get(c);
//                     currentClassItem.endpoints = new Set();
//                     classCountsEndpointsMap.set(c, currentClassItem);
//                 }
//             });
//             return Promise.resolve();
//         })
//         .then(() => {
//             let classPropertyPartitionQuery = `CONSTRUCT {
//                 ?classPropertyPartition <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl  ;
//                     <http://rdfs.org/ns/void#class> ?c ;
//                     <http://rdfs.org/ns/void#property> ?p ;
//                     <http://rdfs.org/ns/void#triples> ?pt ;
//                     <http://rdfs.org/ns/void#distinctSubjects> ?ps ;
//                     <http://rdfs.org/ns/void#distinctObjects> ?po .
//             } { 
//                     ?endpoint <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . 
//                     ?metadata <http://ns.inria.fr/kg/index#curated> ?endpoint , ?base . 
//                     ?base <http://rdfs.org/ns/void#classPartition> ?classPartition . 
//                     ?classPartition <http://rdfs.org/ns/void#class> ?c . 
//                     ?classPartition <http://rdfs.org/ns/void#propertyPartition> ?classPropertyPartition . 
//                     ?classPropertyPartition <http://rdfs.org/ns/void#property> ?p . 
//                     OPTIONAL { ?classPropertyPartition <http://rdfs.org/ns/void#triples> ?pt . } 
//                     OPTIONAL { ?classPropertyPartition <http://rdfs.org/ns/void#distinctSubjects> ?ps . } 
//                     OPTIONAL { ?classPropertyPartition <http://rdfs.org/ns/void#distinctObjects> ?po . } 
//                     FILTER(! isBlank(?c)) 
//             }`;
//             return Sparql.paginatedSparqlQueryToIndeGxPromise(classPropertyPartitionQuery).then(classPropertyStore => {
//                 classPropertyStore = classPropertyStore as $rdf.Store;
//                 (classPropertyStore as $rdf.Store).statementsMatching(null, RDFUtils.VOID("class"), null).forEach((classPropertyStatement, i) => {
//                     let partitionNode = classPropertyStatement.subject;
//                     let c = classPropertyStatement.object.value;
//                     classSet.add(c);
//                     if (classPropertyCountsEndpointsMap.get(c) == undefined) {
//                         classPropertyCountsEndpointsMap.set(c, new Map());
//                     }
//                     (classPropertyStore as $rdf.Store).statementsMatching(partitionNode, RDFUtils.VOID("property"), null).forEach((propertyStatement, i) => {
//                         let p = propertyStatement.object.value;
//                         if (classPropertyCountsEndpointsMap.get(c).get(p) == undefined) {
//                             classPropertyCountsEndpointsMap.get(c).set(p, { property: p });
//                         }
//                         (classPropertyStore as $rdf.Store).statementsMatching(partitionNode, RDFUtils.SD("endpoint"), null).forEach((endpointStatement, i) => {
//                             let endpointUrl = endpointStatement.object.value;
//                             if (classPropertyCountsEndpointsMap.get(c).get(p).endpoints == undefined) {
//                                 classPropertyCountsEndpointsMap.get(c).get(p).endpoints = new Set();
//                             }
//                             classPropertyCountsEndpointsMap.get(c).get(p).endpoints.add(endpointUrl);
//                         });
//                         (classPropertyStore as $rdf.Store).statementsMatching(partitionNode, RDFUtils.VOID("triples"), null).forEach((triplesStatement, i) => {
//                             let pt = Number.parseInt(triplesStatement.object.value);
//                             if (classPropertyCountsEndpointsMap.get(c).get(p).triples == undefined) {
//                                 classPropertyCountsEndpointsMap.get(c).get(p).triples = 0;
//                             }
//                             classPropertyCountsEndpointsMap.get(c).get(p).triples = classPropertyCountsEndpointsMap.get(c).get(p).triples + pt;
//                         });
//                         (classPropertyStore as $rdf.Store).statementsMatching(partitionNode, RDFUtils.VOID("distinctSubjects"), null).forEach((distinctSubjectsStatement, i) => {
//                             let ps = Number.parseInt(distinctSubjectsStatement.object.value);
//                             if (classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects == undefined) {
//                                 classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects = 0;
//                             }
//                             classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects = classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects + ps;
//                         });
//                         (classPropertyStore as $rdf.Store).statementsMatching(partitionNode, RDFUtils.VOID("distinctObjects"), null).forEach((distinctObjectsStatement, i) => {
//                             let po = Number.parseInt(distinctObjectsStatement.object.value);
//                             if (classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects == undefined) {
//                                 classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects = 0;
//                             }
//                             classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects = classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects + po;
//                         });
//                     })
//                 });
//                 return Promise.resolve();
//             });
//         })
//         .then(() => {
//             classSet.forEach(className => {
//                 let classCountItem = classCountsEndpointsMap.get(className);
//                 let classItem = classCountItem;
//                 if (classCountItem == undefined) {
//                     classItem = { class: className };
//                 }
//                 if (classItem.endpoints != undefined) {
//                     classItem.endpoints = [...classItem.endpoints]
//                 }
//                 let classPropertyItem = classPropertyCountsEndpointsMap.get(className);
//                 if (classPropertyItem != undefined) {
//                     classItem.propertyPartitions = [];
//                     classPropertyItem.forEach((propertyPartitionItem, propertyName, map1) => {
//                         propertyPartitionItem.endpoints = [...propertyPartitionItem.endpoints]
//                         classItem.propertyPartitions.push(propertyPartitionItem);
//                     });
//                 }
//                 classContentData.push(classItem)
//             })
//             try {
//                 let content = JSON.stringify(classContentData);
//                 return Global.writeFile(Global.getCachedFilenameForRunset(classPropertyDataFilename), content).then(() => {
//                     Logger.info("classAndPropertiesDataFill END")
//                     return Promise.resolve();
//                 })
//             } catch (err) {
//                 Logger.error(err)
//                 return Promise.reject(err);
//             }
//         })
//         .catch(error => {
//             Logger.error(error)
//             return Promise.reject(error);
//         })
// }

// export function datasetDescriptionDataFill() {
//     Logger.info("datasetDescriptionDataDataFill START")
//     let provenanceWhoCheckQuery = `SELECT DISTINCT ?endpointUrl ?o { 
//             ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset . 
//             { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
//             UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl }
//             UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
//             OPTIONAL {
//                 { ?dataset <http://purl.org/dc/terms/creator> ?o }
//                 UNION { ?dataset <http://purl.org/dc/terms/contributor> ?o }
//                 UNION { ?dataset <http://purl.org/dc/terms/publisher> ?o }
//             }
//     }`;
//     let provenanceLicenseCheckQuery = `SELECT DISTINCT ?endpointUrl ?o { 
//             ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset .
//             { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
//             UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl } 
//             UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
//             OPTIONAL {
//                 { ?dataset <http://purl.org/dc/terms/license> ?o } 
//                 UNION {?dataset <http://purl.org/dc/terms/conformsTo> ?o }
//             } 
//     } `;
//     let provenanceDateCheckQuery = `SELECT DISTINCT ?endpointUrl ?o { 
//             ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset . 
//             { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
//             UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl }
//             UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
//             OPTIONAL {
//                 { ?dataset <http://purl.org/dc/terms/modified> ?o }
//                 UNION { ?dataset <http://www.w3.org/ns/prov#wasGeneratedAtTime> ?o } 
//                 UNION { ?dataset <http://purl.org/dc/terms/issued> ?o }
//             }
//     } `;
//     let provenanceSourceCheckQuery = `SELECT DISTINCT ?endpointUrl ?o {
//             ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset .
//             { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
//             UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl }
//             UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
//             OPTIONAL {
//                 { ?dataset <http://purl.org/dc/terms/source> ?o } 
//                 UNION { ?dataset <http://www.w3.org/ns/prov#wasDerivedFrom> ?o }
//                 UNION { ?dataset <http://purl.org/dc/terms/format> ?o }
//             }
//     } `;
//     let endpointDescriptionElementMap = new Map();
//     return Promise.allSettled([
//         Sparql.paginatedSparqlQueryToIndeGxPromise(provenanceWhoCheckQuery)
//             .then(json => {
//                 (json as JSONValue[]).forEach((item, i) => {
//                     let endpointUrl = item["endpointUrl"].value;
//                     let who = (item["o"] != undefined);
//                     let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl)
//                     if (currentEndpointItem == undefined) {
//                         endpointDescriptionElementMap.set(endpointUrl, { endpoint: endpointUrl })
//                         currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
//                     }
//                     currentEndpointItem.who = who;
//                     if (who) {
//                         currentEndpointItem.whoValue = item["o"].value;
//                     }
//                     endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
//                 })
//                 return Promise.resolve();
//             }),
//         Sparql.paginatedSparqlQueryToIndeGxPromise(provenanceLicenseCheckQuery)
//             .then(json => {
//                 (json as JSONValue[]).forEach((item, i) => {
//                     let endpointUrl = item["endpointUrl"].value;
//                     let license = (item["o"] != undefined);
//                     let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl)
//                     if (currentEndpointItem == undefined) {
//                         endpointDescriptionElementMap.set(endpointUrl, { endpoint: endpointUrl })
//                         currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
//                     }
//                     currentEndpointItem.license = license;
//                     if (license) {
//                         currentEndpointItem.licenseValue = item["o"].value;
//                     }
//                     endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
//                 })
//                 return Promise.resolve();
//             })
//             .catch(error => {
//                 Logger.error(error)
//                 return Promise.reject(error);
//             })
//         ,
//         Sparql.paginatedSparqlQueryToIndeGxPromise(provenanceDateCheckQuery)
//             .then(json => {
//                 (json as JSONValue[]).forEach((item, i) => {
//                     let endpointUrl = item["endpointUrl"].value;
//                     let time = (item["o"] != undefined);
//                     let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl)
//                     if (currentEndpointItem == undefined) {
//                         endpointDescriptionElementMap.set(endpointUrl, { endpoint: endpointUrl })
//                         currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
//                     }
//                     currentEndpointItem.time = time;
//                     if (time) {
//                         currentEndpointItem.timeValue = item["o"].value;
//                     }
//                     endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
//                 })
//                 return Promise.resolve();
//             })
//             .catch(error => {
//                 Logger.error(error)
//                 return Promise.reject(error);
//             })
//         ,
//         Sparql.paginatedSparqlQueryToIndeGxPromise(provenanceSourceCheckQuery)
//             .then(json => {
//                 (json as JSONValue[]).forEach((item, i) => {
//                     let endpointUrl = item["endpointUrl"].value;
//                     let source = (item["o"] != undefined);
//                     let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl)
//                     if (currentEndpointItem == undefined) {
//                         endpointDescriptionElementMap.set(endpointUrl, { endpoint: endpointUrl })
//                         currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
//                     }
//                     currentEndpointItem.source = source;
//                     if (source) {
//                         currentEndpointItem.sourceValue = item["o"].value;
//                     }
//                     endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
//                 });
//                 return Promise.resolve();
//             })
//             .catch(error => {
//                 Logger.error(error)
//                 return Promise.reject(error);
//             })
//     ]).then(() => {

//         let datasetDescriptionData = [];
//         endpointDescriptionElementMap.forEach((prov, endpoint, map) => {
//             datasetDescriptionData.push(prov)
//         });
//         return Promise.resolve(datasetDescriptionData);
//     })
//         .then(datasetDescriptionData => {
//             try {
//                 let content = JSON.stringify(datasetDescriptionData);
//                 return Global.writeFile(Global.getCachedFilenameForRunset(datasetDescriptionDataFilename), content).then(() => {
//                     Logger.info("datasetDescriptionDataDataFill END")
//                     return Promise.resolve();
//                 });
//             } catch (err) {
//                 Logger.error(err)
//             }
//         })
//         .catch(error => {
//             Logger.error(error)
//             return Promise.reject(error);
//         });
// }