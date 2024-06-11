import * as DataCache from "./DataCaching.js";
import { readFile, writeFile } from "fs/promises";
import { AverageRuntimeDataObject, ClassCountDataObject, DatasetDescriptionDataObject, EndpointTestDataObject, GeolocDataObject, GraphListDataObject, KeywordsEndpointDataObject, PropertyCountDataObject, QualityMeasureDataObject, ShortUriDataObject, SPARQLCoverageDataObject, SPARQLFeatureDataObject, SPARQLFeatureDescriptionDataObject, TotalRuntimeDataObject, TripleCountDataObject, VocabEndpointDataObject, VocabKeywordsDataObject } from "./DataTypes.js";
import * as Logger from "./LogUtils.js";
import * as ChartsUtils from "./ChartsUtils.js";
import * as Global from "./GlobalUtils.js";
import dayjs from "dayjs";
import * as echarts from "echarts";

const numberOfVocabulariesLimit = 1000;

export const sparqlCoverageEchartsOptionFilename = DataCache.dataCachedFilePrefix + "sparqlCoverageEchartsOption.json";
export const sparql10CoverageEchartsOptionFilename = DataCache.dataCachedFilePrefix + "sparql10CoverageEchartsOption.json";
export const sparql11CoverageEchartsOptionFilename = DataCache.dataCachedFilePrefix + "sparql11CoverageEchartsOption.json";
export const vocabEndpointEchartsOptionFilename = DataCache.dataCachedFilePrefix + "vocabEndpointEchartsOption.json";
export const triplesEchartOptionFilename = DataCache.dataCachedFilePrefix + "triplesEchartOption.json";
export const classesEchartOptionFilename = DataCache.dataCachedFilePrefix + "classesEchartOption.json";
export const propertiesEchartOptionFilename = DataCache.dataCachedFilePrefix + "propertiesEchartOption.json";
export const shortUrisEchartOptionFilename = DataCache.dataCachedFilePrefix + "shortUrisEchartOption.json";
export const rdfDataStructuresEchartOptionFilename = DataCache.dataCachedFilePrefix + "rdfDataStructuresEchartOption.json";
export const readableLabelsEchartOptionFilename = DataCache.dataCachedFilePrefix + "readableLabelsEchartOption.json";
export const blankNodesEchartOptionFilename = DataCache.dataCachedFilePrefix + "blankNodesEchartOption.json";
export const datasetDescriptionEchartOptionFilename = DataCache.dataCachedFilePrefix + "datasetDescriptionEchartOption.json";
export const totalRuntimeEchartsOptionFilename = DataCache.dataCachedFilePrefix + "totalRuntimeEchartsOption.json";
export const keywordEndpointEchartsOptionFilename = DataCache.dataCachedFilePrefix + "keywordEndpointEchartsOption.json";
export const standardVocabulariesEndpointGraphEchartsOptionFilename = DataCache.dataCachedFilePrefix + "standardVocabulariesEndpointGraphEchartsOption.json";


let whiteListData: Map<string, Array<string>>;
let geolocData: Array<GeolocDataObject>;
let sparqlFeaturesData: Array<SPARQLFeatureDataObject>;
let knownVocabData: Array<string>;
let vocabKeywordData: Array<VocabKeywordsDataObject>;
let classCountData: Array<ClassCountDataObject>;
let propertyCountData: Array<PropertyCountDataObject>;
let tripleCountData: Array<TripleCountDataObject>;
let shortUrisData: Array<ShortUriDataObject>;
let rdfDataStructureData: Array<QualityMeasureDataObject>;
let readableLabelData: Array<QualityMeasureDataObject>;
let blankNodesData: Array<QualityMeasureDataObject>;
let classPropertyData: any;
let datasetDescriptionData: Array<DatasetDescriptionDataObject>;
let sparqlFeatureDesc: Array<SPARQLFeatureDescriptionDataObject>;

