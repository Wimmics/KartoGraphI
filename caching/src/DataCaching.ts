import * as fs from 'node:fs';
import * as $rdf from "rdflib";
import dayjs, { Dayjs } from "dayjs";
import duration from 'dayjs/plugin/duration.js';
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
dayjs.extend(duration);
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
import md5 from 'md5';
import * as Global from "./GlobalUtils.js";
import * as Logger from "./LogUtils.js";
import * as Sparql from "./SparqlUtils.js";
import * as RDFUtils from "./RDFUtils.js";
import { ClassCountDataObject, EndpointIpGeolocObject, EndpointItem, EndpointTestObject, JSONValue, KeywordsEndpointDataObject, RunSetObject, SPARQLJSONResult, TimezoneMapObject, TripleCountDataObject, VocabEndpointDataObject } from './DataTypes';

const dataFilePrefix = "./data/";
export const dataCachedFilePrefix = "./data/cache/";
const timezoneMap = Global.readJSONFile(dataFilePrefix + 'timezoneMap.json');
const endpointIpMap = Global.readJSONFile(dataFilePrefix + 'endpointIpGeoloc.json');

export const geolocFilename = "geolocData";
export const sparqlCoverageFilename = "sparqlCoverageData";
export const sparqlFeaturesFilename = "sparqlFeaturesData";
export const vocabEndpointFilename = "vocabEndpointData";
// export const knownVocabsFilename = "knownVocabsData";
export const endpointKeywordsFilename = "endpointKeywordsData";
export const tripleCountFilename = "tripleCountData";
export const classCountFilename = "classCountData";
export const propertyCountFilename = "propertyCountData";
export const categoryTestCountFilename = "categoryTestCountData";
export const totalCategoryTestCountFilename = "totalCategoryTestCountData";
export const endpointTestsDataFilename = "endpointTestsData";
export const totalRuntimeDataFilename = "totalRuntimeData";
export const averageRuntimeDataFilename = "averageRuntimeData";
export const classPropertyDataFilename = "classPropertyData";
export const datasetDescriptionDataFilename = "datasetDescriptionData";
export const shortUriDataFilename = "shortUriData";
export const rdfDataStructureDataFilename = "rdfDataStructureData";
export const readableLabelDataFilename = "readableLabelData";
export const blankNodesDataFilename = "blankNodesData";

export const LOVFilename = dataFilePrefix + "knownVocabulariesLOV.json"
let knownVocabularies = new Set();


// https://obofoundry.org/ // No ontology URL available in ontology description
// http://prefix.cc/context // done
// http://data.bioontology.org/resource_index/resources?apikey=b86b12d8-dc46-4528-82e3-13fbdabf5191 // No ontology URL available in ontology description
// https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/list // done

// Retrieval of the list of LOV vocabularies to filter the ones retrieved in the index
export function retrieveKnownVocabularies() {
    return Global.fetchJSONPromise("https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/list")
        .then(responseLOV => {
            if (responseLOV !== undefined) {
                (responseLOV as JSONValue[]).forEach((item) => {
                    knownVocabularies.add(item["uri"])
                });
                try {
                    let content = JSON.stringify(responseLOV);
                    return Global.writeFile(LOVFilename, content).then(() => {
                        return Promise.resolve(knownVocabularies);
                    });
                } catch (err) {
                    Logger.error(err)
                    return Promise.reject(err);
                }
            } else {
                return Promise.reject("LOV response is undefined");
            }
        })
        .then(knownVocabularies => Global.fetchJSONPromise("http://prefix.cc/context")
            .then(responsePrefixCC => {
                for (let prefix of Object.keys(responsePrefixCC['@context'])) {
                    knownVocabularies.add(responsePrefixCC['@context'][prefix])
                };
                return Promise.resolve(knownVocabularies);
            }))
        .then(knownVocabularies => Global.fetchJSONPromise("https://www.ebi.ac.uk/ols/api/ontologies?page=0&size=1000")
            .then(responseOLS => {
                responseOLS["_embedded"].ontologies.forEach(ontologyItem => {
                    if (ontologyItem.config.baseUris.length > 0) {
                        let ontology = ontologyItem.config.baseUris[0]
                        knownVocabularies.add(ontology);
                    }
                });
                return Promise.resolve(knownVocabularies);
            }))
}

