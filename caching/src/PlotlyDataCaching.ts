import * as DataCache from "./DataCaching.js";
import { readFile, writeFile } from "fs/promises";
import { AverageRuntimeDataObject, ClassCountDataObject, DatasetDescriptionDataObject, EndpointServerDataObject, EndpointTestDataObject, GeolocDataObject, GraphListDataObject, JSONArray, KeywordsEndpointDataObject, LanguageListDataObject, PropertyCountDataObject, QualityMeasureDataObject, SPARQLCoverageDataObject, SPARQLFeatureDataObject, SPARQLFeatureDescriptionDataObject, TotalRuntimeDataObject, TripleCountDataObject, VocabEndpointDataObject, VocabKeywordsDataObject } from "./DataTypes.js";
import * as Logger from "./LogUtils.js";
import * as ChartsUtils from "./ChartsUtils.js";
import * as Global from "./GlobalUtils.js";
import * as Plotly from "plotly.js";

const numberOfVocabulariesLimit = 1000;

export const sparqlCoveragePlotlyDataFilename = DataCache.dataCachedFilePrefix + "sparqlCoveragePlotlyData.json";
export const sparql10CoveragePlotlyDataFilename = DataCache.dataCachedFilePrefix + "sparql10CoveragePlotlyData.json";
export const sparql11CoveragePlotlyDataFilename = DataCache.dataCachedFilePrefix + "sparql11CoveragePlotlyData.json";
export const vocabEndpointPlotlyDataFilename = DataCache.dataCachedFilePrefix + "vocabEndpointPlotlyData.json";
export const triplesPlotlyDataFilename = DataCache.dataCachedFilePrefix + "triplesPlotlyData.json";
export const classesPlotlyDataFilename = DataCache.dataCachedFilePrefix + "classesPlotlyData.json";
export const propertiesPlotlyDataFilename = DataCache.dataCachedFilePrefix + "propertiesPlotlyData.json";
export const shortUrisPlotlyDataFilename = DataCache.dataCachedFilePrefix + "shortUrisPlotlyData.json";
export const rdfDataStructuresPlotlyDataFilename = DataCache.dataCachedFilePrefix + "rdfDataStructuresPlotlyData.json";
export const readableLabelsPlotlyDataFilename = DataCache.dataCachedFilePrefix + "readableLabelsPlotlyData.json";
export const blankNodesPlotlyDataFilename = DataCache.dataCachedFilePrefix + "blankNodesPlotlyData.json";
export const endpointLanguagesPlotlyDataFilename = DataCache.dataCachedFilePrefix + "endpointLanguagesPlotlyData.json";
export const datasetDescriptionPlotlyDataFilename = DataCache.dataCachedFilePrefix + "datasetDescriptionPlotlyData.json";
export const totalRuntimePlotlyDataFilename = DataCache.dataCachedFilePrefix + "totalRuntimePlotlyData.json";
export const keywordEndpointPlotlyDataFilename = DataCache.dataCachedFilePrefix + "keywordEndpointPlotlyData.json";
export const standardVocabulariesEndpointGraphPlotlyDataFilename = DataCache.dataCachedFilePrefix + "standardVocabulariesEndpointGraphPlotlyData.json";
export const endpointServerChartPlotlyDataFilename = DataCache.dataCachedFilePrefix + "endpointServerChartPlotlyData.json";


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
            let featureCountChartOption: Partial<Plotly.ScatterData> = {
                mode: 'markers',
                type: 'scatter',
                x: featureCountXArray,
                y: featureCountYArray,
                text: featureCountTextArray,
            };
            return Global.writeFile(sparqlCoveragePlotlyDataFilename, JSON.stringify(featureCountChartOption));
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
            let triplesChartOption = {
                mode: 'markers',
                type: 'scatter',
                x: triplesXArray,
                y: triplesYArray,
                text: triplesTextArray,
            };
            return Global.writeFile(triplesPlotlyDataFilename, JSON.stringify(triplesChartOption));
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
            let classesChartOption = {
                mode: 'markers',
                type: 'scatter',
                x: classesXArray,
                y: classesYArray,
                text: classesTextArray,
            }
            return Global.writeFile(classesPlotlyDataFilename, JSON.stringify(classesChartOption));

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
            let propertiesChartOption = {
                mode: 'markers',
                type: 'scatter',
                x: propertiesXArray,
                y: propertiesYArray,
                text: propertiesTextArray,
            }
            return Global.writeFile(propertiesPlotlyDataFilename, JSON.stringify(propertiesChartOption));

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
            let shortUriChartOption = {
                mode: 'markers',
                type: 'scatter',
                x: shortUriXArray,
                y: shortUriYArray,
                text: shortUriTextArray,
            };
            return Global.writeFile(shortUrisPlotlyDataFilename, JSON.stringify(shortUriChartOption));

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
            let readableLabelsChartOption = {
                mode: 'markers',
                type: 'scatter',
                x: readableLabelsXArray,
                y: readableLabelsYArray,
                text: readableLabelsTextArray,
            };
            return Global.writeFile(readableLabelsPlotlyDataFilename, JSON.stringify(readableLabelsChartOption));

        } else {
            return Promise.reject("No data to generate the readable label chart");
        }
    }).catch((error) => {
        Logger.error("Error during readable label data reading", error)
    });
}

