import * as DataCache from "./DataCaching.js";
import { readFile, writeFile } from "fs/promises";
import { AverageRuntimeDataObject, ClassCountDataObject, DatasetDescriptionDataObject, EndpointServerDataObject, EndpointTestDataObject, GeolocDataObject, GraphListDataObject, JSONArray, KeywordsEndpointDataObject, PropertyCountDataObject, QualityMeasureDataObject, SPARQLCoverageDataObject, SPARQLFeatureDataObject, SPARQLFeatureDescriptionDataObject, TotalRuntimeDataObject, TripleCountDataObject, VocabEndpointDataObject, VocabKeywordsDataObject } from "./DataTypes.js";
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
export const endpointServerChartOptionFilename = DataCache.dataCachedFilePrefix + "endpointServerChartOption.json";


let whiteListData: Map<string, Array<string>>;
let geolocData: Array<GeolocDataObject>;
let sparqlFeaturesData: Array<SPARQLFeatureDataObject>;
let knownVocabData: Array<string>;
let vocabKeywordData: Array<VocabKeywordsDataObject>;
let classCountData: Array<ClassCountDataObject>;
let propertyCountData: Array<PropertyCountDataObject>;
let tripleCountData: Array<TripleCountDataObject>;
let shortUrisData: Array<QualityMeasureDataObject>;
let rdfDataStructureData: Array<QualityMeasureDataObject>;
let readableLabelData: Array<QualityMeasureDataObject>;
let blankNodesData: Array<QualityMeasureDataObject>;
let classPropertyData: any;
let datasetDescriptionData: Array<DatasetDescriptionDataObject>;
let sparqlFeatureDesc: Array<SPARQLFeatureDescriptionDataObject>;