export function endpointMapfill() {
    Logger.info("endpointMapfill START")
    let endpointGeolocData = [];

    // Marked map with the geoloc of each endpoint
    return endpointIpMap.then(endpointIpMap => {
        endpointIpMapArray = endpointIpMap as EndpointIpGeolocObject[];
        return Promise.resolve();
    })
        .then(() => {
            let endpointListForRunsetQuery = `SELECT DISTINCT ?endpoint {
                ?base <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint .
                ?metadata <http://ns.inria.fr/kg/index#curated> ?base .
        }`;
            return Sparql.paginatedSparqlQueryToIndeGxPromise(endpointListForRunsetQuery).then(jsonResponse => {
                (jsonResponse as JSONValue[]).forEach((itemResponse, i) => {
                    endpointSet.add(itemResponse["endpoint"].value);
                });
                return Promise.resolve();
            })
        })
        .then(() => {
            let timezoneSPARQLquery = `SELECT DISTINCT ?timezone ?endpoint { 
                ?base <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . 
                ?metadata <http://ns.inria.fr/kg/index#curated> ?base . 
                ?base <https://schema.org/broadcastTimezone> ?timezone .
        }`;
            return Sparql.paginatedSparqlQueryToIndeGxPromise(timezoneSPARQLquery)
                .then(jsonResponse => {
                    if (jsonResponse != undefined) {
                        (jsonResponse as JSONValue[]).forEach((itemResponse, i) => {
                            endpointTimezoneSPARQL.set(itemResponse["endpoint"].value, itemResponse["timezone"].value);
                        });
                    }
                    return Promise.resolve();
                })
        })
        .then(() => {
            let labelQuery = `SELECT DISTINCT ?label ?endpoint { 
                    ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . 
                    { ?dataset <http://www.w3.org/2000/01/rdf-schema#label> ?label } 
                    UNION { ?dataset <http://www.w3.org/2004/02/skos/core#prefLabel> ?label } 
                    UNION { ?dataset <http://purl.org/dc/terms/title> ?label } 
                    UNION { ?dataset <http://xmlns.com/foaf/0.1/name> ?label } 
                    UNION { ?dataset <http://schema.org/name> ?label } . 
            }`;
            return Sparql.sparqlQueryToIndeGxPromise(labelQuery)
                .then(responseLabels => {
                    responseLabels = responseLabels as SPARQLJSONResult;
                    if (responseLabels != undefined
                        && responseLabels.results != undefined
                        && responseLabels.results.bindings != undefined) {
                        responseLabels.results.bindings.forEach((itemResponse, i) => {
                            endpointLabelMap.set(itemResponse["endpoint"].value, itemResponse["label"].value);
                        });
                    }
                })
        })
        .then(() => {
            let endpointItemMap = new Map<string, any>();
            return Promise.allSettled((endpointIpMapArray as EndpointIpGeolocObject[]).map((item) => {
                if (item !== undefined) {
                    // Add the markers for each endpoints.
                    let endpoint = item.key;
                    let endpointItem: EndpointItem;

                    if (endpointSet.has(endpoint)) {
                        return timezoneMap.then(timeZoneMapArray => {
                            let ipTimezoneArrayFiltered = (timeZoneMapArray as TimezoneMapObject[]).filter(itemtza => itemtza.key == item.value.geoloc.timezone);
                            let ipTimezone;
                            if (ipTimezoneArrayFiltered.length > 0) {
                                ipTimezone = ipTimezoneArrayFiltered[0].value.utc_offset.padStart(6, '-').padStart(6, '+');
                            }
                            let sparqlTimezone;
                            if (endpointTimezoneSPARQL.get(endpoint) != undefined) {
                                sparqlTimezone = endpointTimezoneSPARQL.get(endpoint).padStart(6, '-').padStart(6, '+');
                            }

                            endpointItem = { endpoint: endpoint, lat: item.value.geoloc.lat, lon: item.value.geoloc.lon, country: "", region: "", city: "", org: "", timezone: ipTimezone, sparqlTimezone: sparqlTimezone, popupHTML: "" };
                            if (item.value.geoloc.country != undefined) {
                                endpointItem.country = item.value.geoloc.country;
                            }
                            if (item.value.geoloc.regionName != undefined) {
                                endpointItem.region = item.value.geoloc.regionName;
                            }
                            if (item.value.geoloc.city != undefined) {
                                endpointItem.city = item.value.geoloc.city;
                            }
                            if (item.value.geoloc.org != undefined) {
                                endpointItem.org = item.value.geoloc.org;
                            }
                            endpointItemMap.set(endpoint, endpointItem);
                            return Promise.resolve()
                        })
                    } else {
                        return Promise.reject();
                    }
                } else {
                    return Promise.reject();
                }
            })
            ).then(() => {
                return Promise.resolve(endpointItemMap);
            });
        })
        .then(endpointItemMap => {
            endpointItemMap.forEach((endpointItem, endpoint) => {
                let popupString = `<table> <thead> <tr> <th colspan='2'> <a href='${endpointItem.endpoint}' >${endpointItem.endpoint}</a> </th> </tr> </thead></body>`;
                if (endpointItem.country != undefined) {
                    popupString += `<tr><td>Country: </td><td>${endpointItem.country}</td></tr>`;
                }
                if (endpointItem.region != undefined) {
                    popupString += `<tr><td>Region: </td><td>${endpointItem.region}</td></tr>`;
                }
                if (endpointItem.city != undefined) {
                    popupString += `<tr><td>City: </td><td>${endpointItem.city}</td></tr>`;
                }
                if (endpointItem.org != undefined) {
                    popupString += `<tr><td>Organization: </td><td>${endpointItem.org}</td></tr>`;
                }
                popupString += "</tbody></table>"
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
                return Global.writeFile(Global.getCachedFilename(geolocFilename), content)
            } catch (err) {
                Logger.error(err)
            }
        })
        .catch(error => {
            Logger.error(error)
        })
}

export function SPARQLCoverageFill() {
    Logger.info("SPARQLCoverageFill START")
    // Create an histogram of the SPARQLES rules passed by endpoint.
    let sparqlesFeatureQuery = `SELECT DISTINCT ?endpoint ?sparqlNorm (COUNT(DISTINCT ?activity) AS ?count) { 
                { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . }
                UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . }
                UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpoint . }
                ?metadata <http://ns.inria.fr/kg/index#curated> ?curated, ?dataset .
                #OPTIONAL { 
                    { ?dataset <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity . }
                    UNION { ?metadata <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity .}
                    FILTER(CONTAINS(str(?activity), ?sparqlNorm)) 
                    VALUES ?sparqlNorm { "SPARQL10" "SPARQL11" } 
                #} 
        } 
        GROUP BY ?endpoint ?sparqlNorm `;
    let jsonBaseFeatureSparqles = [];
    let sparqlFeaturesDataArray = [];
    return Sparql.paginatedSparqlQueryToIndeGxPromise(sparqlesFeatureQuery)
        .then(json => {
            let endpointSet = new Set();
            let sparql10Map = new Map();
            let sparql11Map = new Map();
            (json as JSONValue[]).forEach((bindingItem, i) => {
                let endpointUrl = bindingItem["endpoint"].value;
                endpointSet.add(endpointUrl);
                let feature = undefined;
                if (bindingItem["sparqlNorm"] != undefined) {
                    feature = bindingItem["sparqlNorm"].value;
                }
                let count = bindingItem["count"].value;
                if (feature == undefined || feature.localeCompare("SPARQL10") == 0) {
                    sparql10Map.set(endpointUrl, Number(count));
                }
                if (feature == undefined || feature.localeCompare("SPARQL11") == 0) {
                    sparql11Map.set(endpointUrl, Number(count));
                }
            });

            endpointSet.forEach((item) => {
                let sparql10 = sparql10Map.get(item);
                let sparql11 = sparql11Map.get(item);
                if (sparql10 == undefined) {
                    sparql10 = 0;
                }
                if (sparql11 == undefined) {
                    sparql11 = 0;
                }
                let sparqlJSONObject = { 'endpoint': item, 'sparql10': sparql10, 'sparql11': sparql11, 'sparqlTotal': (sparql10 + sparql11) };
                jsonBaseFeatureSparqles.push(sparqlJSONObject);
            });


        })
        .then(() => {
            const sparqlFeatureQuery = `SELECT DISTINCT ?endpoint ?activity { 
                    { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . }
                    UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . }
                    UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpoint . }
                    ?metadata <http://ns.inria.fr/kg/index#curated> ?curated, ?dataset .
                    #OPTIONAL { 
                        { ?dataset <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity . }
                        UNION { ?metadata <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity .}
                        FILTER(CONTAINS(str(?activity), ?sparqlNorm)) 
                        VALUES ?sparqlNorm { "SPARQL10" "SPARQL11" } 
                    #} 
            } GROUP BY ?endpoint ?activity `;
            let endpointFeatureMap = new Map();
            let featuresShortName = new Map();
            return Sparql.paginatedSparqlQueryToIndeGxPromise(sparqlFeatureQuery)
                .then(json => {
                    endpointFeatureMap = new Map();
                    let featuresSet = new Set();
                    (json as JSONValue[]).forEach(bindingItem => {
                        const endpointUrl = bindingItem["endpoint"].value;
                        if (!endpointFeatureMap.has(endpointUrl)) {
                            endpointFeatureMap.set(endpointUrl, new Set());
                        }
                        if (bindingItem["activity"] != undefined) {
                            const activity = bindingItem["activity"].value;
                            if (!endpointFeatureMap.has(endpointUrl)) {
                                endpointFeatureMap.set(endpointUrl, new Set());
                            }
                            featuresSet.add(activity);
                            if (featuresShortName.get(activity) == undefined) {
                                featuresShortName.set(activity, activity.replace("https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL10/SPARQLES_", "sparql10:").replace("https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL11/SPARQLES_", "sparql11:").replace(".ttl#activity", ""))
                            }
                            endpointFeatureMap.get(endpointUrl).add(featuresShortName.get(activity));
                        }
                    });
                    endpointFeatureMap.forEach((featureSet, endpointUrl, map) => {
                        let sortedFeatureArray = [...featureSet].sort((a, b) => a.localeCompare(b));
                        sparqlFeaturesDataArray.push({ endpoint: endpointUrl, features: sortedFeatureArray });
                    });

                    sparqlFeaturesDataArray.sort((a, b) => {
                        return a.endpoint.localeCompare(b.endpoint);
                    });
                })
        })
        .finally(() => {
            if (jsonBaseFeatureSparqles.length > 0) {
                try {
                    let content = JSON.stringify(jsonBaseFeatureSparqles);
                    fs.writeFileSync(Global.getCachedFilenameForRunset(sparqlCoverageFilename), content)
                } catch (err) {
                    Logger.error(err)
                }
            }
            if (sparqlFeaturesDataArray.length > 0) {
                try {
                    let content = JSON.stringify(sparqlFeaturesDataArray);
                    fs.writeFileSync(Global.getCachedFilenameForRunset(sparqlFeaturesFilename), content)
                } catch (err) {
                    Logger.error(err)
                }
            }
            Logger.info("SPARQLCoverageFill END")
        })
        .catch(error => {
            Logger.error(error)
        })
}

let endpointVocabMap: Map<string, string[]> = new Map();
let vocabKeywords: Map<string, string[]> = new Map();
let endpointKeywords: Map<string, string[]> = new Map();
export function allVocabFill(): Promise<void> {
    Logger.info("allVocabFill START")

    let sparqlQuery = `SELECT DISTINCT ?endpointUrl ?vocabulary {
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated, ?dataset .
            ?dataset <http://rdfs.org/ns/void#vocabulary> ?vocabulary .
    }`;

    return Sparql.paginatedSparqlQueryToIndeGxPromise(sparqlQuery).then(json => {
        let vocabSet = new Set();
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
        return vocabSet;
    }).then(vocabSet => {

        let vocabArray = [...vocabSet];
        let queryArray = vocabArray.map((item, i) => {
            return Global.fetchJSONPromise(`https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/info?vocab=${item}`);
        })

        return Promise.allSettled(queryArray)
            .then(jsonKeywordsArraySettled => {
                let jsonKeywordsArray = Global.extractSettledPromiseValues(jsonKeywordsArraySettled);
                jsonKeywordsArray.forEach(jsonKeywords => {
                    Logger.log(jsonKeywords)
                    if (jsonKeywords !== undefined) {
                        let vocab = jsonKeywords.uri;
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
                return Promise.resolve();
            }).then(() => {
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
                return Promise.resolve();
            })
    }).catch(error => {
        Logger.error(error)
    })
}

export function vocabFill(): Promise<void> {
    Logger.info("vocabFill START")
    let runsetsEndpointQuery = `SELECT DISTINCT ?endpointUrl { 
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
    } 
    GROUP BY ?endpointUrl ?vocabulary `;

    return Sparql.paginatedSparqlQueryToIndeGxPromise(runsetsEndpointQuery).then(json => {
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
    }).then(endpointSet => {
        let runsetEndpointVocabulary: Map<string, string[]> = new Map();
        endpointSet.forEach(endpointUrl => {
            runsetEndpointVocabulary.set(endpointUrl, endpointVocabMap.get(endpointUrl));
        })

        let runsetEndpointKeywords: Map<string, string[]> = new Map();
        endpointSet.forEach(endpointUrl => {
            runsetEndpointKeywords.set(endpointUrl, endpointKeywords.get(endpointUrl));
        });

        try {
            let endpointVocabData: VocabEndpointDataObject[] = [];
            runsetEndpointVocabulary.forEach((vocabArray, endpointUrl, map) => {
                endpointVocabData.push({ endpoint: endpointUrl, vocabularies: vocabArray });
            })
            let content = JSON.stringify(endpointVocabData);
            return Global.writeFile(Global.getCachedFilenameForRunset(vocabEndpointFilename), content)
                .then(() => {
                    let endpointKeywordsData: KeywordsEndpointDataObject[] = [];
                    runsetEndpointKeywords.forEach((keywordArray, endpointUrl, map) => {
                        endpointKeywordsData.push({ endpoint: endpointUrl, keywords: keywordArray });
                    })
                    let content = JSON.stringify(endpointKeywordsData);
                    return Global.writeFile(Global.getCachedFilenameForRunset(endpointKeywordsFilename), content)
                })
                .then(() => {
                    Logger.info("vocabFill END")
                    return Promise.resolve();
                })
        } catch (err) {
            Logger.error(err)
        }

    })

}

export function tripleDataFill() {
    Logger.info("tripleDataFill START")
    // Scatter plot of the number of triples through time
    let triplesSPARQLquery = `SELECT DISTINCT ?date ?endpointUrl (MAX(?rawO) AS ?o) {
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?curated <http://rdfs.org/ns/void#triples> ?rawO .
    } GROUP BY ?date ?endpointUrl`;

    // {?metadata <http://purl.org/dc/terms/modified> ?date .}
    // UNION { ?curated <http://purl.org/dc/terms/modified> ?date . }
    type EndpointTripleIndexItem = { date: Dayjs, triples: number };
    return Sparql.paginatedSparqlQueryToIndeGxPromise(triplesSPARQLquery)
        .then(json => {
            let endpointTriplesDataIndex: Map<string, Map<string, EndpointTripleIndexItem>> = new Map();
            let endpointTriplesData: TripleCountDataObject[] = [];
            (json as JSONValue[]).forEach((itemResult, i) => {
                let graph: string = itemResult["g"].value.replace('http://ns.inria.fr/indegx#', '');
                let date: Dayjs; //= Global.parseDate(itemResult["date"].value);
                let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
                if (rawDateUnderscoreIndex != -1) {
                    let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                    date = Global.parseDate(rawDate, "YYYYMMDD");
                }
                let endpointUrl = itemResult["endpointUrl"].value;
                let triples = Number.parseInt(itemResult["o"].value);

                if (endpointTriplesDataIndex.get(endpointUrl) == undefined) {
                    endpointTriplesDataIndex.set(endpointUrl, new Map());
                }
                if (endpointTriplesDataIndex.get(endpointUrl).get(graph) == undefined) {
                    endpointTriplesDataIndex.get(endpointUrl).set(graph, { date: date, triples: triples });
                } else {
                    let previousDate = endpointTriplesDataIndex.get(endpointUrl).get(graph).date;
                    if (date.isBefore(previousDate) && date.year() != previousDate.year() && date.month() != previousDate.month() && date.date() != previousDate.date()) {
                        endpointTriplesDataIndex.get(endpointUrl).set(graph, { date: date, triples: triples });
                    }
                }
            });
            endpointTriplesDataIndex.forEach((graphTripleMap, endpointUrl) => {
                graphTripleMap.forEach((tripleData, graph) => {
                    endpointTriplesData.push({ endpoint: endpointUrl, graph: graph, date: tripleData.date, triples: tripleData.triples })
                })
            });
            return Promise.resolve(endpointTriplesData);
        })
        .then(endpointTriplesData => {
            try {
                let content = JSON.stringify(endpointTriplesData);
                return Global.writeFile(Global.getCachedFilenameForRunset(tripleCountFilename), content).then(() => {
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

export function classDataFill() {
    Logger.info("classDataFill START")
    // Scatter plot of the number of classes through time
    let classesSPARQLquery = `SELECT DISTINCT ?endpointUrl ?date (MAX(?rawO) AS ?o) { 
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?curated <http://rdfs.org/ns/void#classes> ?rawO .
    } GROUP BY ?endpointUrl ?date`;
    // {?metadata <http://purl.org/dc/terms/modified> ?date .}
    // UNION { ?curated <http://purl.org/dc/terms/modified> ?date . }
    type EndpointClassesIndexItem = { date: Dayjs, classes: number };
    let endpointClassesDataIndex: Map<string, Map<string, EndpointClassesIndexItem>> = new Map();
    return Sparql.paginatedSparqlQueryToIndeGxPromise(classesSPARQLquery)
        .then(json => {
            let endpointClassCountData: ClassCountDataObject[] = [];
            (json as JSONValue[]).forEach((itemResult, i) => {
                let graph = itemResult["g"].value.replace('http://ns.inria.fr/indegx#', '');
                let date: Dayjs;//= Global.parseDate(itemResult["date"].value);
                let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
                if (rawDateUnderscoreIndex != -1) {
                    let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                    date = Global.parseDate(rawDate, "YYYYMMDD");
                }
                let endpointUrl = itemResult["endpointUrl"].value;
                let classes = Number.parseInt(itemResult["o"].value);
                if (endpointClassesDataIndex.get(endpointUrl) == undefined) {
                    endpointClassesDataIndex.set(endpointUrl, new Map());
                }
                if (endpointClassesDataIndex.get(endpointUrl).get(graph) == undefined) {
                    endpointClassesDataIndex.get(endpointUrl).set(graph, { date: date, classes: classes });
                } else {
                    let previousDate = endpointClassesDataIndex.get(endpointUrl).get(graph).date;
                    if (date.isBefore(previousDate) && date.year() != previousDate.year() && date.month() != previousDate.month() && date.date() != previousDate.date()) {
                        endpointClassesDataIndex.get(endpointUrl).set(graph, { date: date, classes: classes });
                    }
                }
            });
            endpointClassesDataIndex.forEach((graphClassesMap, endpointUrl) => {
                graphClassesMap.forEach((classesData, graph) => {
                    endpointClassCountData.push({ endpoint: endpointUrl, graph: graph, date: classesData.date, classes: classesData.classes })
                })
            });
            return Promise.resolve(endpointClassCountData);
        })
        .then(endpointClassCountData => {
            try {
                let content = JSON.stringify(endpointClassCountData);
                return Global.writeFile(Global.getCachedFilenameForRunset(classCountFilename), content).then(() => {
                    Logger.info("classDataFill END")
                    return Promise.resolve();
                })
            } catch (err) {
                Logger.error(err);
                return Promise.reject(err);
            }
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject(error);
        });
}

export function propertyDataFill() {
    Logger.info("propertyDataFill START")
    // scatter plot of the number of properties through time
    let propertiesSPARQLquery = `SELECT DISTINCT ?date ?endpointUrl (MAX(?rawO) AS ?o) {
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?curated <http://rdfs.org/ns/void#properties> ?rawO .
    } GROUP BY ?endpointUrl ?date`;
    // {?metadata <http://purl.org/dc/terms/modified> ?date .}
    // UNION { ?curated <http://purl.org/dc/terms/modified> ?date . }
    type EndpointPropertiesIndexItem = { date: Dayjs, properties: number };
    let endpointPropertiesDataIndex = new Map<string, EndpointPropertiesIndexItem[]>();
    return Sparql.paginatedSparqlQueryToIndeGxPromise(propertiesSPARQLquery)
        .then(json => {
            let endpointPropertyCountData = [];
            (json as JSONValue[]).forEach((itemResult, i) => {
                let endpointUrl = itemResult["endpointUrl"].value;
                let properties = Number.parseInt(itemResult["o"].value);
                let date: Dayjs = Global.parseDate(itemResult["date"].value);

                if (endpointPropertiesDataIndex.get(endpointUrl) == undefined) {
                    endpointPropertiesDataIndex.set(endpointUrl, []);
                }
                if (endpointPropertiesDataIndex.get(endpointUrl) != undefined) {
                    endpointPropertiesDataIndex.get(endpointUrl).push({ date: date, properties: properties });
                }
            });
            endpointPropertiesDataIndex.forEach((propertiesDataArray, endpointUrl) => {
                propertiesDataArray.forEach(propertiesData => {
                    endpointPropertyCountData.push({ endpoint: endpointUrl, date: propertiesData.date, properties: propertiesData.properties })
                })
            });
            return Promise.resolve(endpointPropertyCountData);
        })
        .then(endpointPropertyCountData => {
            try {
                let content = JSON.stringify(endpointPropertyCountData);
                return Global.writeFile(Global.getCachedFilenameForRunset(propertyCountFilename), content).then(() => {
                    Logger.info("propertyDataFill END")
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

export function categoryTestCountFill() {
    Logger.info("categoryTestCountFill START")
    let testCategoryData = [];
    // Number of tests passed by test categories
    let testCategoryQuery = `SELECT DISTINCT ?date ?category (count(DISTINCT ?test) AS ?count) ?endpointUrl { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?metadata <http://ns.inria.fr/kg/index#trace> ?trace . 
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?trace <http://www.w3.org/ns/earl#test> ?test . 
            ?trace <http://www.w3.org/ns/earl#result> ?result .
            ?result <http://www.w3.org/ns/earl#outcome> <http://www.w3.org/ns/earl#passed> .
            FILTER(STRSTARTS(str(?test), ?category))
            VALUES ?category { 
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/' 
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/extraction/asserted/' 
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/extraction/computed/' 
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sportal/' 
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL10/'
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL11/' 
            }
    } GROUP BY ?date ?category ?endpointUrl`;
    // {?metadata <http://purl.org/dc/terms/modified> ?date .}
    // UNION { ?curated <http://purl.org/dc/terms/modified> ?date . }
    return Sparql.paginatedSparqlQueryToIndeGxPromise(testCategoryQuery)
        .then(json => {
            (json as JSONValue[]).forEach((itemResult, i) => {
                let category = itemResult["category"].value;
                let count = itemResult["count"].value;
                let endpoint = itemResult["endpointUrl"].value;
                let date: Dayjs = Global.parseDate(itemResult["date"].value);
                testCategoryData.push({ category: category, date: date, endpoint: endpoint, count: count });
            });
            return Promise.resolve();
        })
        .then(() => {
            if (testCategoryData.length > 0) {
                try {
                    let content = JSON.stringify(testCategoryData);
                    return Global.writeFile(Global.getCachedFilenameForRunset(categoryTestCountFilename), content).then(() => {
                        Logger.info("categoryTestCountFill END")
                        return Promise.resolve();
                    });
                } catch (err) {
                    Logger.error(err)
                }
            }
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject(error);
        });
}

export function totalCategoryTestCountFill() {
    Logger.info("totalCategoryTestCountFill START")
    // Number of tests passed by test categories
    let testCategoryQuery = `SELECT DISTINCT ?category ?date (count(DISTINCT ?test) AS ?count) ?endpointUrl { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?metadata <http://ns.inria.fr/kg/index#trace> ?trace .
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?trace <http://www.w3.org/ns/earl#test> ?test .
            ?trace <http://www.w3.org/ns/earl#result> ?result .
            ?result <http://www.w3.org/ns/earl#outcome> <http://www.w3.org/ns/earl#passed> .
            FILTER(STRSTARTS(str(?test), str(?category))) 
            VALUES ?category {
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/> 
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/extraction/asserted/> 
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/extraction/computed/> 
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sportal/>
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL10/> 
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL11/> 
            } 
    } 
    GROUP BY ?date ?category ?endpointUrl 
    ORDER BY ?category `;
    // ?metadata <http://purl.org/dc/terms/modified> ?date .
    return Sparql.paginatedSparqlQueryToIndeGxPromise(testCategoryQuery).then(json => {
        let totalTestCategoryData = [];
        (json as JSONValue[]).forEach((itemResult, i) => {
            let category = itemResult["category"].value;
            let count = itemResult["count"].value;
            let endpoint = itemResult["endpointUrl"].value;
            let date: Dayjs = Global.parseDate(itemResult["date"].value);

            totalTestCategoryData.push({ category: category, endpoint: endpoint, date: date, count: count })
            return Promise.resolve(totalTestCategoryData);
        });
    })
        .then(totalTestCategoryData => {
            try {
                let content = JSON.stringify(totalTestCategoryData);
                return Global.writeFile(Global.getCachedFilenameForRunset(totalCategoryTestCountFilename), content).then(() => {
                    Logger.info("totalCategoryTestCountFill END")
                    return Promise.resolve();
                })
            } catch (err) {
                Logger.error(err)
                return Promise.reject(err);
            }
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject();
        });
}

export function classAndPropertiesDataFill() {
    Logger.info("classAndPropertiesDataFill START")
    let classPartitionQuery = `CONSTRUCT { ?classPartition <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl ;
            <http://rdfs.org/ns/void#class> ?c ;
            <http://rdfs.org/ns/void#triples> ?ct ;
            <http://rdfs.org/ns/void#classes> ?cc ;
            <http://rdfs.org/ns/void#properties> ?cp ;
            <http://rdfs.org/ns/void#distinctSubjects> ?cs ;
            <http://rdfs.org/ns/void#distinctObjects> ?co . 
    } WHERE { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated . 
            ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . 
            ?base <http://rdfs.org/ns/void#classPartition> ?classPartition . 
            ?classPartition <http://rdfs.org/ns/void#class> ?c . 
            OPTIONAL { ?classPartition <http://rdfs.org/ns/void#triples> ?ct . } 
            OPTIONAL { ?classPartition <http://rdfs.org/ns/void#classes> ?cc . }
            OPTIONAL { ?classPartition <http://rdfs.org/ns/void#properties> ?cp . } 
            OPTIONAL { ?classPartition <http://rdfs.org/ns/void#distinctSubjects> ?cs . } 
            OPTIONAL { ?classPartition <http://rdfs.org/ns/void#distinctObjects> ?co . } 
            FILTER(! isBlank(?c)) 
    }`
    let classSet = new Set();
    let classCountsEndpointsMap = new Map();
    let classPropertyCountsEndpointsMap = new Map();
    let classContentData = [];
    return Sparql.paginatedSparqlQueryToIndeGxPromise(classPartitionQuery)
        .then(classPartitionStore => {
            classPartitionStore = classPartitionStore as $rdf.Store;
            let classStatements: $rdf.Statement[] = classPartitionStore.statementsMatching(null, RDFUtils.VOID("class"), null);
            classStatements.forEach((classStatement, i) => {
                let c = classStatement.subject.value; //item.c.value;
                classSet.add(c);
                (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.SD("endpoint"), null).forEach((classEndpointStatement, i) => {
                    let endpointUrl = classEndpointStatement.object.value;
                    if (classCountsEndpointsMap.get(c) == undefined) {
                        classCountsEndpointsMap.set(c, { class: c });
                    }
                    classCountsEndpointsMap.get(c).endpoints.add(endpointUrl);
                });
                (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.VOID("triples"), null).forEach((classTriplesStatement, i) => {
                    let ct = Number.parseInt(classTriplesStatement.object.value);
                    let currentClassItem = classCountsEndpointsMap.get(c);
                    if (classCountsEndpointsMap.get(c).triples == undefined) {
                        currentClassItem.triples = 0;
                        classCountsEndpointsMap.set(c, currentClassItem);
                    }
                    currentClassItem.triples = currentClassItem.triples + ct;
                    classCountsEndpointsMap.set(c, currentClassItem);
                });
                (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.VOID("classes"), null).forEach((classClassesStatement, i) => {
                    let cc = Number.parseInt(classClassesStatement.object.value);
                    let currentClassItem = classCountsEndpointsMap.get(c);
                    if (classCountsEndpointsMap.get(c).classes == undefined) {
                        currentClassItem.classes = 0;
                        classCountsEndpointsMap.set(c, currentClassItem);
                    }
                    currentClassItem.classes = currentClassItem.classes + cc;
                    classCountsEndpointsMap.set(c, currentClassItem);
                });
                (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.VOID("properties"), null).forEach((classPropertiesStatement, i) => {
                    let cp = Number.parseInt(classPropertiesStatement.object.value);
                    let currentClassItem = classCountsEndpointsMap.get(c);
                    if (classCountsEndpointsMap.get(c).properties == undefined) {
                        currentClassItem.properties = 0;
                        classCountsEndpointsMap.set(c, currentClassItem);
                    }
                    currentClassItem.properties = currentClassItem.properties + cp;
                    classCountsEndpointsMap.set(c, currentClassItem);
                });
                (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.VOID("distinctSubjects"), null).forEach((classDistinctSubjectsStatement, i) => {
                    let cs = Number.parseInt(classDistinctSubjectsStatement.object.value);
                    let currentClassItem = classCountsEndpointsMap.get(c);
                    if (classCountsEndpointsMap.get(c).distinctSubjects == undefined) {
                        currentClassItem.distinctSubjects = 0;
                        classCountsEndpointsMap.set(c, currentClassItem);
                    }
                    currentClassItem.distinctSubjects = currentClassItem.distinctSubjects + cs;
                    classCountsEndpointsMap.set(c, currentClassItem);
                });
                (classPartitionStore as $rdf.Store).statementsMatching(classStatement.subject, RDFUtils.VOID("distinctObjects"), null).forEach((classDistinctObjectsStatement, i) => {
                    let co = Number.parseInt(classDistinctObjectsStatement.object.value);
                    let currentClassItem = classCountsEndpointsMap.get(c);
                    if (classCountsEndpointsMap.get(c).distinctObjects == undefined) {
                        currentClassItem.distinctObjects = 0;
                        classCountsEndpointsMap.set(c, currentClassItem);
                    }
                    currentClassItem.distinctObjects = currentClassItem.distinctObjects + co;
                    classCountsEndpointsMap.set(c, currentClassItem);
                });
                if (classCountsEndpointsMap.get(c).endpoints == undefined) {
                    let currentClassItem = classCountsEndpointsMap.get(c);
                    currentClassItem.endpoints = new Set();
                    classCountsEndpointsMap.set(c, currentClassItem);
                }
            });
            return Promise.resolve();
        })
        .then(() => {
            let classPropertyPartitionQuery = `CONSTRUCT {
                ?classPropertyPartition <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl  ;
                    <http://rdfs.org/ns/void#class> ?c ;
                    <http://rdfs.org/ns/void#property> ?p ;
                    <http://rdfs.org/ns/void#triples> ?pt ;
                    <http://rdfs.org/ns/void#distinctSubjects> ?ps ;
                    <http://rdfs.org/ns/void#distinctObjects> ?po .
            } { 
                    ?endpoint <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . 
                    ?metadata <http://ns.inria.fr/kg/index#curated> ?endpoint , ?base . 
                    ?base <http://rdfs.org/ns/void#classPartition> ?classPartition . 
                    ?classPartition <http://rdfs.org/ns/void#class> ?c . 
                    ?classPartition <http://rdfs.org/ns/void#propertyPartition> ?classPropertyPartition . 
                    ?classPropertyPartition <http://rdfs.org/ns/void#property> ?p . 
                    OPTIONAL { ?classPropertyPartition <http://rdfs.org/ns/void#triples> ?pt . } 
                    OPTIONAL { ?classPropertyPartition <http://rdfs.org/ns/void#distinctSubjects> ?ps . } 
                    OPTIONAL { ?classPropertyPartition <http://rdfs.org/ns/void#distinctObjects> ?po . } 
                    FILTER(! isBlank(?c)) 
            }`;
            return Sparql.paginatedSparqlQueryToIndeGxPromise(classPropertyPartitionQuery).then(classPropertyStore => {
                classPropertyStore = classPropertyStore as $rdf.Store;
                (classPropertyStore as $rdf.Store).statementsMatching(null, RDFUtils.VOID("class"), null).forEach((classPropertyStatement, i) => {
                    let partitionNode = classPropertyStatement.subject;
                    let c = classPropertyStatement.object.value;
                    classSet.add(c);
                    if (classPropertyCountsEndpointsMap.get(c) == undefined) {
                        classPropertyCountsEndpointsMap.set(c, new Map());
                    }
                    (classPropertyStore as $rdf.Store).statementsMatching(partitionNode, RDFUtils.VOID("property"), null).forEach((propertyStatement, i) => {
                        let p = propertyStatement.object.value;
                        if (classPropertyCountsEndpointsMap.get(c).get(p) == undefined) {
                            classPropertyCountsEndpointsMap.get(c).set(p, { property: p });
                        }
                        (classPropertyStore as $rdf.Store).statementsMatching(partitionNode, RDFUtils.SD("endpoint"), null).forEach((endpointStatement, i) => {
                            let endpointUrl = endpointStatement.object.value;
                            if (classPropertyCountsEndpointsMap.get(c).get(p).endpoints == undefined) {
                                classPropertyCountsEndpointsMap.get(c).get(p).endpoints = new Set();
                            }
                            classPropertyCountsEndpointsMap.get(c).get(p).endpoints.add(endpointUrl);
                        });
                        (classPropertyStore as $rdf.Store).statementsMatching(partitionNode, RDFUtils.VOID("triples"), null).forEach((triplesStatement, i) => {
                            let pt = Number.parseInt(triplesStatement.object.value);
                            if (classPropertyCountsEndpointsMap.get(c).get(p).triples == undefined) {
                                classPropertyCountsEndpointsMap.get(c).get(p).triples = 0;
                            }
                            classPropertyCountsEndpointsMap.get(c).get(p).triples = classPropertyCountsEndpointsMap.get(c).get(p).triples + pt;
                        });
                        (classPropertyStore as $rdf.Store).statementsMatching(partitionNode, RDFUtils.VOID("distinctSubjects"), null).forEach((distinctSubjectsStatement, i) => {
                            let ps = Number.parseInt(distinctSubjectsStatement.object.value);
                            if (classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects == undefined) {
                                classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects = 0;
                            }
                            classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects = classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects + ps;
                        });
                        (classPropertyStore as $rdf.Store).statementsMatching(partitionNode, RDFUtils.VOID("distinctObjects"), null).forEach((distinctObjectsStatement, i) => {
                            let po = Number.parseInt(distinctObjectsStatement.object.value);
                            if (classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects == undefined) {
                                classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects = 0;
                            }
                            classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects = classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects + po;
                        });
                    })
                });
                return Promise.resolve();
            });
        })
        .then(() => {
            classSet.forEach(className => {
                let classCountItem = classCountsEndpointsMap.get(className);
                let classItem = classCountItem;
                if (classCountItem == undefined) {
                    classItem = { class: className };
                }
                if (classItem.endpoints != undefined) {
                    classItem.endpoints = [...classItem.endpoints]
                }
                let classPropertyItem = classPropertyCountsEndpointsMap.get(className);
                if (classPropertyItem != undefined) {
                    classItem.propertyPartitions = [];
                    classPropertyItem.forEach((propertyPartitionItem, propertyName, map1) => {
                        propertyPartitionItem.endpoints = [...propertyPartitionItem.endpoints]
                        classItem.propertyPartitions.push(propertyPartitionItem);
                    });
                }
                classContentData.push(classItem)
            })
            try {
                let content = JSON.stringify(classContentData);
                return Global.writeFile(Global.getCachedFilenameForRunset(classPropertyDataFilename), content).then(() => {
                    Logger.info("classAndPropertiesDataFill END")
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
        })
}

export function datasetDescriptionDataFill() {
    Logger.info("datasetDescriptionDataDataFill START")
    let provenanceWhoCheckQuery = `SELECT DISTINCT ?endpointUrl ?o { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset . 
            { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
            UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl }
            UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
            OPTIONAL {
                { ?dataset <http://purl.org/dc/terms/creator> ?o }
                UNION { ?dataset <http://purl.org/dc/terms/contributor> ?o }
                UNION { ?dataset <http://purl.org/dc/terms/publisher> ?o }
            }
    }`;
    let provenanceLicenseCheckQuery = `SELECT DISTINCT ?endpointUrl ?o { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset .
            { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl } 
            UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
            OPTIONAL {
                { ?dataset <http://purl.org/dc/terms/license> ?o } 
                UNION {?dataset <http://purl.org/dc/terms/conformsTo> ?o }
            } 
    } `;
    let provenanceDateCheckQuery = `SELECT DISTINCT ?endpointUrl ?o { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset . 
            { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl }
            UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
            OPTIONAL {
                { ?dataset <http://purl.org/dc/terms/modified> ?o }
                UNION { ?dataset <http://www.w3.org/ns/prov#wasGeneratedAtTime> ?o } 
                UNION { ?dataset <http://purl.org/dc/terms/issued> ?o }
            }
    } `;
    let provenanceSourceCheckQuery = `SELECT DISTINCT ?endpointUrl ?o {
            ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset .
            { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl }
            UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
            OPTIONAL {
                { ?dataset <http://purl.org/dc/terms/source> ?o } 
                UNION { ?dataset <http://www.w3.org/ns/prov#wasDerivedFrom> ?o }
                UNION { ?dataset <http://purl.org/dc/terms/format> ?o }
            }
    } `;
    let endpointDescriptionElementMap = new Map();
    return Promise.allSettled([
        Sparql.paginatedSparqlQueryToIndeGxPromise(provenanceWhoCheckQuery)
            .then(json => {
                (json as JSONValue[]).forEach((item, i) => {
                    let endpointUrl = item["endpointUrl"].value;
                    let who = (item["o"] != undefined);
                    let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl)
                    if (currentEndpointItem == undefined) {
                        endpointDescriptionElementMap.set(endpointUrl, { endpoint: endpointUrl })
                        currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                    }
                    currentEndpointItem.who = who;
                    if (who) {
                        currentEndpointItem.whoValue = item["o"].value;
                    }
                    endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
                })
                return Promise.resolve();
            }),
        Sparql.paginatedSparqlQueryToIndeGxPromise(provenanceLicenseCheckQuery)
            .then(json => {
                (json as JSONValue[]).forEach((item, i) => {
                    let endpointUrl = item["endpointUrl"].value;
                    let license = (item["o"] != undefined);
                    let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl)
                    if (currentEndpointItem == undefined) {
                        endpointDescriptionElementMap.set(endpointUrl, { endpoint: endpointUrl })
                        currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                    }
                    currentEndpointItem.license = license;
                    if (license) {
                        currentEndpointItem.licenseValue = item["o"].value;
                    }
                    endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
                })
                return Promise.resolve();
            })
            .catch(error => {
                Logger.error(error)
                return Promise.reject(error);
            })
        ,
        Sparql.paginatedSparqlQueryToIndeGxPromise(provenanceDateCheckQuery)
            .then(json => {
                (json as JSONValue[]).forEach((item, i) => {
                    let endpointUrl = item["endpointUrl"].value;
                    let time = (item["o"] != undefined);
                    let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl)
                    if (currentEndpointItem == undefined) {
                        endpointDescriptionElementMap.set(endpointUrl, { endpoint: endpointUrl })
                        currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                    }
                    currentEndpointItem.time = time;
                    if (time) {
                        currentEndpointItem.timeValue = item["o"].value;
                    }
                    endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
                })
                return Promise.resolve();
            })
            .catch(error => {
                Logger.error(error)
                return Promise.reject(error);
            })
        ,
        Sparql.paginatedSparqlQueryToIndeGxPromise(provenanceSourceCheckQuery)
            .then(json => {
                (json as JSONValue[]).forEach((item, i) => {
                    let endpointUrl = item["endpointUrl"].value;
                    let source = (item["o"] != undefined);
                    let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl)
                    if (currentEndpointItem == undefined) {
                        endpointDescriptionElementMap.set(endpointUrl, { endpoint: endpointUrl })
                        currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                    }
                    currentEndpointItem.source = source;
                    if (source) {
                        currentEndpointItem.sourceValue = item["o"].value;
                    }
                    endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
                });
                return Promise.resolve();
            })
            .catch(error => {
                Logger.error(error)
                return Promise.reject(error);
            })
    ]).then(() => {

        let datasetDescriptionData = [];
        endpointDescriptionElementMap.forEach((prov, endpoint, map) => {
            datasetDescriptionData.push(prov)
        });
        return Promise.resolve(datasetDescriptionData);
    })
        .then(datasetDescriptionData => {
            try {
                let content = JSON.stringify(datasetDescriptionData);
                return Global.writeFile(Global.getCachedFilenameForRunset(datasetDescriptionDataFilename), content).then(() => {
                    Logger.info("datasetDescriptionDataDataFill END")
                    return Promise.resolve();
                });
            } catch (err) {
                Logger.error(err)
            }
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject(error);
        });
}

export function shortUrisDataFill() {
    Logger.info("shortUrisDataFill START")
    let shortUrisMeasureQuery = `SELECT DISTINCT ?date ?endpointUrl ?measure {
                { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
                UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
                ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
                ?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode .
                ?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/shortUris.ttl> .
                ?measureNode <http://www.w3.org/ns/dqv#value> ?measure .
        } GROUP BY ?date ?endpointUrl ?measure`;
    // ?metadata <http://purl.org/dc/terms/modified> ?date . 
    return Sparql.paginatedSparqlQueryToIndeGxPromise(shortUrisMeasureQuery)
        .then(json => {
            let shortUriData = [];
            (json as JSONValue[]).forEach((jsonItem, i) => {
                let endpoint = jsonItem["endpointUrl"].value;
                let shortUriMeasure = Number.parseFloat(Global.precise(Number.parseFloat(jsonItem["measure"].value) * 100));
                let date: Dayjs = Global.parseDate(jsonItem["date"].value);
                shortUriData.push({ date: date, endpoint: endpoint, measure: shortUriMeasure })
            });
            return Promise.resolve(shortUriData);
        })
        .then(shortUriData => {
            if (shortUriData.length > 0) {
                try {
                    let content = JSON.stringify(shortUriData);
                    fs.writeFileSync(Global.getCachedFilenameForRunset(shortUriDataFilename), content)
                } catch (err) {
                    Logger.error(err)
                }
            }
            Logger.info("shortUrisDataFill END")
            return Promise.resolve();
        })
        .catch(error => {
            Logger.error(error)
            return Promise.reject(error);
        });
}

export function readableLabelsDataFill() {
    Logger.info("readableLabelsDataFill START")
    let readableLabelsQuery = `SELECT DISTINCT ?date ?endpointUrl ?measure { 
                { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
                UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
                ?metadata <http://ns.inria.fr/kg/index#curated> ?curated . 
                ?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode . 
                ?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/readableLabels.ttl> . 
                ?measureNode <http://www.w3.org/ns/dqv#value> ?measure . 
        } GROUP BY ?date ?endpointUrl ?measure`;
    // ?metadata <http://purl.org/dc/terms/modified> ?date . 

    return Sparql.paginatedSparqlQueryToIndeGxPromise(readableLabelsQuery)
        .then(json => {
            let readableLabelData = [];
            (json as JSONValue[]).forEach((jsonItem, i) => {
                let endpoint = jsonItem["endpointUrl"].value;
                let readableLabelMeasure = Number.parseFloat(Global.precise(Number.parseFloat(jsonItem["measure"].value) * 100));
                let date: Dayjs = Global.parseDate(jsonItem["date"].value);

                readableLabelData.push({ date: date, endpoint: endpoint, measure: readableLabelMeasure })
            });
            return Promise.resolve(readableLabelData);
        })
        .then(readableLabelData => {
            if (readableLabelData.length > 0) {
                try {
                    let content = JSON.stringify(readableLabelData);
                    return Global.writeFile(Global.getCachedFilenameForRunset(readableLabelDataFilename), content).then(() => {
                        Logger.info("readableLabelsDataFill END")
                        return Promise.resolve();
                    });
                } catch (err) {
                    Logger.error(err)
                }
            }
            return Promise.resolve();
        })
        .catch(error => {
            Logger.error(error);
            return Promise.reject(error);
        });
}

export function rdfDataStructureDataFill() {
    Logger.info("rdfDataStructureDataFill START")
    let rdfDataStructureQuery = `SELECT DISTINCT ?date ?endpointUrl ?measure { 
                { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
                UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
                ?metadata <http://ns.inria.fr/kg/index#curated> ?curated . 
                ?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode . 
                ?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/RDFDataStructures.ttl> . 
                ?measureNode <http://www.w3.org/ns/dqv#value> ?measure . 
            }
        GROUP BY ?date ?endpointUrl ?measure` ;
    // ?metadata <http://purl.org/dc/terms/modified> ?date . 

    return Sparql.paginatedSparqlQueryToIndeGxPromise(rdfDataStructureQuery).then(json => {
        let rdfDataStructureData = [];
        (json as JSONValue[]).forEach((jsonItem, i) => {
            let endpoint = jsonItem["endpointUrl"].value;
            let rdfDataStructureMeasure = Number.parseFloat(Global.precise(Number.parseFloat(jsonItem["measure"].value) * 100));
            let date: Dayjs = Global.parseDate(jsonItem["date"].value);

            rdfDataStructureData.push({ date: date, endpoint: endpoint, measure: rdfDataStructureMeasure })
        });
        return Promise.resolve(rdfDataStructureData);
    })
        .then(rdfDataStructureData => {
            try {
                let content = JSON.stringify(rdfDataStructureData);
                return Global.writeFile(Global.getCachedFilenameForRunset(rdfDataStructureDataFilename), content).then(() => {
                    Logger.info("rdfDataStructureDataFill END");
                    return;
                })

            } catch (err) {
                Logger.error(err)
            }
            return Promise.resolve();
        })
        .catch(error => {
            Logger.error(error);
        });
}

export function blankNodeDataFill() {
    Logger.info("blankNodeDataFill START")
    let blankNodeQuery = `PREFIX dcat: <http://www.w3.org/ns/dcat#>
        PREFIX dct: <http://purl.org/dc/terms/>
        PREFIX sd: <http://www.w3.org/ns/sparql-service-description#>
        PREFIX void: <http://rdfs.org/ns/void#>
        PREFIX kgi: <http://ns.inria.fr/kg/index#>
        PREFIX dqv: <http://www.w3.org/ns/dqv#>
        SELECT DISTINCT ?date ?endpointUrl ?measure { 
                ?metadata kgi:curated ?curated . 
                { ?curated sd:endpoint ?endpointUrl . } 
                UNION { ?curated void:sparqlEndpoint ?endpointUrl . } 
                UNION { ?curated dcat:endpointURL ?endpointUrl . } 
    			{ ?metadata dqv:hasQualityMeasurement ?measureNode . }
    			UNION { ?curated dqv:hasQualityMeasurement ?measureNode . }
                ?measureNode dqv:isMeasurementOf <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/blankNodeUsage.ttl> . 
                ?measureNode dqv:value ?measure . 
        } 
        GROUP BY ?date ?endpointUrl ?measure` ;
    // { ?metadata dct:modified ?date . }
    // UNION { ?curated dct:modified ?date }
    return Sparql.sparqlQueryToIndeGxPromise(blankNodeQuery).then(json => {

        let blankNodeData = []
        let graphSet = new Set();
        let endpointDateMeasureMap: Map<string, Map<string, number>> = new Map();
        let jsonResult = (json as SPARQLJSONResult);
        if (jsonResult != undefined && jsonResult.results != undefined && jsonResult.results.bindings != undefined) {
            jsonResult.results.bindings.forEach((jsonItem, i) => {
                let endpoint = jsonItem.endpointUrl.value;
                let blankNodeMeasure = Number.parseFloat(Global.precise(Number.parseFloat(jsonItem.measure.value) * 100));
                let rawDate: Dayjs = Global.parseDate(jsonItem.date.value);
                let date = rawDate.format("YYYY-MM-DD");

                if (!endpointDateMeasureMap.has(endpoint)) {
                    endpointDateMeasureMap.set(endpoint, new Map());
                }
                if (!endpointDateMeasureMap.get(endpoint).has(date)) {
                    endpointDateMeasureMap.get(endpoint).set(date, blankNodeMeasure);
                }
                if (endpointDateMeasureMap.get(endpoint).has(date) && endpointDateMeasureMap.get(endpoint).get(date) < blankNodeMeasure) {
                    endpointDateMeasureMap.get(endpoint).set(date, blankNodeMeasure);
                }
            });
        }

        endpointDateMeasureMap.forEach((dateMeasureMap, endpoint) => {
            dateMeasureMap.forEach((measure, date) => {
                blankNodeData.push({ date: date, endpoint: endpoint, measure: measure })
            })
        })

        return Promise.resolve(blankNodeData);
    })
        .then(blankNodeData => {
            try {
                let content = JSON.stringify(blankNodeData);
                return Global.writeFile(Global.getCachedFilenameForRunset(blankNodesDataFilename), content).then(() => {
                    Logger.info("blankNodeDataFill END");
                    return Promise.resolve();
                })
            } catch (err) {
                Logger.error(err)
            }
            return Promise.reject();
        })
        .catch(error => {
            Logger.error(error)
        });
}