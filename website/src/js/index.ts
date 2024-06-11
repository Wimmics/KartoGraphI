import dayjs from 'dayjs';
import * as gridjs from "gridjs";
import "gridjs/dist/theme/mermaid.css";
import * as d3 from "d3"
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
import * as Control from './Control';
import * as View from './ViewUtils';
import * as Datatype from "./Datatypes";
import * as Plotly from 'plotly.js-dist';
import Graph from "graphology";
import ForceSupervisor from "graphology-layout-force/worker";
import Sigma from "sigma";

window.onload = (() => {

    View.setButtonAsToggleCollapse('endpointGeolocDetails', 'endpointGeolocDatatable');
    View.setButtonAsToggleCollapse('tableSPARQLFeaturesDetails', 'SPARQLFeaturesDatatable');
    View.setButtonAsToggleCollapse('tableSPARQLFeaturesStatsDetails', 'SPARQLFeaturesCountDatatable');
    View.setButtonAsToggleCollapse('KnownVocabulariesDetails', 'knowVocabEndpointDatatable');
    View.setButtonAsToggleCollapse('endpointKeywordsDetails', 'endpointKeywordsDatatable');
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
    })

    // Vocabulary Graph
    Control.Control.getCacheFile(Control.vocabEndpointDataFilename).then(vocabEndpointData => {
        vocabEndpointData = vocabEndpointData as Datatype.VocabEndpointDataObject[];
        let vocabEndpointsElement = document.getElementById("vocabs");
        if(vocabEndpointsElement) {
            let endpointSet = new Set<string>();
            let vocabularySet = new Set<string>();
            let nodeIdMap = new Map<string, Number>();
            let edgeArray: Set<Datatype.JSONObject> = new Set<Datatype.JSONObject>;

            (vocabEndpointData as Datatype.VocabEndpointDataObject[]).forEach(vocabEndpointDataElement => {
                endpointSet.add(vocabEndpointDataElement.endpoint);
                if(vocabEndpointDataElement.vocabularies) {
                    (new Set(vocabEndpointDataElement.vocabularies)).forEach(vocabulary => {
                        vocabularySet.add(vocabulary);
                        edgeArray.add({endpoint: vocabEndpointDataElement.endpoint, vocabulary:vocabulary})
                    });
                }
            })
            const graph = new Graph();
            let idNumber = 0;
            endpointSet.forEach(endpointName => {
                nodeIdMap.set(endpointName, idNumber);
                graph.addNode(idNumber.toString(), { label: endpointName, x: idNumber, y: idNumber % 100, size: 10, color: "blue" });
                idNumber++;
            })
            vocabularySet.forEach(vocabularyName => {
                nodeIdMap.set(vocabularyName, idNumber);
                graph.addNode(idNumber.toString(), { label: vocabularyName, x: idNumber, y: idNumber % 100, size: 10, color: "green" });
                idNumber++;
            })
            edgeArray.forEach(edgeObject => {
                let endpointId = nodeIdMap.get(edgeObject.endpoint as string);
                let vocabularyId = nodeIdMap.get(edgeObject.vocabulary as string);
                graph.addEdge(endpointId?.toString(), vocabularyId?.toString(), { size: 5, color: "grey" });
            })
        
            
            const layout = new ForceSupervisor(graph, {
                maxIterations: 50,
                settings: {
                  gravity: 10
                }
              });
            layout.start();
            const sigmaInstance = new Sigma(graph, vocabEndpointsElement);
        }
    })

    // Vocabulary Table

    // Triple Scatter Chart
    Control.Control.getCacheFile(Control.triplesEchartsOptionFilename).then(tripleChartData => {
        console.log("Filling triples chart ...");
        let triplesScatterElement = document.getElementById("tripleScatter");
        if (triplesScatterElement) {
            Plotly.newPlot("tripleScatter", [tripleChartData])
        }
    
        console.log("Triples chart filled");
    })
    


});