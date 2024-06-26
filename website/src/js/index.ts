import dayjs from 'dayjs';
import * as gridjs from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
import * as Plotly from 'plotly.js-dist-min';
import Graph from "graphology";
import FA2Layout from 'graphology-layout-forceatlas2/worker';
import circular from 'graphology-layout/circular';
import Sigma from "sigma";
import forceAtlas2 from 'graphology-layout-forceatlas2';
import * as Control from './Control';
import * as View from './ViewUtils';
import * as Datatype from "./Datatypes";
import * as Utils from "./Utils";

window.onload = (() => {

    View.setButtonAsToggleCollapse('endpointGeolocDetails', 'endpointGeolocDatatable');
    View.setButtonAsToggleCollapse('endpointVocabsDetails', 'endpointVocabsDatatable');
    View.setButtonAsToggleCollapse('endpointKeywordsDetails', 'endpointKeywordsDatatable');
    // View.setButtonAsToggleCollapse('endpointGeolocDetails', 'endpointGeolocDatatable');


    View.setButtonAsToggleCollapse('tableSPARQLFeaturesDetails', 'SPARQLFeaturesDatatable');
    View.setButtonAsToggleCollapse('tableSPARQLFeaturesStatsDetails', 'SPARQLFeaturesCountDatatable');
    View.setButtonAsToggleCollapse('tableRuleDetails', 'rulesDatatable');
    View.setButtonAsToggleCollapse('classDescriptionDetails', 'classDescriptionDatatable');
    View.setButtonAsToggleCollapse('classPropertiesDescriptionDetails', 'classPropertiesDescriptionDatatable');
    View.setButtonAsToggleCollapse('datasetDescriptionStatDetails', 'datasetDescriptionDatatable');
    View.setButtonAsToggleCollapse('shortUrisDetails', 'shortUrisDatatable');
    View.setButtonAsToggleCollapse('rdfDataStructuresDetails', 'rdfDataStructuresDatatable');
    View.setButtonAsToggleCollapse('readableLabelsDetails', 'readableLabelsDatatable');
    View.setButtonAsToggleCollapse('blankNodesDetails', 'blankNodesDatatable');

    (new Control.Control()).init().then(() => {

        // Geoloc Map
        Control.Control.getCacheFile(Control.geolocDataFilename).then(endpointGeolocData => {
            console.info("Filling geoloc chart...")
            let endpointGeolocDataTextArray: string[] = [];
            let endpointGeolocDataLatArray: number[] = [];
            let endpointGeolocDataLonArray: number[] = [];
            (endpointGeolocData as Datatype.GeolocDataObject[]).forEach(endpointGeoloc => {
                if (endpointGeoloc.lat !== undefined && endpointGeoloc.lon !== undefined) {
                    let legend = endpointGeoloc.popupHTML.replace(/<td>|<\/td>|<th colspan='2'>|<\/th>|<tr>|<tbody>|<\/tbody>|<table>|<\/table>|<\/thead>|<thead>|<\/body>|<a href=\'.*\' >|<\/a>/gm, "");
                    legend = legend.replace(/<\/tr>/g, ",\n");
                    endpointGeolocDataTextArray.push(legend);
                    endpointGeolocDataLatArray.push(endpointGeoloc.lat);
                    endpointGeolocDataLonArray.push(endpointGeoloc.lon);
                }
            });
            var data: Plotly.Data[] = [
                {
                    type: "scattermapbox",
                    text: endpointGeolocDataTextArray,
                    lon: endpointGeolocDataLonArray,
                    lat: endpointGeolocDataLatArray,
                    marker: { color: "green", size: 6 }
                }
            ];

            var layout: Partial<Plotly.Layout> = {
                dragmode: "zoom",
                mapbox: { style: "open-street-map", center: { lat: 39, lon: 12 }, zoom: 2 },
                margin: { r: 0, t: 0, b: 0, l: 0 }
            };

            Plotly.newPlot("map", data, layout);
            console.info("Geoloc chart filled")


            // Geoloc Table
            console.info("Filling geoloc table...")
            let endpointGeolocTable = document.getElementById('endpointGeolocTable');
            if (endpointGeolocTable != null) {
                endpointGeolocTable.innerHTML = "";
                let gridJSColumns = [
                    { name: 'Endpoint', sort: 'asc' },
                    'Latitude',
                    'Longitude',
                    'Country',
                    'Continent',
                    'City',
                    'Organization'
                ];
                let gridJSData = (endpointGeolocData as Datatype.GeolocDataObject[]).map(item => {
                    return [item.endpoint, item.lat, item.lon, item.country, item.region, item.city, item.org];
                });
                let gridJS = new gridjs.Grid({
                    columns: gridJSColumns,
                    data: gridJSData,
                    sort: true,
                    search: true,
                    pagination: {
                        limit: 10,
                        summary: false
                    }
                });
                gridJS.render(endpointGeolocTable);
                console.info("Geoloc table filled")
            }
        });

        // Vocabulary Graph
        Control.Control.getCacheFile(Control.vocabEndpointDataFilename).then(rawVocabEndpointData => {
            const vocabEndpointData = rawVocabEndpointData as Datatype.VocabEndpointDataObject[];
            let vocabEndpointsElement = document.getElementById("vocabs");
            if (vocabEndpointsElement) {
                let endpointSet = new Set<string>();
                let vocabularySet = new Set<string>();
                let nodeIdMap = new Map<string, Number>();
                let edgeArray: Set<Datatype.JSONObject> = new Set<Datatype.JSONObject>;

                vocabEndpointData.forEach(vocabEndpointDataElement => {
                    endpointSet.add(vocabEndpointDataElement.endpoint);
                    if (vocabEndpointDataElement.vocabularies) {
                        (new Set(vocabEndpointDataElement.vocabularies)).forEach(vocabulary => {
                            vocabularySet.add(vocabulary);
                            edgeArray.add({ endpoint: vocabEndpointDataElement.endpoint, vocabulary: vocabulary })
                        });
                    }
                })
                const graph = new Graph();
                let idNumber = 0;
                endpointSet.forEach(endpointName => {
                    nodeIdMap.set(endpointName, idNumber);
                    graph.addNode(idNumber.toString(), { label: endpointName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#39AD65" });
                    idNumber++;
                })
                vocabularySet.forEach(vocabularyName => {
                    nodeIdMap.set(vocabularyName, idNumber);
                    if (Control.Control.getInstance().getPrefixes().has(vocabularyName)) {
                        console.log("Control does not know ", vocabularyName)
                        vocabularyName = Control.Control.getInstance().getPrefixes().get(vocabularyName) as string;
                    }
                    graph.addNode(idNumber.toString(), { label: vocabularyName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#E3BB07" });
                    idNumber++;
                })
                edgeArray.forEach(edgeObject => {
                    let endpointId = nodeIdMap.get(edgeObject.endpoint as string);
                    let vocabularyId = nodeIdMap.get(edgeObject.vocabulary as string);
                    graph.addEdge(endpointId?.toString(), vocabularyId?.toString(), { size: 1, color: "black" });
                })

                const layout = new FA2Layout(graph, {
                    settings: forceAtlas2.inferSettings(graph)
                }
                );
                layout.start();
                const sigmaInstance = new Sigma(graph, vocabEndpointsElement);
                setTimeout(() => {
                    layout.stop()
                }, 30000)

                // Vocabulary Table

                let vocabEndpointTable = document.getElementById('endpointVocabsTable');
                if (vocabEndpointTable) {
                    vocabEndpointTable.innerHTML = "";
                    let gridJSColumns = [
                        { name: 'Endpoint', sort: 'asc' },
                        'Vocabularies'
                    ];
                    let gridJSData = vocabEndpointData.map(item => {
                        let vocabularyNames = item.vocabularies.map(vocabularyName => {
                            if (Control.Control.getInstance().getPrefixes().has(vocabularyName)) {
                                return vocabularyName = Control.Control.getInstance().getPrefixes().get(vocabularyName) as string;
                            } else {
                                return vocabularyName
                            }
                        })
                        return [item.endpoint, vocabularyNames.join(", ")];
                    });
                    let gridJS = new gridjs.Grid({
                        columns: gridJSColumns,
                        data: gridJSData,
                        sort: true,
                        search: true,
                        pagination: {
                            limit: 10,
                            summary: false
                        }
                    });
                    gridJS.render(vocabEndpointTable);
                }
            }
        });

        // Endpoint and keywords

        Control.Control.getCacheFile(Control.endpointKeywordDataFilename).then(vocabEndpointData => {

            let endpointKeywordsElement = document.getElementById("endpointKeywords");
            if (endpointKeywordsElement) {
                let endpointSet = new Set<string>();
                let keywordSet = new Set<string>();
                let nodeIdMap = new Map<string, Number>();
                let edgeArray: Set<Datatype.JSONObject> = new Set<Datatype.JSONObject>();

                (vocabEndpointData as Datatype.EndpointKeywordsDataObject[]).forEach(endpointKeywordDataElement => {
                    endpointSet.add(endpointKeywordDataElement.endpoint);
                    if (endpointKeywordDataElement.keywords) {
                        (new Set(endpointKeywordDataElement.keywords)).forEach(keyword => {
                            keywordSet.add(keyword);
                            edgeArray.add({ endpoint: endpointKeywordDataElement.endpoint, keyword: keyword })
                        });
                    }
                })
                const graph = new Graph();
                let idNumber = 0;
                endpointSet.forEach(endpointName => {
                    nodeIdMap.set(endpointName, idNumber);
                    graph.addNode(idNumber.toString(), { label: endpointName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#39AD65" });
                    idNumber++;
                })
                keywordSet.forEach(keywordName => {
                    nodeIdMap.set(keywordName, idNumber);
                    graph.addNode(idNumber.toString(), { label: keywordName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#F00A00" });
                    idNumber++;
                })
                edgeArray.forEach(edgeObject => {
                    let endpointId = nodeIdMap.get(edgeObject.endpoint as string);
                    let keywordId = nodeIdMap.get(edgeObject.keyword as string);
                    graph.addEdge(endpointId?.toString(), keywordId?.toString(), { size: 1, color: "black" });
                })

                const layout = new FA2Layout(graph, {
                    settings: forceAtlas2.inferSettings(graph)
                }
                );
                layout.start();
                const sigmaInstance = new Sigma(graph, endpointKeywordsElement);
                setTimeout(() => {
                    layout.stop()
                }, 30000)

                // Endpoint and keywords Table

                let endpointKeywordsTable = document.getElementById('endpointKeywordsTable');
                if (endpointKeywordsTable) {
                    endpointKeywordsTable.innerHTML = "";
                    let gridJSColumns = [
                        { name: 'Endpoint', sort: 'asc' },
                        'Keywords'
                    ];
                    let gridJSData = (vocabEndpointData as Datatype.EndpointKeywordsDataObject[]).map(item => {
                        return [item.endpoint, item.keywords.join(", ")];
                    });
                    let gridJS = new gridjs.Grid({
                        columns: gridJSColumns,
                        data: gridJSData,
                        sort: true,
                        search: true,
                        pagination: {
                            limit: 10,
                            summary: false
                        }
                    });
                    gridJS.render(endpointKeywordsTable);
                }
            }
        });

        // Metavocabularies and endpoints
        Control.Control.getCacheFile(Control.vocabEndpointDataFilename).then(vocabEndpointData => {
            vocabEndpointData = vocabEndpointData as Datatype.VocabEndpointDataObject[];
            let vocabEndpointsElementRDF = document.getElementById("standardVocabsRDF");
            let vocabEndpointsElementRDFS = document.getElementById("standardVocabsRDFS");
            let vocabEndpointsElementOWL = document.getElementById("standardVocabsOWL");
            let vocabEndpointsElementSHACL = document.getElementById("standardVocabsSHACL");
            let vocabEndpointsElementSKOS = document.getElementById("standardVocabsSKOS");
            let vocabEndpointsElementSWRL = document.getElementById("standardVocabsSWRL");
            let vocabEndpointsElementSPIN = document.getElementById("standardVocabsSPIN");
            if (vocabEndpointsElementRDF && vocabEndpointsElementRDFS && vocabEndpointsElementOWL && vocabEndpointsElementSHACL && vocabEndpointsElementSKOS && vocabEndpointsElementSWRL && vocabEndpointsElementSPIN) {
                let endpointSet = new Set<string>();
                let nodeIdMap = new Map<string, Number>();
                let edgeArray: Set<Datatype.JSONObject> = new Set<Datatype.JSONObject>;

                // RDF, RDFS, OWL, SHACL, OWL, SKOS, SPIN, SWRL
                const metavocabularies: string[] = ["http://www.w3.org/1999/02/22-rdf-syntax-ns#", "http://www.w3.org/2000/01/rdf-schema#", "http://www.w3.org/2002/07/owl#", "http://www.w3.org/ns/shacl#", "http://www.w3.org/2004/02/skos/core#", "http://spinrdf.org/spin#", "http://www.w3.org/2003/11/swrl#"];

                (vocabEndpointData as Datatype.VocabEndpointDataObject[]).forEach(vocabEndpointDataElement => {
                    endpointSet.add(vocabEndpointDataElement.endpoint);
                    if (vocabEndpointDataElement.vocabularies) {
                        let endpointVocabularySet = new Set<string>(vocabEndpointDataElement.vocabularies);
                        Utils.intersection(endpointVocabularySet, new Set(metavocabularies)).forEach(vocabulary => {
                            edgeArray.add({ endpoint: vocabEndpointDataElement.endpoint, vocabulary: vocabulary })
                        });
                    }
                })
                const graphRDF = new Graph();
                const graphRDFS = new Graph();
                const graphOWL = new Graph();
                const graphSHACL = new Graph();
                const graphSKOS = new Graph();
                const graphSWRL = new Graph();
                const graphSPIN = new Graph();
                let idNumber = 0;
                endpointSet.forEach(endpointName => {
                    nodeIdMap.set(endpointName, idNumber);
                    graphRDF.addNode(idNumber.toString(), { label: endpointName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#A2A3B0" });
                    graphRDFS.addNode(idNumber.toString(), { label: endpointName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#A2A3B0" });
                    graphOWL.addNode(idNumber.toString(), { label: endpointName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#A2A3B0" });
                    graphSHACL.addNode(idNumber.toString(), { label: endpointName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#A2A3B0" });
                    graphSKOS.addNode(idNumber.toString(), { label: endpointName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#A2A3B0" });
                    graphSWRL.addNode(idNumber.toString(), { label: endpointName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#A2A3B0" });
                    graphSPIN.addNode(idNumber.toString(), { label: endpointName, x: Math.random() * 100, y: Math.random() * 100, size: 3, color: "#A2A3B0" });
                    idNumber++;
                })
                graphRDF.addNode(idNumber.toString(), { label: "RDF", x: Math.random() * 100, y: Math.random() * 100, size: 6, color: "#00E646" });
                nodeIdMap.set("http://www.w3.org/1999/02/22-rdf-syntax-ns#", idNumber++);
                graphRDFS.addNode(idNumber.toString(), { label: "RDFS", x: Math.random() * 100, y: Math.random() * 100, size: 6, color: "#E3B507" });
                nodeIdMap.set("http://www.w3.org/2000/01/rdf-schema#", idNumber++);
                graphOWL.addNode(idNumber.toString(), { label: "OWL", x: Math.random() * 100, y: Math.random() * 100, size: 6, color: "#000FE0" });
                nodeIdMap.set("http://www.w3.org/2002/07/owl#", idNumber++);
                graphSHACL.addNode(idNumber.toString(), { label: "SHACL", x: Math.random() * 100, y: Math.random() * 100, size: 6, color: "#E60300" });
                nodeIdMap.set("http://www.w3.org/ns/shacl#", idNumber++);
                graphSKOS.addNode(idNumber.toString(), { label: "SKOS", x: Math.random() * 100, y: Math.random() * 100, size: 6, color: "#ACE600" });
                nodeIdMap.set("http://www.w3.org/2004/02/skos/core#", idNumber++);
                graphSWRL.addNode(idNumber.toString(), { label: "SWRL", x: Math.random() * 100, y: Math.random() * 100, size: 6, color: "#ACE600" });
                nodeIdMap.set("http://www.w3.org/2003/11/swrl#", idNumber++);
                graphSPIN.addNode(idNumber.toString(), { label: "SPIN", x: Math.random() * 100, y: Math.random() * 100, size: 6, color: "#00CFE0" });
                nodeIdMap.set("http://spinrdf.org/spin#", idNumber++);

                edgeArray.forEach(edgeObject => {
                    let endpointId = nodeIdMap.get(edgeObject.endpoint as string);
                    let vocabularyId = nodeIdMap.get(edgeObject.vocabulary as string);
                    if (edgeObject.vocabulary === "http://www.w3.org/1999/02/22-rdf-syntax-ns#") {
                        graphRDF.addEdge(endpointId?.toString(), vocabularyId?.toString(), { size: 1, color: "black" });
                    }
                    if (edgeObject.vocabulary === "http://www.w3.org/2000/01/rdf-schema#") {
                        graphRDFS.addEdge(endpointId?.toString(), vocabularyId?.toString(), { size: 1, color: "black" });
                    }
                    if (edgeObject.vocabulary === "http://www.w3.org/2002/07/owl#") {
                        graphOWL.addEdge(endpointId?.toString(), vocabularyId?.toString(), { size: 1, color: "black" });
                    }
                    if (edgeObject.vocabulary === "http://www.w3.org/ns/shacl#") {
                        graphSHACL.addEdge(endpointId?.toString(), vocabularyId?.toString(), { size: 1, color: "black" });
                    }
                    if (edgeObject.vocabulary === "http://www.w3.org/2004/02/skos/core#") {
                        graphSKOS.addEdge(endpointId?.toString(), vocabularyId?.toString(), { size: 1, color: "black" });
                    }
                    if (edgeObject.vocabulary === "http://www.w3.org/2003/11/swrl#") {
                        graphSWRL.addEdge(endpointId?.toString(), vocabularyId?.toString(), { size: 1, color: "black" });
                    }
                    if (edgeObject.vocabulary === "http://spinrdf.org/spin#") {
                        graphSPIN.addEdge(endpointId?.toString(), vocabularyId?.toString(), { size: 1, color: "black" });
                    }
                })

                // const positions = circular(graph);
                circular.assign(graphRDF);
                circular.assign(graphRDFS);
                circular.assign(graphOWL);
                circular.assign(graphSHACL);
                circular.assign(graphSKOS);
                circular.assign(graphSWRL);
                circular.assign(graphSPIN);

                const sigmaInstanceRDF = new Sigma(graphRDF, vocabEndpointsElementRDF);
                const sigmaInstanceRDFS = new Sigma(graphRDFS, vocabEndpointsElementRDFS);
                const sigmaInstanceOWL = new Sigma(graphOWL, vocabEndpointsElementOWL);
                const sigmaInstanceSHACL = new Sigma(graphSHACL, vocabEndpointsElementSHACL);
                const sigmaInstanceSKOS = new Sigma(graphSKOS, vocabEndpointsElementSKOS);
                const sigmaInstanceSWRL = new Sigma(graphSWRL, vocabEndpointsElementSWRL);
                const sigmaInstanceSPIN = new Sigma(graphSPIN, vocabEndpointsElementSPIN);
            }
        });

        // Vocabulary Table

        // SPARQL Coverage Charts
        console.log("Filling SPARQL coverage chart ...")
        Control.Control.getCacheFile(Control.sparqlCoveragePlotlyDataFilename).then(rawSparqlCoverageOption => {
            let sparqlCoverageElement = document.getElementById("SPARQLCoverageHisto");
            if (sparqlCoverageElement) {
                const sparqlCoverageOption = [rawSparqlCoverageOption] as Plotly.Data[];
                const sparqlCoverageLayout: Partial<Plotly.Layout> = {
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
                Plotly.newPlot("SPARQLCoverageHisto", sparqlCoverageOption, sparqlCoverageLayout)
            }

            console.log("SPARQL coverage chart filled")
        })

        // SPARQL Features Table
        console.log("Filling SPARQL features table ...")
        Control.Control.getCacheFile(Control.sparqlFeaturesDataFilename).then(sparqlFeatureData => {
            let sparqlFeaturesElement = document.getElementById("SPARQLFeaturesTable");
            if (sparqlFeaturesElement) {
                sparqlFeaturesElement.innerHTML = "";
                let gridJSColumns = [
                    { name: 'Endpoint', sort: 'asc' },
                    'Features'
                ];
                let gridJSData = (sparqlFeatureData as Datatype.SPARQLFeatureDataObject[]).map(item => {
                    return [item.endpoint, item.features.join(", ")];
                });
                let gridJS = new gridjs.Grid({
                    columns: gridJSColumns,
                    data: gridJSData,
                    sort: true,
                    search: true,
                    pagination: {
                        limit: 10,
                        summary: false
                    }
                });
                gridJS.render(sparqlFeaturesElement);
            }

            console.log("SPARQL features table filled")
        })

        // Triple Scatter Chart
        console.log("Filling triples chart ...");
        Control.Control.getCacheFile(Control.triplesPlotlyDataFilename).then(rawTripleChartData => {
            let triplesScatterElement = document.getElementById("tripleScatter");
            if (triplesScatterElement) {
                const tripleChartData = [rawTripleChartData] as Plotly.Data[];
                const tripleChartLayout: Partial<Plotly.Layout> = {
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
                };
                Plotly.newPlot("tripleScatter", tripleChartData, tripleChartLayout)
            }

            console.log("Triples chart filled");
        })

        // Classes Scatter Chart
        console.log("Filling classes chart ...");
        Control.Control.getCacheFile(Control.classesPlotlyDataFilename).then(rawClassChartData => {
            let classesScatterElement = document.getElementById("classScatter");
            if (classesScatterElement) {
                const classChartData = [rawClassChartData] as Plotly.Data[];
                const classChartLayout: Partial<Plotly.Layout> = {
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
                };
                Plotly.newPlot("classScatter", classChartData, classChartLayout)
            }

            console.log("Classes chart filled");
        })

        // Properties Scatter Chart
        console.log("Filling properties chart ...");
        Control.Control.getCacheFile(Control.propertiesPlotlyDataFilename).then(rawPropertyChartData => {
            let propertiesScatterElement = document.getElementById("propertyScatter");
            if (propertiesScatterElement) {
                const propertyChartData = [rawPropertyChartData] as Plotly.Data[];
                const propertyChartLayout: Partial<Plotly.Layout> = {
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
                };
                Plotly.newPlot("propertyScatter", propertyChartData, propertyChartLayout)
            }

            console.log("Properties chart filled");
        })

        // Languages Scatter Chart
        console.log("Filling languages chart ...");
        Control.Control.getCacheFile(Control.endpointLanguagesPlotlyDataFilename).then(rawLanguageListData => {
            let languagesScatterElement = document.getElementById("languagesScatter");
            if (languagesScatterElement) {
                const languageListData = [rawLanguageListData] as Plotly.Data[];
                const languageListLayout: Partial<Plotly.Layout> = {
                    xaxis: {
                        type: "linear",
                        showticklabels: false,
                        ticks: "",
                        autorange: true,
                    },
                    yaxis: {
                        type: 'linear',
                        autorange: true
                    }
                };
                Plotly.newPlot("languagesScatter", languageListData, languageListLayout)
            }

            console.log("Languages chart filled");
        })

        // Short URIs Scatter Chart
        console.log("Filling short URIs chart ...");
        Control.Control.getCacheFile(Control.shortUrisPlotlyDataFilename).then(rawShortUrisChartData => {
            let shortURIScatterElement = document.getElementById("shortUrisScatter");
            if (shortURIScatterElement) {
                const shortUrisChartData = [rawShortUrisChartData] as Plotly.Data[];
                const shortUrisChartLayout: Partial<Plotly.Layout> = {
                    xaxis: {
                        type: "linear",
                        showticklabels: false,
                        ticks: "",
                        autorange: true,
                    },
                    yaxis: {
                        type: 'linear',
                        autorange: true
                    }
                };
                Plotly.newPlot("shortUrisScatter", shortUrisChartData, shortUrisChartLayout)
            }

            console.log("Short URIs chart filled");
        })

        // Readable labels Scatter Chart
        console.log("Filling readable labels chart ...");
        Control.Control.getCacheFile(Control.readableLabelsPlotlyDataFilename).then(rawReadableLabelsChartData => {
            let readableLabelScatterElement = document.getElementById("readableLabelsScatter");
            if (readableLabelScatterElement) {
                const readableLabelsChartData = [rawReadableLabelsChartData] as Plotly.Data[];
                const readableLabelsChartLayout: Partial<Plotly.Layout> = {
                    xaxis: {
                        type: "linear",
                        showticklabels: false,
                        ticks: "",
                        autorange: true,
                    },
                    yaxis: {
                        type: 'linear',
                        autorange: true
                    }
                };
                Plotly.newPlot("readableLabelsScatter", readableLabelsChartData, readableLabelsChartLayout)
            }

            console.log("Readable labels chart filled");
        })

        // Blank Nodes Scatter Chart
        console.log("Filling blank nodes chart ...");
        Control.Control.getCacheFile(Control.blankNodesPlotlyDataFilename).then(rawBlankNodesChartData => {
            let blankNodesScatterElement = document.getElementById("blankNodesScatter");
            if (blankNodesScatterElement) {
                const blankNodesChartData = [rawBlankNodesChartData] as Plotly.Data[];
                const blankNodesChartLayout: Partial<Plotly.Layout> = {
                    xaxis: {
                        type: "linear",
                        showticklabels: false,
                        ticks: "",
                        autorange: true,
                    },
                    yaxis: {
                        type: 'linear',
                        autorange: true
                    }
                };
                Plotly.newPlot("blankNodesScatter", blankNodesChartData, blankNodesChartLayout)
            }

            console.log("Blank nodes chart filled");
        })

        // RDF Data Structures Scatter Chart
        console.log("Filling RDF data structures chart ...");
        Control.Control.getCacheFile(Control.rdfDataStructuresPlotlyDataFilename).then(rawRdfDataStructuresScatterData => {
            let rdfDataStructuresScatterElement = document.getElementById("rdfDataStructuresScatter");
            if (rdfDataStructuresScatterElement) {
                const rdfDataStructuresScatterData = [rawRdfDataStructuresScatterData] as Plotly.Data[];
                const rdfDataStructuresScatterLayout: Partial<Plotly.Layout> = {
                    xaxis: {
                        type: "linear",
                        showticklabels: false,
                        ticks: "",
                        autorange: true,
                    },
                    yaxis: {
                        type: 'linear',
                        autorange: true
                    }
                };
                Plotly.newPlot("rdfDataStructuresScatter", rdfDataStructuresScatterData, rdfDataStructuresScatterLayout)
            }

            console.log("RDF data structures chart filled");
        })



        // Endpoint/server Pie Chart
        console.log("Filling endpoint/server chart ...");
        Control.Control.getCacheFile(Control.endpointServerPlotlyDataFilename).then(rawEndpointServerChartData => {
            let endpointServerChartElement = document.getElementById("endpointServerChart");
            if (endpointServerChartElement) {
                const endpointServerChartData = [rawEndpointServerChartData] as Plotly.Data[];
                const endpointServerChartLayout: Partial<Plotly.Layout> = {
                };
                Plotly.newPlot("endpointServerChart", endpointServerChartData, endpointServerChartLayout)
            }

            console.log("endpoint/server chart filled");
        })



    });
})