export function sparqlCoverageChartOption(): Promise<void> {
    return Global.readJSONFile(DataCache.sparqlFeaturesFilename).then(sparqlFeaturesData => {
        if ((sparqlFeaturesData as Array<SPARQLFeatureDataObject>).length) {
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
                mode: 'markers',
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


export function triplesChartOption(): Promise<void> {
    return Global.readJSONFile(DataCache.tripleCountFilename).then(tripleCountData => {
        if ((tripleCountData as TripleCountDataObject[]).length > 0) {
            tripleCountData = (tripleCountData as TripleCountDataObject[]).sort((to1, to2) => (to1.triples - to2.triples));

            let triplesXArray: number[] = [];
            let triplesYArray: number[] = [];
            let triplesTextArray: string[] = [];
            (tripleCountData as TripleCountDataObject[]).forEach((tripleObject, index) => {
                triplesXArray.push(index);
                triplesYArray.push(tripleObject.triples)
                triplesTextArray.push(tripleObject.endpoint)
            })
            let triplesChartOption = [{
                mode: 'markers',
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
            }]
            return Global.writeFile(triplesOptionFilename, JSON.stringify(triplesChartOption));
        } else {
            return Promise.reject("No data to generate the triples graph");
        }
    }).catch((error) => {
        Logger.error("Error during triple data reading", error)
    });

}

export function classesChartOption(): Promise<void> {
    return Global.readJSONFile(DataCache.classCountFilename).then(classCountData => {

        if ((classCountData as ClassCountDataObject[]).length > 0) {
            // Scatter plot of the number of classes through time

            classCountData = (classCountData as ClassCountDataObject[]).sort((to1, to2) => (to1.classes - to2.classes));

            let classesXArray: number[] = [];
            let classesYArray: number[] = [];
            let classesTextArray: string[] = [];
            (classCountData as ClassCountDataObject[]).forEach((classObject, index) => {
                classesXArray.push(index);
                classesYArray.push(classObject.classes)
                classesTextArray.push(classObject.endpoint)
            })
            let classesChartOption = [{
                mode: 'markers',
                type: 'scatter',
                x: classesXArray,
                y: classesYArray,
                text: classesTextArray,
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
            }]
            return Global.writeFile(classesOptionFilename, JSON.stringify(classesChartOption));

        } else {
            return Promise.reject("No data to generate the classes chart");
        }
    }).catch((error) => {
        Logger.error("Error during classes data reading", error)
    });

}

export function propertiesChartOption(): Promise<void> {
    return Global.readJSONFile(DataCache.propertyCountFilename).then(propertyCountData => {

        if ((propertyCountData as PropertyCountDataObject[]).length > 0) {
            // Scatter plot of the number of properties through time

            propertyCountData = (propertyCountData as PropertyCountDataObject[]).sort((to1, to2) => (to1.properties - to2.properties));

            let propertiesXArray: number[] = [];
            let propertiesYArray: number[] = [];
            let propertiesTextArray: string[] = [];
            (propertyCountData as PropertyCountDataObject[]).forEach((propertyObject, index) => {
                propertiesXArray.push(index);
                propertiesYArray.push(propertyObject.properties)
                propertiesTextArray.push(propertyObject.endpoint)
            })
            let propertiesChartOption = [{
                mode: 'markers',
                type: 'scatter',
                x: propertiesXArray,
                y: propertiesYArray,
                text: propertiesTextArray,
                xaxis: {
                    type: "linear",
                    showticklabels: false,
                    ticks: "",
                    autorange: true,
                },
                yaxis: {
                    type: 'log',
                    autorange: true
                }
            }]
            return Global.writeFile(propertiesOptionFilename, JSON.stringify(propertiesChartOption));

        } else {
            return Promise.reject("No data to generate the properties chart");
        }
    }).catch((error) => {
        Logger.error("Error during properties data reading", error)
    });
}

export function shortUrisChartOption(): Promise<void> {
    return Global.readJSONFile(DataCache.shortUriDataFilename).then(shortUriData => {

        if ((shortUriData as QualityMeasureDataObject[]).length > 0) {
            // Scatter plot of the number of properties through time

            shortUriData = (shortUriData as QualityMeasureDataObject[]).sort((to1, to2) => (to1.measure - to2.measure));

            let shortUriXArray: number[] = [];
            let shortUriYArray: number[] = [];
            let shortUriTextArray: string[] = [];
            (shortUriData as QualityMeasureDataObject[]).forEach((shortUriObject, index) => {
                shortUriXArray.push(index);
                shortUriYArray.push(shortUriObject.measure)
                shortUriTextArray.push(shortUriObject.endpoint)
            })
            let shortUriChartOption = [{
                mode: 'markers',
                type: 'scatter',
                x: shortUriXArray,
                y: shortUriYArray,
                text: shortUriTextArray,
                xaxis: {
                    type: "linear",
                    showticklabels: false,
                    ticks: "",
                    autorange: true,
                },
                yaxis: {
                    type: 'log',
                    autorange: true
                }
            }]
            return Global.writeFile(shortUrisOptionFilename, JSON.stringify(shortUriChartOption));

        } else {
            return Promise.reject("No data to generate the short URI chart");
        }
    }).catch((error) => {
        Logger.error("Error during short URI data reading", error)
    });
}

export function readableLabelsChartOption(): Promise<void> {
    return Global.readJSONFile(DataCache.readableLabelDataFilename).then(readableLabelsData => {

        if ((readableLabelsData as QualityMeasureDataObject[]).length > 0) {
            // Scatter plot of the number of properties through time

            readableLabelsData = (readableLabelsData as QualityMeasureDataObject[]).sort((to1, to2) => (to1.measure - to2.measure));

            let readableLabelsXArray: number[] = [];
            let readableLabelsYArray: number[] = [];
            let readableLabelsTextArray: string[] = [];
            (readableLabelsData as QualityMeasureDataObject[]).forEach((readableLabelsObject, index) => {
                readableLabelsXArray.push(index);
                readableLabelsYArray.push(readableLabelsObject.measure)
                readableLabelsTextArray.push(readableLabelsObject.endpoint)
            })
            let readableLabelsChartOption = [{
                mode: 'markers',
                type: 'scatter',
                x: readableLabelsXArray,
                y: readableLabelsYArray,
                text: readableLabelsTextArray,
                xaxis: {
                    type: "linear",
                    showticklabels: false,
                    ticks: "",
                    autorange: true,
                },
                yaxis: {
                    type: 'log',
                    autorange: true
                }
            }]
            return Global.writeFile(readableLabelsOptionFilename, JSON.stringify(readableLabelsChartOption));

        } else {
            return Promise.reject("No data to generate the readable label chart");
        }
    }).catch((error) => {
        Logger.error("Error during readable label data reading", error)
    });
}

// export function rdfDataStructuresChartOption(): Promise<void> {
//     return readFile(DataCache.rdfDataStructureDataFilename, "utf-8").then(rdfDataStructuresCountRawData => {
//         rdfDataStructureData = JSON.parse(rdfDataStructuresCountRawData);
//         // Scatter plot of the number of classes through time
//         let endpointDataSerieMap = new Map();
//         rdfDataStructureData.forEach((itemResult, i) => {
//             let endpointUrl = itemResult.endpoint;
//             endpointDataSerieMap.set(endpointUrl, []);
//         });
//         rdfDataStructureData.forEach((itemResult, i) => {
//             let date = itemResult.date;
//             let endpointUrl = itemResult.endpoint;
//             let rdfDatastructures = itemResult.measure;
//             endpointDataSerieMap.get(endpointUrl).push([date, rdfDatastructures])
//         });

//         if (endpointDataSerieMap.size > 0) {
//             let rdfDataStructuresSeries = ChartsUtils.getScatterDataSeriesFromMap(endpointDataSerieMap);
//             return writeFile(rdfDataStructuresOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Proportion of RDF data structures in the datasets", rdfDataStructuresSeries))).then(() => {
//                 Logger.info("RDF data structures chart data generated");
//             });

//         } else {
//             return Promise.reject("No data to generate the RDF data structures chart");
//         }
//     }).catch((error) => {
//         Logger.error("Error during RDF data structures data reading", error)
//     });
// }

// export function blankNodesChartOption(): Promise<void> {
//     return readFile(DataCache.blankNodesDataFilename, "utf-8").then(blankNodesCountRawData => {
//         blankNodesData = JSON.parse(blankNodesCountRawData);
//         // Scatter plot of the number of classes through time
//         let endpointDataSerieMap = new Map();
//         blankNodesData.forEach((itemResult, i) => {
//             let endpointUrl = itemResult.endpoint;
//             endpointDataSerieMap.set(endpointUrl, []);
//         });
//         blankNodesData.forEach((itemResult, i) => {
//             let date = itemResult.date;
//             let endpointUrl = itemResult.endpoint;
//             let blankNodes = itemResult.measure;
//             endpointDataSerieMap.get(endpointUrl).push([date, blankNodes])
//         });

//         if (endpointDataSerieMap.size > 0) {
//             let blankNodesSeries = ChartsUtils.getScatterDataSeriesFromMap(endpointDataSerieMap);
//             return writeFile(blankNodesOptionFilename, JSON.stringify(ChartsUtils.getTimeScatterOption("Proportion of blank nodes in the datasets", blankNodesSeries))).then(() => {
//                 Logger.info("Blank nodes chart data");
//             });

//         } else {
//             return Promise.reject("No data to generate the blank nodes chart");
//         }
//     }).catch((error) => {
//         Logger.error("Error during blank nodes data reading", error)
//     });
// }

// export function datasetDescriptionChartOption() {
//     Logger.info("Dataset description chart data for generation started")
//     return readFile(DataCache.datasetDescriptionDataFilename, "utf-8").then(datasetDescriptionRawData => {
//         datasetDescriptionData = JSON.parse(datasetDescriptionRawData);

//         let whoDataScore = 0;
//         let licenseDataScore = 0;
//         let timeDataScore = 0;
//         let sourceDataScore = 0;

//         datasetDescriptionData.forEach(dataItem => {
//             let who = dataItem.who;
//             if (who) {
//                 whoDataScore++;
//             }
//             let license = dataItem.license;
//             if (license) {
//                 licenseDataScore++;
//             }
//             let time = dataItem.time;
//             if (time) {
//                 timeDataScore++;
//             }
//             let source = dataItem.source;
//             if (source) {
//                 sourceDataScore++;
//             }
//         });


//         let whoTrueDataSerie: echarts.BarSeriesOption = {
//             name: 'Description of author',
//             type: 'bar',
//             stack: 'who',
//             colorBy: 'data',
//             data: [
//                 { value: whoDataScore, name: 'Presence of the description of creator/owner/contributor' },
//             ]
//         };
//         if (whoDataScore > 0) {
//             whoTrueDataSerie.label = {
//                 show: true,
//                 formatter: '{c} endpoints with author description'
//             }
//         };
//         let whoFalseDataSerie: echarts.BarSeriesOption = {
//             name: 'Description of author',
//             type: 'bar',
//             stack: 'who',
//             colorBy: 'data',
//             data: [
//                 { value: (datasetDescriptionData.length - whoDataScore), name: 'Absence of the description of creator/owner/contributor' },
//             ]
//         };
//         if ((datasetDescriptionData.length - whoDataScore) > 0) {
//             whoFalseDataSerie.label = {
//                 show: true,
//                 formatter: '{c} endpoints without author description'
//             }
//         };
//         let licenseTrueDataSerie: echarts.BarSeriesOption = {
//             name: 'Licensing description',
//             type: 'bar',
//             stack: 'license',
//             colorBy: 'data',
//             data: [
//                 { value: licenseDataScore, name: 'Presence of licensing information' },
//             ]
//         };
//         if (licenseDataScore > 0) {
//             licenseTrueDataSerie.label = {
//                 show: true,
//                 formatter: '{c} endpoints with licensing description'
//             }
//         }
//         let licenseFalseDataSerie: echarts.BarSeriesOption = {
//             name: 'Licensing description',
//             type: 'bar',
//             stack: 'license',
//             colorBy: 'data',
//             data: [
//                 { value: (datasetDescriptionData.length - licenseDataScore), name: 'Absence of licensing description' },
//             ]
//         };
//         if ((datasetDescriptionData.length - licenseDataScore) > 0) {
//             licenseFalseDataSerie.label = {
//                 show: true,
//                 formatter: '{c} endpoints without licensing description'
//             }
//         }
//         let timeTrueDataSerie: echarts.BarSeriesOption = {
//             name: 'Time related description of the creation of the dataset',
//             type: 'bar',
//             stack: 'time',
//             colorBy: 'data',
//             data: [
//                 { value: timeDataScore, name: 'Presence of time-related information' },
//             ]
//         };
//         if (timeDataScore > 0) {
//             timeTrueDataSerie.label = {
//                 show: true,
//                 formatter: '{c} endpoints with time-related description'
//             }
//         }
//         let timeFalseDataSerie: echarts.BarSeriesOption = {
//             name: 'Time related description of creation of the dataset',
//             type: 'bar',
//             stack: 'time',
//             colorBy: 'data',
//             data: [
//                 { value: (datasetDescriptionData.length - timeDataScore), name: 'Absence of time-related description' },
//             ]
//         };
//         if ((datasetDescriptionData.length - timeDataScore) > 0) {
//             timeFalseDataSerie.label = {
//                 show: true,
//                 formatter: '{c} endpoints without time-related description'
//             }
//         }
//         let sourceTrueDataSerie: echarts.BarSeriesOption = {
//             name: 'Description of the source or the process at the origin of the dataset',
//             type: 'bar',
//             stack: 'source',
//             colorBy: 'data',
//             data: [
//                 { value: sourceDataScore, name: 'Presence of description of the origin of the dataset' },
//             ]
//         };
//         if (sourceDataScore > 0) {
//             sourceTrueDataSerie.label = {
//                 show: true,
//                 formatter: '{c} endpoints with source description'
//             }
//         }
//         let sourceFalseDataSerie: echarts.BarSeriesOption = {
//             name: 'Description of the source or the process at the origin of the dataset',
//             type: 'bar',
//             stack: 'source',
//             colorBy: 'data',
//             data: [
//                 { value: (datasetDescriptionData.length - sourceDataScore), name: 'Absence of description of the origin of the dataset' },
//             ]
//         };
//         if ((datasetDescriptionData.length - sourceDataScore) > 0) {
//             sourceFalseDataSerie.label = {
//                 show: true,
//                 formatter: '{c} endpoints without source description'
//             }
//         }
//         let datasetDescriptionEchartOption = {
//             title: {
//                 text: 'Dataset description features in all endpoints',
//                 left: 'center'
//             },
//             tooltip: {
//                 confine: true
//             },
//             xAxis: {
//                 type: 'value',
//                 max: 'dataMax',
//             },
//             yAxis: {
//                 type: 'category',
//                 axisLabel: {
//                     formatter: 'Dataset\n description\n elements',
//                     overflow: 'breakAll'
//                 }
//             },
//             legend: {
//                 left: 'left',
//                 show: false
//             },
//             series: [whoTrueDataSerie, whoFalseDataSerie, licenseTrueDataSerie, licenseFalseDataSerie, timeTrueDataSerie, timeFalseDataSerie, sourceTrueDataSerie, sourceFalseDataSerie]
//         };
//         return datasetDescriptionEchartOption;
//     }).then((datasetDescriptionEchartOption) => {
//         let content = JSON.stringify(datasetDescriptionEchartOption);
//         return writeFile(datasetDescriptionOptionFilename, content).then(() => {
//             Logger.info("Dataset description chart option for generation ended");
//             return Promise.resolve();
//         });
//     });
// }

export function endpointServerChartOption(): Promise<void> {
    return Global.readJSONFile(DataCache.endpointServerDataFilename).then(endpointServerData => {
        if ((endpointServerData as EndpointServerDataObject[]).length > 0) {
            let serverCountMap: Map<string, number> = new Map();
            let endpointServerDataArray = (endpointServerData as EndpointServerDataObject[]);
            endpointServerDataArray.forEach(endpointServerDataObject => {
                if (serverCountMap.get(endpointServerDataObject.server) == undefined) {
                    serverCountMap.set(endpointServerDataObject.server, 1);
                } else {
                    let currentCount = serverCountMap.get(endpointServerDataObject.server);
                    serverCountMap.set(endpointServerDataObject.server, currentCount + 1);
                }
            })

            let values: number[] = [];
            let labels: string[] = [];
            serverCountMap.forEach((count, endpoint) => {
                if (count > 1) {
                    values.push(count);
                    labels.push(endpoint)
                }
            })

            let content = [
                {
                    values: values,
                    labels: labels,
                    type: 'pie'
                }
            ]
            return Global.writeFile(endpointServerChartOptionFilename, JSON.stringify(content))
        } else {
            return Promise.reject("No endpoint/server data found")
        }
    });

}