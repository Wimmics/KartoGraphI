import * as DataCache from "./DataCaching.js";
import { readFile, writeFile } from "fs/promises";
import { AverageRuntimeDataObject, ClassCountDataObject, DatasetDescriptionDataObject, EndpointTestDataObject, GeolocDataObject, GraphListDataObject, KeywordsEndpointDataObject, PropertyCountDataObject, QualityMeasureDataObject, ShortUriDataObject, SPARQLCoverageDataObject, SPARQLFeatureDataObject, SPARQLFeatureDescriptionDataObject, TotalRuntimeDataObject, TripleCountDataObject, VocabEndpointDataObject, VocabKeywordsDataObject } from "./DataTypes.js";
import * as Logger from "./LogUtils.js";
import * as ChartsUtils from "./ChartsUtils.js";
import * as Global from "./GlobalUtils.js";

const numberOfVocabulariesLimit = 1000;

export const sparqlCoverageOptionFilename = DataCache.dataCachedFilePrefix + "sparqlCoverageOption.json";
export const sparql10CoverageOptionFilename = DataCache.dataCachedFilePrefix + "sparql10CoverageOption.json";
export const sparql11CoverageOptionFilename = DataCache.dataCachedFilePrefix + "sparql11CoverageOption.json";
export const vocabEndpointOptionFilename = DataCache.dataCachedFilePrefix + "vocabEndpointOption.json";
export const triplesOptionFilename = DataCache.dataCachedFilePrefix + "triplesOption.json";
export const classesOptionFilename = DataCache.dataCachedFilePrefix + "classesOption.json";
export const propertiesOptionFilename = DataCache.dataCachedFilePrefix + "propertiesOption.json";
export const shortUrisOptionFilename = DataCache.dataCachedFilePrefix + "shortUrisOption.json";
export const rdfDataStructuresOptionFilename = DataCache.dataCachedFilePrefix + "rdfDataStructuresOption.json";
export const readableLabelsOptionFilename = DataCache.dataCachedFilePrefix + "readableLabelsOption.json";
export const blankNodesOptionFilename = DataCache.dataCachedFilePrefix + "blankNodesOption.json";
export const datasetDescriptionOptionFilename = DataCache.dataCachedFilePrefix + "datasetDescriptionOption.json";
export const totalRuntimeOptionFilename = DataCache.dataCachedFilePrefix + "totalRuntimeOption.json";
export const keywordEndpointOptionFilename = DataCache.dataCachedFilePrefix + "keywordEndpointOption.json";
export const standardVocabulariesEndpointGraphOptionFilename = DataCache.dataCachedFilePrefix + "standardVocabulariesEndpointGraphOption.json";


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
    return Global.readJSONFile(DataCache.sparqlFeaturesFilename).then(sparqlFeaturesData => {
        if((sparqlFeaturesData as Array<SPARQLFeatureDataObject>).length) {
            sparqlFeaturesData = (sparqlFeaturesData as Array<SPARQLFeatureDataObject>).sort((to1, to2) => (to1.features.length - to2.features.length));
            let featureCountXArray: number[] = [];
            let featureCountYArray: number[] = [];
            let featureCountTextArray: string[] = [];
            (sparqlFeaturesData as Array<SPARQLFeatureDataObject>).forEach((featureObject, index) => {
                featureCountXArray.push(index);
                featureCountYArray.push(featureObject.features.length / 41 * 100);
                featureCountTextArray.push(featureObject.endpoint);
            })
            let featureCountChartOption = {
                mode: 'lines+markers',
                type: 'scatter',
                x: featureCountXArray,
                y: featureCountYArray,
                text: featureCountTextArray,
                xaxis: {
                    type: "linear",
                    showticklabels: false,
                    ticks: "",
                    autorange: true
                },
                yaxis: {
                    type: 'linear',
                    autorange: true
                }
            };
            return Global.writeFile(sparqlCoverageOptionFilename, JSON.stringify(featureCountChartOption));
        } else {
            return Promise.reject("No data to generate the SPARQL coverage graph");
        }
    })
    .catch((error) => {
        Logger.error("Error during SPARQL coverage data reading", error)
    });
}


export function triplesEchartsOption(): Promise<void> {
    return readFile(DataCache.tripleCountFilename, "utf-8").then(tripleCountRawData => {
        tripleCountData = JSON.parse(tripleCountRawData);
        if (tripleCountData.length > 0) {
            tripleCountData = tripleCountData.sort((to1, to2) => (to1.triples - to2.triples));

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
                text: triplesTextArray,
                xaxis: {
                    type: "linear",
                    showticklabels: false,
                    ticks: "",
                    autorange: true
                },
                yaxis: {
                    type: 'log',
                    autorange: true
                }
            }
            return Global.writeFile(triplesOptionFilename, JSON.stringify(triplesChartOption));
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
            return writeFile(classesOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Number of classes in the datasets", classesSeries))).then(() => {
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
            return writeFile(propertiesOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Number of properties in the datasets", propertiesSeries))).then(() => {
                Logger.info("Property chart data generated");
            });

        } else {
            return Promise.reject("No data to generate the properties graph ");
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
            return writeFile(shortUrisOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Proportion of short URIs in the datasets", shortUrisSeries))).then(() => {
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
            return writeFile(rdfDataStructuresOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Proportion of RDF data structures in the datasets", rdfDataStructuresSeries))).then(() => {
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
            return writeFile(readableLabelsOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Proportion of resources with readable labels in the datasets", readableLabelsSeries))).then(() => {
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
            return writeFile(blankNodesOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Proportion of blank nodes in the datasets", blankNodesSeries))).then(() => {
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
        return writeFile(datasetDescriptionOptionFilename, content).then(() => {
            Logger.info("Dataset description chart option for generation ended");
            return Promise.resolve();
        });
    });
}