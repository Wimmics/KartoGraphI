import * as DataCache from "./DataCaching.js";
import { ClassCountDataObject, EndpointServerDataObject, FAIRDataObject, LanguageListDataObject, PropertyCountDataObject, QualityMeasureDataObject, SPARQLFeatureDataObject, TripleCountDataObject } from "./DataTypes.js";
import * as Logger from "./LogUtils.js";
import * as Global from "./GlobalUtils.js";
import * as Plotly from "plotly.js";
import { text } from "stream/consumers";

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
export const fairnessChartPlotlyDataFilename = DataCache.dataCachedFilePrefix + "fairnessChartPlotlyData.json";


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
    }).catch((error) => {
        Logger.error("Error during language data reading", error)
    });
}

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
    }).catch((error) => {
        Logger.error("Error during endpoint/server data reading", error)
    });

}

export function fairnessChartOption(): any {
    return Global.readJSONFile(DataCache.fairnessDataFilename).then(rawFairnessData => {
        if ((rawFairnessData as FAIRDataObject[]).length > 0) {
            function calculateFairness(fairItem: FAIRDataObject) {
                return fairItem.f1a + fairItem.f1b + fairItem.f2a + fairItem.f2b + fairItem.a11 + fairItem.a12 + fairItem.i1 + fairItem.i2 + fairItem.i3 + fairItem.r11 + fairItem.r12 + fairItem.r13;
            }
            const fairnessData = (rawFairnessData as FAIRDataObject[]).filter(item => calculateFairness(item) > 0).sort((fairItemA, fairItemB) => {
                let fairA = calculateFairness(fairItemA);
                let fairB = calculateFairness(fairItemB);
                if(fairA != fairB) {
                    return fairB - fairA;
                } else if (fairItemA.endpoint != fairItemB.endpoint) {
                    return fairItemA.endpoint.localeCompare(fairItemB.endpoint);
                } else {
                    return fairItemA.kg.localeCompare(fairItemB.kg);
                }
            })
            let f1aChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.f1a),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Unique IDs"),
                name: 'F1A',
                type: 'bar'
            };
            let f1bChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.f1b),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Persistent IDs"),
                name: 'F1B',
                type: 'bar'
            };
            let f2aChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.f2a),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Structured metadata"),
                name: 'F2A',
                type: 'bar'
            }
            let f2bChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.f2b),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Shared vocabularies for metadata"),
                name: 'F2B',
                type: 'bar'
            }
            let a11ChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.a11),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Open resolution protocol"),
                name: 'A11',
                type: 'bar'
            }
            let a12ChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.a12),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Authorisation procedure or access rights"),
                name: 'A12',
                type: 'bar'
            }
            let i1ChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.i1),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Machine readable format"),
                name: 'I1',
                type: 'bar'
            }
            let i2ChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.i2),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Use shared ontologies"),
                name: 'I2',
                type: 'bar'
            }
            let i3ChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.i3),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "External links"),
                name: 'I3',
                type: 'bar'
            }
            let r11ChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.r11),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Metadata includes license"),
                name: 'R11',
                type: 'bar'
            }
            let r12ChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.r12),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Metadata includes provenance"),
                name: 'R12',
                type: 'bar'
            }
            let r13ChartData = {
                x: fairnessData.map((fairItem, index) => index),
                y: fairnessData.map((fairItem) => fairItem.r13),
                text: fairnessData.map((fairItem) => fairItem.endpoint + " - " + fairItem.kg + " - " + "Community standards"),
                name: 'R13',
                type: 'bar'
            }

            const fairChartData = [f1aChartData, f1bChartData, f2aChartData, f2bChartData, a11ChartData, a12ChartData, i1ChartData, i2ChartData, i3ChartData, r11ChartData, r12ChartData, r13ChartData]
            return Global.writeFile(fairnessChartPlotlyDataFilename, JSON.stringify(fairChartData))
        } else {
            return Promise.reject("No fairness data found")
        }
    }).catch((error) => {
        Logger.error("Error during fairness data reading", error)
    });
}
