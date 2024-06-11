import dayjs from 'dayjs';
import * as gridjs from "gridjs";
import * as d3 from "d3"
import duration from 'dayjs/plugin/duration';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime)
dayjs.extend(customParseFormat)
dayjs.extend(duration)
import { greenIcon, orangeIcon } from "./leaflet-color-markers";
import { Control } from './Control';
import * as View from './ViewUtils';
import * as Plotly from 'plotly.js-dist'

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

    (new Control()).init().then(() => {

        // Geoloc Map
        console.info("Filling geoloc chart...")
        let endpointGeolocData = Control.getInstance().geolocData();
        let endpointGeolocDataTextArray: string[] = [];
        let endpointGeolocDataLatArray: number[] = [];
        let endpointGeolocDataLonArray: number[] = [];
        endpointGeolocData.forEach(endpointGeoloc => {
            if (endpointGeoloc.lat !== undefined && endpointGeoloc.lon !== undefined) {
                console.log(endpointGeoloc.popupHTML)
                let legend = endpointGeoloc.popupHTML.replace(/<td>|<\/td>|<th colspan='2'>|<\/th>|<tr>|<tbody>|<\/tbody>|<table>|<\/table>|<\/thead>|<thead>|<\/body>|<a href=\'.*\' >|<\/a>/gm, "");
                legend = legend.replace(/<\/tr>/g, ",\n")
                console.log(legend)
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
            let gridJSData = endpointGeolocData.map(item => {
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
        }
    });

    // Vocabulary Graph

    // Vocabulary Table

});