export function sparqlCoverageEchartsOption(): Promise<void> {
    return readFile(DataCache.sparqlCoverageFilename, "utf8").then(sparqlCoverageCountRawData => {

        const sparqlCoverageCountData: Array<SPARQLCoverageDataObject> = JSON.parse(sparqlCoverageCountRawData);

        let maxSparql10 = 25;
        let maxSparql11 = 19;
        let maxSparqlTotal = maxSparql10 + maxSparql11;

        let chart10ValueMap = new Map();
        let chart11ValueMap = new Map();
        let chartSPARQLValueMap = new Map();

        for (let i = -1; i < 10; i++) {
            chart10ValueMap.set(i, 0);
            chart11ValueMap.set(i, 0);
            chartSPARQLValueMap.set(i, 0);
        }
        let sparql10Step = maxSparql10 / 10;
        let sparql11Step = maxSparql11 / 10;
        let sparqlTotalStep = maxSparqlTotal / 10;
        sparqlCoverageCountData.forEach((item) => {
            let itemBinSparql10 = -1;
            if (item.sparql10 > 0) {
                itemBinSparql10 = Math.floor(item.sparql10 / sparql10Step);
                if (itemBinSparql10 == 10) {
                    itemBinSparql10 = 9;
                }
            }
            chart10ValueMap.set(itemBinSparql10, chart10ValueMap.get(itemBinSparql10) + 1);
            let itemBinSparql11 = -1;
            if (item.sparql11 > 0) {
                itemBinSparql11 = Math.floor(item.sparql11 / sparql11Step);
                if (itemBinSparql11 == 10) {
                    itemBinSparql11 = 9;
                }
            }
            chart11ValueMap.set(itemBinSparql11, chart11ValueMap.get(itemBinSparql11) + 1);
            let itemBinSparqlTotal = -1;
            if (item.sparql11 > 0 || item.sparql10 > 0) {
                itemBinSparqlTotal = Math.floor(item.sparqlTotal / sparqlTotalStep);
                if (itemBinSparqlTotal == 10) {
                    itemBinSparqlTotal = 9;
                }
            }
            chartSPARQLValueMap.set(itemBinSparqlTotal, chartSPARQLValueMap.get(itemBinSparqlTotal) + 1);
        });

        let chart10DataMap = new Map();
        let chart11DataMap = new Map();
        let chartSPARQLDataMap = new Map();
        let categorySet = new Set<string>();
        chart10ValueMap.forEach((binCount, itemBin, map) => {
            let categoryName = "[ " + ((itemBin) * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            if (itemBin == 0) {
                categoryName = "] " + ((itemBin) * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            }
            if (itemBin == -1) {
                categoryName = "[ 0% ]";
            }
            categorySet.add(categoryName);
            chart10DataMap.set(categoryName, binCount);
        });
        chart11ValueMap.forEach((binCount, itemBin, map) => {
            let categoryName = "[ " + ((itemBin) * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            if (itemBin == 0) {
                categoryName = "] " + ((itemBin) * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            }
            if (itemBin == -1) {
                categoryName = "[ 0% ]";
            }
            categorySet.add(categoryName);
            chart11DataMap.set(categoryName, binCount);
        });
        chartSPARQLValueMap.forEach((binCount, itemBin, map) => {
            let categoryName = "[ " + ((itemBin) * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            if (itemBin == 0) {
                categoryName = "] " + ((itemBin) * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            }
            if (itemBin == -1) {
                categoryName = "[ 0% ]";
            }
            categorySet.add(categoryName);
            chartSPARQLDataMap.set(categoryName, binCount);
        });
        // let categories = ([...categorySet]).sort((a, b) => a.localeCompare(b));

        let sparql10Series: any[] = [];
        chart10DataMap.forEach((percentage, category, map) => {
            sparql10Series.push({
                name: category,
                type: 'bar',
                data: [percentage],
                label: {
                    show: true,
                    formatter: "{a}",
                    verticalAlign: "bottom",
                    position: "top"
                }
            })
        });
        let sparql11Series: any[] = [];
        chart11DataMap.forEach((percentage, category, map) => {
            sparql11Series.push({
                name: category,
                type: 'bar',
                data: [percentage],
                label: {
                    show: true,
                    formatter: "{a}",
                    verticalAlign: "bottom",
                    position: "top"
                }
            })
        });
        let sparqlCategorySeries: any[] = [];
        chartSPARQLDataMap.forEach((percentage, category, map) => {
            sparqlCategorySeries.push({
                name: category,
                type: 'bar',
                data: [percentage],
                label: {
                    show: true,
                    formatter: "{a}",
                    verticalAlign: "bottom",
                    position: "top"
                }
            })
        });

        let sparql10ChartOption = {
            title: {
                left: 'center',
                text: "Number of endpoints according to\n their coverage of SPARQL 1.0 features",
                textStyle: {
                    overflow: 'breakAll',
                    width: "80%"
                }
            },
            legend: {
                show: false,
            },
            toolbox: {
                show: false
            },
            tooltip: {
                show: true
            },
            xAxis: {
                type: 'category',
                data: ["Endpoints supporting SPARQL 1.0 features"],
                show: false,
                splitLine: { show: false },
                splitArea: { show: false }
            },
            yAxis: {
                type: 'value',
                max: 'dataMax',
            },
            color: ["#060705ff", "#10200Eff", "#1A3917ff", "#245121ff", "#2E6A2Aff", "#388333ff", "#419C3Cff", "#4BB545ff", "#55CD4Fff", "#5FE658ff", "#69FF61ff"],
            series: sparql10Series,
        };
        let sparql11ChartOption = {
            title: {
                left: 'center',
                text: "Number of endpoints according to\n their coverage of SPARQL 1.1 features",
                textStyle: {
                    overflow: 'breakAll',
                    width: "80%"
                }
            },
            legend: {
                show: false,
            },
            toolbox: {
                show: false
            },
            tooltip: {
                show: true
            },
            xAxis: {
                type: 'category',
                data: ["Endpoints supporting SPARQL 1.1 features"],
                show: false,
                splitLine: { show: false },
                splitArea: { show: false }
            },
            yAxis: {
                type: 'value',
                max: 'dataMax',
            },
            color: ["#060705ff", "#10200Eff", "#1A3917ff", "#245121ff", "#2E6A2Aff", "#388333ff", "#419C3Cff", "#4BB545ff", "#55CD4Fff", "#5FE658ff", "#69FF61ff"],
            series: sparql11Series,
        };
        let sparqlChartOption = {
            title: {
                left: 'center',
                text: "Number of endpoints according to\n their coverage of all SPARQL features",
                textStyle: {
                    overflow: 'breakAll',
                    width: "80%"
                }
            },
            legend: {
                show: false,
            },
            toolbox: {
                show: false
            },
            tooltip: {
                show: true
            },
            xAxis: {
                type: 'category',
                data: ["Endpoints supporting SPARQL 1.0 and 1.1 features"],
                splitLine: { show: false },
                splitArea: { show: false },
                show: false
            },
            yAxis: {
                type: 'value',
                max: 'dataMax',
            },
            color: ["#060705ff", "#10200Eff", "#1A3917ff", "#245121ff", "#2E6A2Aff", "#388333ff", "#419C3Cff", "#4BB545ff", "#55CD4Fff", "#5FE658ff", "#69FF61ff"],
            series: sparqlCategorySeries,
        };

        return Promise.allSettled([
            writeFile(sparql10CoverageEchartsOptionFilename, JSON.stringify(sparql10ChartOption)).then(() => { Logger.info("SPARQL 1.0 chart data generated"); }),
            writeFile(sparql11CoverageEchartsOptionFilename, JSON.stringify(sparql11ChartOption)).then(() => { Logger.info("SPARQL 1.1 chart data generated"); }),
            writeFile(sparqlCoverageEchartsOptionFilename, JSON.stringify(sparqlChartOption)).then(() => { Logger.info("SPARQL chart data generated"); })
        ]).then(() => {
            return Promise.resolve();
        });
    }).catch((error) => {
        Logger.error("Error during sparql cached data reading", error)
    });
}

export function endpointVocabsGraphEchartsOption(): Promise<void> {
    return readFile(DataCache.vocabEndpointFilename, "utf-8").then(vocabEndpointRawData => {

        let vocabEndpointData: Array<VocabEndpointDataObject> = JSON.parse(vocabEndpointRawData);
        // Create an force graph with the graph linked by co-ocurrence of vocabularies

        // Endpoint and vocabularies graph
        let linkArray: ChartsUtils.EchartsGraphLink[] = [];
        let nodeArray: ChartsUtils.EchartsGraphNode[] = [];
        let vocabularySet: Set<string> = new Set();
        let endpointSet: Set<string> = new Set();
        vocabEndpointData.forEach((item, i) => {
            let endpoint = item.endpoint;
            let vocabularies = item.vocabularies;
            if (vocabularies !== undefined) {
                endpointSet.add(endpoint);
                vocabularies.forEach(vocab => {
                    vocabularySet.add(vocab)

                    linkArray.push({ source: endpoint, target: vocab })
                })
            }
        });

        endpointSet.forEach(endpoint => {
            nodeArray.push({ name: endpoint, category: 'Endpoint', symbolSize: 5 })
        })
        vocabularySet.forEach(vocab => {
            nodeArray.push({ name: vocab, category: 'Vocabulary', symbolSize: 5 })
        })

        if (nodeArray.length > 0 && linkArray.length > 0) {
            let content = JSON.stringify(ChartsUtils.getForceGraphOption('Endpoints and vocabularies*', [ "Vocabulary", "Endpoint"], nodeArray, linkArray));
            return writeFile(vocabEndpointEchartsOptionFilename, content);
        } else {
            return Promise.reject("No data to generate the vocabulary graph ");
        }
    }).catch((error) => {
        Logger.error("Error during vocab graph data reading", error)
    });
}

export function endpointKeywordsGraphEchartsOption(): Promise<void> {
    return readFile(DataCache.endpointKeywordsFilename, "utf-8").then(endpointKeywordsRawData => {

        
        let endpointKeywordData: Array<KeywordsEndpointDataObject> = JSON.parse(endpointKeywordsRawData);
        // Endpoint and keywords graph
        let linkArray: ChartsUtils.EchartsGraphLink[] = [];
        let nodeArray: ChartsUtils.EchartsGraphNode[] = [];
        let keywordSet: Set<string> = new Set();
        let endpointSet: Set<string> = new Set();
        endpointKeywordData.forEach((item, i) => {
            let endpoint = item.endpoint;
            let keywords = item.keywords;
            if (keywords !== undefined) {
                endpointSet.add(endpoint);
                keywords.forEach(vocab => {
                    keywordSet.add(vocab)

                    linkArray.push({ source: endpoint, target: vocab })
                })
            }
        });

        endpointSet.forEach(endpoint => {
            nodeArray.push({ name: endpoint, category: 'Endpoint', symbolSize: 5 })
        })
        keywordSet.forEach(vocab => {
            nodeArray.push({ name: vocab, category: 'Keyword', symbolSize: 5 })
        })
        if (nodeArray.length > 0 && linkArray.length > 0) {
            let content = JSON.stringify(ChartsUtils.getForceGraphOption('Endpoints and keywords of their vocabularies', [ "Keyword", "Endpoint" ], nodeArray, linkArray));
            return writeFile(keywordEndpointEchartsOptionFilename, content);
        } else {
            return Promise.reject("No data to generate the keyword graph");
        }
    }).catch((error) => {
        Logger.error("Error during keyword graph data reading", error)
    });
}

export function endpointStandardVocabulariesGraphEchartsOption(): Promise<void> {
    return readFile(DataCache.vocabEndpointFilename, "utf-8").then(vocabEndpointRawData => {
        let vocabEndpointData: Array<VocabEndpointDataObject> = JSON.parse(vocabEndpointRawData);

        let vocabStandardSet: Set<string> = new Set();
        let vocabStandardNameMap: Map<string, string> = new Map([["http://www.w3.org/1999/02/22-rdf-syntax-ns#", "RDF"], ["http://www.w3.org/2000/01/rdf-schema#", "RDFS"], ["http://www.w3.org/ns/shacl#", "SHACL"], ["http://www.w3.org/2002/07/owl#", "OWL"], ["http://www.w3.org/2004/02/skos/core#", "SKOS"], ["http://spinrdf.org/spin#", "SPIN"], ["http://www.w3.org/2003/11/swrl#", "SWRL"]]);
        vocabStandardNameMap.forEach((value, key, map) => {
            vocabStandardSet.add(key);
        });
        // Endpoint and vocabularies graph
        let linkArray: ChartsUtils.EchartsGraphLink[] = [];
        let nodeArray: ChartsUtils.EchartsGraphNode[] = [];
        let vocabSet: Set<string> = new Set();
        let endpointSet: Set<string> = new Set();
        vocabEndpointData.forEach((item, i) => {
            let endpoint = item.endpoint;
            let vocabularies = item.vocabularies;
            if (vocabularies !== undefined) {
                endpointSet.add(endpoint);
                vocabularies.forEach(vocab => {
                    if (vocabStandardSet.has(vocab)) {
                        vocabSet.add(vocab)

                        linkArray.push({ source: vocab, target: endpoint })
                    }
                })
            }
        });

        endpointSet.forEach(endpoint => {
            nodeArray.push({ name: endpoint, category: 'Endpoint', symbolSize: 5 })
        })
        vocabSet.forEach(vocab => {
            nodeArray.push({ name: vocab, category: vocabStandardNameMap.get(vocab), symbolSize: 5 })
        })

        if (nodeArray.length > 0 && linkArray.length > 0) {
            let categoryArray = [...vocabStandardSet].map(vocab => vocabStandardNameMap.get(vocab));
            categoryArray.push("Endpoint")
            let content = JSON.stringify(ChartsUtils.getCircularGraphOption('Endpoints and meta-vocabularies', categoryArray, nodeArray, linkArray));
            return writeFile(standardVocabulariesEndpointGraphEchartsOptionFilename, content);
        } else {
            return Promise.reject("No data to generate the vocabulary graph ");
        }
    }).catch((error) => {
        Logger.error("Error during vocab graph data reading", error)
    });
}

export function triplesEchartsOption(): Promise<void> {
    return readFile(DataCache.tripleCountFilename, "utf-8").then(tripleCountRawData => {
        tripleCountData = JSON.parse(tripleCountRawData);
        if(tripleCountData.length > 0) {
            tripleCountData = tripleCountData.sort((to1, to2) => (to1.triples - to2.triples));
            // {
            //     x: [1, 2, 3, 4],
            //     y: [12, 9, 15, 12],
            //     mode: 'lines+markers',
            //     type: 'scatter'
            //   };
    
            let triplesXArray: number[] = []
            let triplesYArray: number[] = []
            let triplesTextArray: string[] = []
            tripleCountData.forEach((tripleObject, index) => {
                triplesXArray.push(index);
                triplesYArray.push(tripleObject.triples)
                triplesTextArray.push(tripleObject.endpoint)
            })
            let triplesChartOption = {
                    mode: 'lines+markers',
                    type: 'scatter',
                    x: triplesXArray,
                    y: triplesYArray,
                    text: triplesTextArray
            }
            return Global.writeFile(triplesEchartOptionFilename, JSON.stringify(triplesChartOption));
        } else {
            return Promise.reject("No data to generate the triples graph");
        }
    }).catch((error) => {
        Logger.error("Error during triple data reading", error)
    });

}

export function classesEchartsOption(): Promise<void> {
    return readFile(DataCache.classCountFilename, "utf-8").then(classesCountRawData => {
        classCountData = JSON.parse(classesCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        classCountData.forEach((itemResult, i) => {
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        classCountData.forEach((itemResult, i) => {
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let classes = itemResult.classes;
            endpointDataSerieMap.get(endpointUrl).push([date, classes])
        });

        if (endpointDataSerieMap.size > 0) {
            let classesSeries = ChartsUtils.getScatterDataSeriesFromMap(endpointDataSerieMap);
            return writeFile(classesEchartOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Number of classes in the datasets", classesSeries))).then(() => {
                Logger.info("Class chart data generated");
            });

        } else {
            return Promise.reject("No data to generate the classes graph");
        }
    }).catch((error) => {
        Logger.error("Error during classes data reading", error)
    });

}

export function propertiesEchartsOption(): Promise<void> {
    return readFile(DataCache.propertyCountFilename, "utf-8").then(propertiesCountRawData => {
        propertyCountData = JSON.parse(propertiesCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        propertyCountData.forEach((itemResult, i) => {
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        propertyCountData.forEach((itemResult, i) => {
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let properties = itemResult.properties;
            endpointDataSerieMap.get(endpointUrl).push([date, properties])
        });

        if (endpointDataSerieMap.size > 0) {
            let propertiesSeries = ChartsUtils.getScatterDataSeriesFromMap(endpointDataSerieMap);
            return writeFile(propertiesEchartOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Number of properties in the datasets", propertiesSeries))).then(() => {
                Logger.info("Property chart data generated");
            });

        } else {
            return Promise.reject("No data to generate the properties graph " );
        }
    }).catch((error) => {
        Logger.error("Error during properties data reading", error)
    });
}

export function shortUrisEchartsOption(): Promise<void> {
    return readFile(DataCache.shortUriDataFilename, "utf-8").then(shortUrisCountRawData => {
        shortUrisData = JSON.parse(shortUrisCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        shortUrisData.forEach((itemResult, i) => {
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        shortUrisData.forEach((itemResult, i) => {
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let shortUris = itemResult.measure;
            endpointDataSerieMap.get(endpointUrl).push([date, shortUris])
        });

        if (endpointDataSerieMap.size > 0) {
            let shortUrisSeries = ChartsUtils.getScatterDataSeriesFromMap(endpointDataSerieMap);
            return writeFile(shortUrisEchartOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Proportion of short URIs in the datasets", shortUrisSeries))).then(() => {
                Logger.info("Short URIs chart data generated");
            });

        } else {
            return Promise.reject("No data to generate the Short URIs graph");
        }
    }).catch((error) => {
        Logger.error("Error during Short URIs data reading", error)
    });
}

export function rdfDataStructuresEchartsOption(): Promise<void> {
    return readFile(DataCache.rdfDataStructureDataFilename, "utf-8").then(rdfDataStructuresCountRawData => {
        rdfDataStructureData = JSON.parse(rdfDataStructuresCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        rdfDataStructureData.forEach((itemResult, i) => {
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        rdfDataStructureData.forEach((itemResult, i) => {
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let rdfDatastructures = itemResult.measure;
            endpointDataSerieMap.get(endpointUrl).push([date, rdfDatastructures])
        });

        if (endpointDataSerieMap.size > 0) {
            let rdfDataStructuresSeries = ChartsUtils.getScatterDataSeriesFromMap(endpointDataSerieMap);
            return writeFile(rdfDataStructuresEchartOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Proportion of RDF data structures in the datasets", rdfDataStructuresSeries))).then(() => {
                Logger.info("RDF data structures chart data generated");
            });

        } else {
            return Promise.reject("No data to generate the RDF data structures chart");
        }
    }).catch((error) => {
        Logger.error("Error during RDF data structures data reading", error)
    });
}

export function readableLabelsEchartsOption(): Promise<void> {
    return readFile(DataCache.readableLabelDataFilename, "utf-8").then(readableLabelsCountRawData => {
        readableLabelData = JSON.parse(readableLabelsCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        readableLabelData.forEach((itemResult, i) => {
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        readableLabelData.forEach((itemResult, i) => {
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let readableLabels = itemResult.measure;
            endpointDataSerieMap.get(endpointUrl).push([date, readableLabels])
        });

        if (endpointDataSerieMap.size > 0) {
            let readableLabelsSeries = ChartsUtils.getScatterDataSeriesFromMap(endpointDataSerieMap);
            return writeFile(readableLabelsEchartOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Proportion of resources with readable labels in the datasets", readableLabelsSeries))).then(() => {
                Logger.info("Readable labels chart data");
            });

        } else {
            return Promise.reject("No data to generate the readable labels chart");
        }
    }).catch((error) => {
        Logger.error("Error during RDF data structures data", error)
    });
}

export function blankNodesEchartsOption(): Promise<void> {
    return readFile(DataCache.blankNodesDataFilename, "utf-8").then(blankNodesCountRawData => {
        blankNodesData = JSON.parse(blankNodesCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        blankNodesData.forEach((itemResult, i) => {
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        blankNodesData.forEach((itemResult, i) => {
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let blankNodes = itemResult.measure;
            endpointDataSerieMap.get(endpointUrl).push([date, blankNodes])
        });

        if (endpointDataSerieMap.size > 0) {
            let blankNodesSeries = ChartsUtils.getScatterDataSeriesFromMap(endpointDataSerieMap);
            return writeFile(blankNodesEchartOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Proportion of blank nodes in the datasets", blankNodesSeries))).then(() => {
                Logger.info("Blank nodes chart data");
            });

        } else {
            return Promise.reject("No data to generate the blank nodes chart");
        }
    }).catch((error) => {
        Logger.error("Error during blank nodes data reading", error)
    });
}

export function datasetDescriptionEchartsOption() {
    Logger.info("Dataset description chart data for generation started")
    return readFile(DataCache.datasetDescriptionDataFilename, "utf-8").then(datasetDescriptionRawData => {
        datasetDescriptionData = JSON.parse(datasetDescriptionRawData);

        let whoDataScore = 0;
        let licenseDataScore = 0;
        let timeDataScore = 0;
        let sourceDataScore = 0;

        datasetDescriptionData.forEach(dataItem => {
            let who = dataItem.who;
            if (who) {
                whoDataScore++;
            }
            let license = dataItem.license;
            if (license) {
                licenseDataScore++;
            }
            let time = dataItem.time;
            if (time) {
                timeDataScore++;
            }
            let source = dataItem.source;
            if (source) {
                sourceDataScore++;
            }
        });


        let whoTrueDataSerie: echarts.BarSeriesOption = {
            name: 'Description of author',
            type: 'bar',
            stack: 'who',
            colorBy: 'data',
            data: [
                { value: whoDataScore, name: 'Presence of the description of creator/owner/contributor' },
            ]
        };
        if (whoDataScore > 0) {
            whoTrueDataSerie.label = {
                show: true,
                formatter: '{c} endpoints with author description'
            }
        };
        let whoFalseDataSerie: echarts.BarSeriesOption = {
            name: 'Description of author',
            type: 'bar',
            stack: 'who',
            colorBy: 'data',
            data: [
                { value: (datasetDescriptionData.length - whoDataScore), name: 'Absence of the description of creator/owner/contributor' },
            ]
        };
        if ((datasetDescriptionData.length - whoDataScore) > 0) {
            whoFalseDataSerie.label = {
                show: true,
                formatter: '{c} endpoints without author description'
            }
        };
        let licenseTrueDataSerie: echarts.BarSeriesOption = {
            name: 'Licensing description',
            type: 'bar',
            stack: 'license',
            colorBy: 'data',
            data: [
                { value: licenseDataScore, name: 'Presence of licensing information' },
            ]
        };
        if (licenseDataScore > 0) {
            licenseTrueDataSerie.label = {
                show: true,
                formatter: '{c} endpoints with licensing description'
            }
        }
        let licenseFalseDataSerie: echarts.BarSeriesOption = {
            name: 'Licensing description',
            type: 'bar',
            stack: 'license',
            colorBy: 'data',
            data: [
                { value: (datasetDescriptionData.length - licenseDataScore), name: 'Absence of licensing description' },
            ]
        };
        if ((datasetDescriptionData.length - licenseDataScore) > 0) {
            licenseFalseDataSerie.label = {
                show: true,
                formatter: '{c} endpoints without licensing description'
            }
        }
        let timeTrueDataSerie: echarts.BarSeriesOption = {
            name: 'Time related description of the creation of the dataset',
            type: 'bar',
            stack: 'time',
            colorBy: 'data',
            data: [
                { value: timeDataScore, name: 'Presence of time-related information' },
            ]
        };
        if (timeDataScore > 0) {
            timeTrueDataSerie.label = {
                show: true,
                formatter: '{c} endpoints with time-related description'
            }
        }
        let timeFalseDataSerie: echarts.BarSeriesOption = {
            name: 'Time related description of creation of the dataset',
            type: 'bar',
            stack: 'time',
            colorBy: 'data',
            data: [
                { value: (datasetDescriptionData.length - timeDataScore), name: 'Absence of time-related description' },
            ]
        };
        if ((datasetDescriptionData.length - timeDataScore) > 0) {
            timeFalseDataSerie.label = {
                show: true,
                formatter: '{c} endpoints without time-related description'
            }
        }
        let sourceTrueDataSerie: echarts.BarSeriesOption = {
            name: 'Description of the source or the process at the origin of the dataset',
            type: 'bar',
            stack: 'source',
            colorBy: 'data',
            data: [
                { value: sourceDataScore, name: 'Presence of description of the origin of the dataset' },
            ]
        };
        if (sourceDataScore > 0) {
            sourceTrueDataSerie.label = {
                show: true,
                formatter: '{c} endpoints with source description'
            }
        }
        let sourceFalseDataSerie: echarts.BarSeriesOption = {
            name: 'Description of the source or the process at the origin of the dataset',
            type: 'bar',
            stack: 'source',
            colorBy: 'data',
            data: [
                { value: (datasetDescriptionData.length - sourceDataScore), name: 'Absence of description of the origin of the dataset' },
            ]
        };
        if ((datasetDescriptionData.length - sourceDataScore) > 0) {
            sourceFalseDataSerie.label = {
                show: true,
                formatter: '{c} endpoints without source description'
            }
        }
        let datasetDescriptionEchartOption = {
            title: {
                text: 'Dataset description features in all endpoints',
                left: 'center'
            },
            tooltip: {
                confine: true
            },
            xAxis: {
                type: 'value',
                max: 'dataMax',
            },
            yAxis: {
                type: 'category',
                axisLabel: {
                    formatter: 'Dataset\n description\n elements',
                    overflow: 'breakAll'
                }
            },
            legend: {
                left: 'left',
                show: false
            },
            series: [whoTrueDataSerie, whoFalseDataSerie, licenseTrueDataSerie, licenseFalseDataSerie, timeTrueDataSerie, timeFalseDataSerie, sourceTrueDataSerie, sourceFalseDataSerie]
        };
        return datasetDescriptionEchartOption;
    }).then((datasetDescriptionEchartOption) => {
        let content = JSON.stringify(datasetDescriptionEchartOption);
        return writeFile(datasetDescriptionEchartOptionFilename, content).then(() => {
            Logger.info("Dataset description chart option for generation ended");
            return Promise.resolve();
        });
    });
}