export function rdfDataStructuresChartOption(): Promise<void> {
    return Global.readJSONFile(DataCache.rdfDataStructureDataFilename).then(rdfDataStructuresData => {

        if ((rdfDataStructuresData as QualityMeasureDataObject[]).length > 0) {
            // Scatter plot of the number of properties through time

            rdfDataStructuresData = (rdfDataStructuresData as QualityMeasureDataObject[]).sort((to1, to2) => (to1.measure - to2.measure));

            let rdfDataStructuresXArray: number[] = [];
            let rdfDataStructuresYArray: number[] = [];
            let rdfDataStructuresTextArray: string[] = [];
            (rdfDataStructuresData as QualityMeasureDataObject[]).forEach((rdfDataStructuresObject, index) => {
                rdfDataStructuresXArray.push(index);
                rdfDataStructuresYArray.push(rdfDataStructuresObject.measure)
                rdfDataStructuresTextArray.push(rdfDataStructuresObject.endpoint)
            })
            let rdfDataStructuresChartOption = {
                mode: 'markers',
                type: 'scatter',
                x: rdfDataStructuresXArray,
                y: rdfDataStructuresYArray,
                text: rdfDataStructuresTextArray,
            };
            return Global.writeFile(rdfDataStructuresPlotlyDataFilename, JSON.stringify(rdfDataStructuresChartOption));

        } else {
            return Promise.reject("No data to generate the RDF data structures chart");
        }
    }).catch((error) => {
        Logger.error("Error during RDF data structures data reading", error)
    });
}

export function blankNodesChartOption(): Promise<void> {
    return Global.readJSONFile(DataCache.blankNodesDataFilename).then(blankNodesData => {

        if ((blankNodesData as QualityMeasureDataObject[]).length > 0) {
            // Scatter plot of the number of properties through time

            blankNodesData = (blankNodesData as QualityMeasureDataObject[]).sort((to1, to2) => (to1.measure - to2.measure));

            let blankNodesXArray: number[] = [];
            let blankNodesYArray: number[] = [];
            let blankNodesTextArray: string[] = [];
            (blankNodesData as QualityMeasureDataObject[]).forEach((blankNodesObject, index) => {
                blankNodesXArray.push(index);
                blankNodesYArray.push(blankNodesObject.measure)
                blankNodesTextArray.push(blankNodesObject.endpoint)
            })
            let blankNodesChartOption = {
                mode: 'markers',
                type: 'scatter',
                x: blankNodesXArray,
                y: blankNodesYArray,
                text: blankNodesTextArray,
            };
            return Global.writeFile(blankNodesPlotlyDataFilename, JSON.stringify(blankNodesChartOption));

        } else {
            return Promise.reject("No data to generate the blank nodes chart");
        }
    }).catch((error) => {
        Logger.error("Error during blank nodes data reading", error)
    });
}

export function endpointLanguagesChartOption(): Promise<void> {
    return Global.readJSONFile(DataCache.languageListDataFilename).then(rawLanguagesData => {
        if ((rawLanguagesData as LanguageListDataObject[]).length > 0) {
            let languagesDataArray = (rawLanguagesData as LanguageListDataObject[]).sort((to1, to2) => (to1.languages.length - to2.languages.length));
            let endpointLanguageValueXArray: number[] = [];
            let endpointLanguageValueYArray: number[] = [];
            let endpointLanguageTextArray: string[] = [];
            languagesDataArray.forEach((languageDataObject, index) => {
                endpointLanguageValueXArray.push(index);
                endpointLanguageValueYArray.push(languageDataObject.languages.length)
                endpointLanguageTextArray.push(languageDataObject.endpoint)
            })

            let content = {
                mode: 'markers',
                type: 'scatter',
                x: endpointLanguageValueXArray,
                y: endpointLanguageValueYArray,
                text: endpointLanguageTextArray,
            };
            return Global.writeFile(endpointLanguagesPlotlyDataFilename, JSON.stringify(content))
        } else {
            return Promise.reject("No language data found")
        }
    });
}

// export function datasetDescriptionChartOption() {
//     Logger.info("Dataset description chart data for generation started")
//     return readFile(DataCache.datasetDescriptionPlotlyDataFilename, "utf-8").then(datasetDescriptionRawData => {
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

            let content = {
                values: values,
                labels: labels,
                type: 'pie'
            };
            return Global.writeFile(endpointServerChartPlotlyDataFilename, JSON.stringify(content))
        } else {
            return Promise.reject("No endpoint/server data found")
        }
    });

}