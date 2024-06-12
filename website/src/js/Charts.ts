import dayjs from "dayjs";
import L from "leaflet";
import 'leaflet/dist/leaflet.css'
import 'leaflet-providers';
import * as echarts from "echarts/core";
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from "echarts/components"
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([TitleComponent, TooltipComponent, LegendComponent, GridComponent])
import { greenIcon, orangeIcon } from "./leaflet-color-markers";
import { KartoChart, KartoMapChart } from "./ViewClasses";
import { collapseHtml, unCollapseHtml, getMainContentColWidth } from "./ViewUtils";
import { Control } from "./Control";
import { precise } from "./Utils";
import * as gridjs from "gridjs";
import "gridjs/dist/theme/mermaid.css";

echarts.use([CanvasRenderer])

const numberOfVocabulariesLimit = 100;

export let geolocChart = new KartoMapChart({
    chartObject: L.map('map').setView([39.36827914916014, 12.117919921875002], 2).addLayer(L.tileLayer('https://maptiles.p.rapidapi.com/en/map/v1/{z}/{x}/{y}.png?rapidapi-key=915b5d333bmshb215b63b0519269p1a2e4ejsn5cfd1822e416', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    })),
    fillFunction: function () {
        if (!this.filled) {

            console.info("Filling geoloc chart...")

            this.chartObject.invalidateSize();
            let mapDiv = document.getElementById('#map');
            if (mapDiv) {
                mapDiv.style.width = getMainContentColWidth() + "px";
            }

            let endpointGeolocData = Control.getInstance().geolocData();

            function endpointGeolocTableFill() {
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
            }

            endpointGeolocData.forEach(endpointGeoloc => {
                try {
                    let markerIcon = greenIcon;

                    let endpointMarker = L.marker([endpointGeoloc.lat, endpointGeoloc.lon], { icon: markerIcon });
                    endpointMarker.on('click', clickEvent => {
                        endpointMarker.bindPopup(endpointGeoloc.popupHTML).openPopup();
                    });
                    endpointMarker.addTo(this.chartObject);
                    this.markerArray.push(endpointMarker);
                } catch (error) {
                    console.error(error, endpointGeoloc)
                }
            });
            endpointGeolocTableFill();
            this.redraw();
            this.filled = true;
        }
        return Promise.resolve();
    },
    redrawFunction: function () {
        this.chartObject.invalidateSize();
        let mapDiv = document.getElementById('#map');
        if (mapDiv) {
            mapDiv.style.width = getMainContentColWidth() + "px";
        }
        this.chartObject.setView([39.36827914916014, 12.117919921875002], 2);
    },
    clearFunction: function () {
        this.markerArray.forEach(marker => {
            marker.removeFrom(this.chartObject);
        });
        this.markerArray = [];
        this.filled = false;
    },
    hideFunction: function () {
    },
    showFunction: function () {
    },
});

export let sparqlFeaturesContent = new KartoChart({
    fillFunction: () => {
        let featuresDescriptionMap = new Map();
        let featuresQueryMap = new Map();
        try {
            Control.getInstance().sparqlFeatureDesc.forEach(featureDesc => {
                featuresDescriptionMap.set(featureDesc.feature, featureDesc.description);
                featuresQueryMap.set(featureDesc.feature, featureDesc.query);
            });

            let sparqlFeaturesDataArray = Control.getInstance().sparqlFeaturesData();

            sparqlFeaturesDataArray.sort((a, b) => {
                return a.endpoint.localeCompare(b.endpoint);
            });
            function fillFeaturesTable() {
                let tableHTML = document.getElementById('#SPARQLFeaturesTable');
                if (tableHTML) {
                    tableHTML.innerHTML = "";
                }
                let grisJSData = sparqlFeaturesDataArray.map((item, i) => {
                    return [item.endpoint, item.features.map(feature => {
                        return `<span title="${featuresDescriptionMap.get(feature)}">${feature}</span>`;
                    }).join(", ")];
                });
                let gridJSColumns = [
                    { name: 'Endpoint', sort: 'asc' },
                    {
                        name: 'Features',
                        formatter: (cell) => gridjs.html(`${cell}`)
                    }
                ];
                let gridJS = new gridjs.Grid({
                    columns: gridJSColumns,
                    data: grisJSData,
                    sort: true,
                    search: true,
                    pagination: {
                        limit: 10,
                        summary: false
                    },
                });
                let sparqlFeaturesTableElement = document.getElementById('SPARQLFeaturesTable');
                if (sparqlFeaturesTableElement != null) {
                    gridJS.render(sparqlFeaturesTableElement);
                }

            }

            fillFeaturesTable()
            sparqlFeaturesContent.filled = true;
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            return Promise.resolve();
        }
    }
});

export let sparql10Chart = new KartoChart({
    chartObject: echarts.init(document.getElementById('SPARQL10histo')),
    fillFunction: function () {
        try {
            let option = Control.getInstance().retrieveFileFromVault(sparql10CoverageEchartsOptionFilename);
            this.chartObject.setOption(option);
            this.option = option;
            return Promise.resolve();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    },
    redrawFunction: function () {
        const sparql10histoElement = document.getElementById('SPARQL10histo');
        if (sparql10histoElement) {
            sparql10histoElement.style.width = getMainContentColWidth() * .48 + "px";
            sparql10histoElement.style.height = "500px";
        }

        (this.chartObject as echarts.ECharts).getDom().classList.remove('placeholder');
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    },
    clearFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        (this.chartObject as echarts.ECharts).getDom().classList.add('placeholder');
    }
});

export let sparql11Chart = new KartoChart({
    chartObject: echarts.init(document.getElementById('SPARQL11histo')),
    fillFunction: function () {
        try {
            let option = Control.getInstance().retrieveFileFromVault(sparql11CoverageEchartsOptionFilename);
            this.chartObject.setOption(option);
            this.option = option;

            this.redraw();
            return Promise.resolve();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    },
    redrawFunction: function () {
        const sparql11histoElement = document.getElementById('SPARQL11histo');
        if (sparql11histoElement) {
            sparql11histoElement.style.width = getMainContentColWidth() * .48 + "px";
            sparql11histoElement.style.height = "500px";
        }

        (this.chartObject as echarts.ECharts).getDom().classList.remove('placeholder');
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    },
    clearFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        (this.chartObject as echarts.ECharts).getDom().classList.add('placeholder');
    }
});

export let sparqlCoverCharts = new KartoChart({
    chartObject: echarts.init(document.getElementById('SPARQLCoverageHisto')),
    fillFunction: function () {
        try {
            let option = Control.getInstance().retrieveFileFromVault(sparqlCoverageEchartsOptionFilename);
            this.option = option;
            this.chartObject.setOption(option);

            let maxSparql10 = 24;
            let maxSparql11 = 19;

            this.redraw();

            function fillTestTable() {
                let tableHTML = document.querySelector('#SPARQLFeaturesCountTable');
                if (tableHTML) {
                    tableHTML.innerHTML = "";
                }
                let gridJSData = Control.getInstance().sparqlCoverCountData().sort((a, b) => {
                    return a.endpoint.localeCompare(b.endpoint);
                }).map((item, i) => {
                    return [item.endpoint, precise((item.sparql10 / maxSparql10) * 100, 3) + "%", precise((item.sparql11 / maxSparql11) * 100, 3) + "%"];
                });
                let gridJSColumns = [
                    { name: 'Endpoint', sort: 'asc' },
                    {
                        name: 'SPARQL 1.0',
                        attributes: (cell) => {
                            // add these attributes to the td elements only
                            if (cell) {
                                return {
                                    'data-cell-content': cell,
                                    'onclick': () => console.log(cell),
                                    'style': 'cursor: pointer',
                                };
                            }
                        }
                    },
                    'SPARQL 1.1'
                ];
                let gridJS = new gridjs.Grid({
                    columns: gridJSColumns,
                    data: gridJSData,
                    sort: true,
                    search: true,
                    pagination: {
                        limit: 10,
                        summary: false
                    },
                });
                let sparqlFeaturesCountTableElement = document.getElementById('SPARQLFeaturesCountTable');
                if (sparqlFeaturesCountTableElement != null) {
                    gridJS.render(sparqlFeaturesCountTableElement);
                }
            }

            fillTestTable();
            return Promise.resolve()
                .then(() => { this.filled = true; });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            return Promise.resolve();
        }
    },
    redrawFunction: function () {
        let SPARQLCoverageHisto = document.getElementById('#SPARQLCoverageHisto');
        if (SPARQLCoverageHisto) {
            SPARQLCoverageHisto.style.width = getMainContentColWidth() + "px"
        }
        this.chartObject.getDom().classList.remove('placeholder');
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    },
    clearFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        this.chartObject.getDom().classList.add('placeholder');
    }
});

export let endpointVocabsChart = new KartoChart({
    chartObject: echarts.init(document.getElementById('vocabs')),
    option: {},
    fillFunction: function () {
        try {
            return new Promise<void>((resolve, reject) => {
                if (!this.filled) {
                    this.show();

                    this.option = Control.getInstance().retrieveFileFromVault(vocabEndpointEchartsOptionFilename);
                    this.chartObject.setOption(this.option, true);
                    this.chartObject.on('click', 'series', event => {
                        if (event.dataType.localeCompare("node") == 0) {
                            let uriLink = event.data.name;
                            window.open(uriLink, '_blank')?.focus();
                        }
                    })
                }
                resolve();
            }).then(() => { this.filled = true; });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    },
    hideFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        collapseHtml('vocabs');
    },
    showFunction: function () {
        this.redraw();
        unCollapseHtml('vocabs');
    },
    redrawFunction: function () {
        let vocabs = document.getElementById('#vocabs');
        if (vocabs) {
            vocabs.style.width = getMainContentColWidth() + "px"
        }
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    },
    clearFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
    }
});

export let vocabKeywordChart = new KartoChart({
    chartObject: echarts.init(document.getElementById('endpointKeywords')),
    option: {},
    hideFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        collapseHtml('endpointKeywords');
        collapseHtml('endpointKeywordsDetails');
        const endpointKeywordsTableBody = document.getElementById('#endpointKeywordsTableBody');
        if (endpointKeywordsTableBody) {
            endpointKeywordsTableBody.innerHTML = "";
        }
    },
    showFunction: function () {
        this.redraw();
        unCollapseHtml('endpointKeywords');
        unCollapseHtml('endpointKeywordsDetails');
    },
    fillFunction: function () {
        try {
            return new Promise<void>((resolve, reject) => {
                if (!this.filled) {
                    this.show();

                    this.option = Control.getInstance().retrieveFileFromVault(keywordEndpointEchartsOptionFilename);
                    console.log(this.option)
                    this.chartObject.setOption(this.option, true);
                    this.chartObject.on('click', 'series', event => {
                        if (event.dataType.localeCompare("node") == 0) {
                            let uriLink = event.data.name;
                            window.open(uriLink, '_blank')?.focus();
                        }
                    })
                }
                resolve();
            }).then(() => { this.filled = true; });
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        }
    },
    redrawFunction: function () {
        const endpointKeywordsElement = document.getElementById('endpointKeywords');
        if (endpointKeywordsElement) {
            endpointKeywordsElement.style.width = getMainContentColWidth() + "px";
        }
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
        let codeQuery2Div = document.createElement('code').innerHTML = `SELECT DISTINCT ?endpointUrl ?vocabulary { 
            SERVICE <http://prod-dekalog.inria.fr/sparql> { 
                GRAPH ?g { 
                    { ?endpoint <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
                    UNION { ?base <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
                    ?metadata <http://ns.inria.fr/kg/index#curated> ?base , ?endpoint . 
                    ?base <http://rdfs.org/ns/void#vocabulary> ?vocabulary . 
                    FILTER(isIri(?vocabulary)) 
                } 
            } 
            SERVICE <https://lov.linkeddata.es/dataset/lov/sparql> { 
                GRAPH <https://lov.linkeddata.es/dataset/lov> { 
                    ?vocabURI a <http://purl.org/vocommons/voaf#Vocabulary> . } 
                } 
            } 
            GROUP BY ?endpointUrl ?vocabulary`;
        const endpointKeywordQueryCell = document.getElementById('#endpointKeywordQueryCell');
        if (endpointKeywordQueryCell) {
            endpointKeywordQueryCell.innerHTML = "";
            document.getElementById('#endpointKeywordQueryCell')?.append(codeQuery2Div);
        }
    },
    clearFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        const endpointKeywordQueryCell = document.getElementById('#endpointKeywordQueryCell');
        if (endpointKeywordQueryCell) {
            endpointKeywordQueryCell.innerHTML = "";
        }
    }
});

export let tripleChart = new KartoChart({
    chartObject: echarts.init(document.getElementById('tripleScatter')),
    option: {},
    fillFunction: function () {
        console.log("fill", (this.chartObject as echarts.ECharts).getOption())
        console.log("Filling triple chart")
        try {
            let option = Control.getInstance().retrieveFileFromVault(triplesEchartsOptionFilename);
            this.option = option;

            this.filled = true;

            this.redraw();
            console.log("Triple chart filled")
            return Promise.resolve();
        } catch (e) {
            console.error(e);
            console.log("Triple chart failed")
            return Promise.reject(e);
        } finally {
            return Promise.resolve();
        }
    },
    hideFunction: function () {
        console.log("hide", (this.chartObject as echarts.ECharts).getOption())
        // this.chartObject.setOption({ series: [] }, true);
        collapseHtml('tripleScatter');
    },
    showFunction: function () {
        console.log("show", (this.chartObject as echarts.ECharts).getOption())
        unCollapseHtml('tripleScatter');
    },
    redrawFunction: function () {
        console.log("redraw", (this.chartObject as echarts.ECharts).getOption())
        console.log("redraw triple chart")
        console.log(this.option)
        const tripleScatterElement = document.getElementById('tripleScatter');
        if (tripleScatterElement) {
            tripleScatterElement.setAttribute("style", `width:${getMainContentColWidth()}px`);
            this.chartObject.setOption(this.option, true);
            this.chartObject.resize();
        }
        console.log("redraw triple chart ended")
    }
});

export let classNumberChart = new KartoChart({
    chartObject: echarts.init(document.getElementById('classScatter')),
    option: {},
    fillFunction: function () {
        try {
            let option = Control.getInstance().retrieveFileFromVault(classesEchartsOptionFilename);
            this.option = option;
            this.filled = true;
            this.redraw();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            return Promise.resolve();
        }
    },
    hideFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        collapseHtml('classScatter');
    },
    showFunction: function () {
        unCollapseHtml('classScatter');
    },
    redrawFunction: function () {
        const classScatterElement = document.getElementById('classScatter');
        if (classScatterElement) {
            classScatterElement.style.width = getMainContentColWidth().toString();
        }
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    }
});

export let propertyNumberChart = new KartoChart({
    chartObject: echarts.init(document.getElementById('propertyScatter')),
    option: {},
    fillFunction: function () {
        try {
            let option = Control.getInstance().retrieveFileFromVault(propertiesEchartsOptionFilename);
            this.option = option;
            this.filled = true;
            this.redraw();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            return Promise.resolve();
        }
    },
    hideFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        collapseHtml('propertyScatter');
    },
    showFunction: function () {
        unCollapseHtml('propertyScatter');
    },
    redrawFunction: function () {
        const propertyScatterElement = document.getElementById('propertyScatter');
        if (propertyScatterElement) {
            propertyScatterElement.style.width = getMainContentColWidth().toString();
        }
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    }
});

export let classAndPropertiesContent = new KartoChart({
    fillFunction: () => {
        try {
            if (classAndPropertiesContent !== undefined) {
                if (!classAndPropertiesContent.filled) {
                    let classPropertyDataTmp = Control.getInstance().classPropertyData()

                    classPropertyDataTmp.sort((a, b) => (a.class as string).localeCompare((b.class as string)));

                    function fillclassDescriptionTable() {
                        let tableHTML = document.getElementById("#classDescriptionTable");
                        if (tableHTML !== null) {
                            tableHTML.innerHTML = "";
                        }

                        let gridJSData = classPropertyDataTmp.map((countsItem, i) => {
                            let classDescription = countsItem.class;
                            let classTriples = countsItem.triples;
                            let classClasses = countsItem.classes;
                            let classProperties = countsItem.properties;
                            let classDistinctSubjects = countsItem.distinctSubjects;
                            let classDistinctObjects = countsItem.distinctObjects;
                            let endpoints = countsItem.endpoints;

                            return {
                                classDescription: classDescription,
                                classTriples: classTriples,
                                classClasses: classClasses,
                                classProperties: classProperties,
                                classDistinctSubjects: classDistinctSubjects,
                                classDistinctObjects: classDistinctObjects,
                                endpoints: endpoints
                            }
                        });
                        let gridJSColumns = [
                            { field: "classDescription", title: "Class" },
                            { field: "classTriples", title: "Triples" },
                            { field: "classClasses", title: "Classes" },
                            { field: "classProperties", title: "Properties" },
                            { field: "classDistinctSubjects", title: "Distinct Subjects" },
                            { field: "classDistinctObjects", title: "Distinct Objects" },
                            { field: "endpoints", title: "Endpoints" }
                        ];
                        let gridJSTable = new gridjs.Grid({
                            columns: gridJSColumns,
                            data: gridJSData,
                            sort: true,
                            search: true,
                            pagination: {
                                limit: 10,
                                summary: false
                            }
                        });
                        let classDescriptionTableElement = document.getElementById('classDescriptionTable');
                        if (classDescriptionTableElement != null) {
                            gridJSTable.render(classDescriptionTableElement);
                        }
                    }
                    fillclassDescriptionTable()
                    classAndPropertiesContent.filled = true;
                }
            }
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            return Promise.resolve();
        }
    }
});

export let descriptionElementChart = new KartoChart({
    chartObject: echarts.init(document.getElementById('datasetdescriptionRadar')),
    option: {},
    fillFunction: function () {
        try {
            if (!this.filled) {
                let datasetDescriptionDataTmp = Control.getInstance().datasetDescriptionData();
                datasetDescriptionDataTmp.sort((a, b) => {
                    return a.endpoint.localeCompare(b.endpoint);
                });

                // Table
                let tableHTML = document.getElementById('#datasetDescriptionTable');
                if (tableHTML !== null) {
                    tableHTML.innerHTML = "";
                }
                let gridJSData = datasetDescriptionDataTmp.map(item => {
                    return {
                        endpoint: item.endpoint,
                        who: item.who,
                        license: item.license,
                        time: item.time,
                        source: item.source
                    }
                });
                let gridJSColumns = [
                    { id: "endpoint", name: "Endpoint", field: "endpoint", sortable: true },
                    { id: "who", name: "Who", field: "who", sortable: true },
                    { id: "license", name: "License", field: "license", sortable: true },
                    { id: "time", name: "Time", field: "time", sortable: true },
                    { id: "source", name: "Source", field: "source", sortable: true }
                ];
                let gridJSTable = new gridjs.Grid({
                    columns: gridJSColumns,
                    data: gridJSData,
                    sort: true,
                    search: true,
                    pagination: {
                        limit: 10,
                        summary: false
                    }
                });
                let datasetDescriptionTableElement = document.getElementById('datasetDescriptionTable');
                if (datasetDescriptionTableElement != null) {
                    gridJSTable.render(datasetDescriptionTableElement);
                }

                // chart
                let option = Control.getInstance().retrieveFileFromVault(datasetDescriptionEchartsOptionFilename);
                this.option = option;
                this.redraw();
            }
            this.filled = true;
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            return Promise.resolve();
        }
    },
    redrawFunction: function () {
        const element = document.getElementById('datasetdescriptionRadar');
        if (element) {
            element.style.width = getMainContentColWidth().toString();
        }
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    },
    clearFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        const tableBody = document.getElementById('datasetDescriptionTableBody');
        if (tableBody !== null) {
            tableBody.innerHTML = "";
        }
    }
});

export let shortUriChart = new KartoChart({
    chartObject: echarts.init(document.getElementById('shortUrisScatter')),
    option: {},
    fillFunction: function () {
        try {
            if (!this.filled) {
                let shortUrisMeasureQuery = "SELECT DISTINCT ?g ?endpointUrl ?measure { " +
                    "GRAPH ?g {" +
                    "?endpoint <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . " +
                    "?metadata <http://ns.inria.fr/kg/index#curated> ?endpoint . " +
                    "?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode . " +
                    "?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/shortUris.ttl> . " +
                    "?measureNode <http://www.w3.org/ns/dqv#value> ?measure . " +
                    "}" +
                    " } GROUP BY ?g ?endpointUrl ?measure ";
                this.shortUrisMeasureQuery = shortUrisMeasureQuery;
                const shortUrisQueryCellElement = document.getElementById('shortUrisQueryCell');
                if (shortUrisQueryCellElement !== null) {
                    shortUrisQueryCellElement.innerHTML = "";
                    let innerCode = document.createElement('code').innerText;
                    innerCode = shortUrisMeasureQuery;
                    shortUrisQueryCellElement.append(innerCode);
                }
                this.option = Control.getInstance().retrieveFileFromVault(shortUrisEchartsOptionFilename);
                this.redraw();

                // Average measure
                let shortUriMeasureSum = Control.getInstance().shortUriData().map(a => a.measure).reduce((previous, current) => current + previous);
                let shortUrisAverageMeasure = shortUriMeasureSum / Control.getInstance().shortUriData().length;
                console.log("shortUrisAverageMeasure", shortUrisAverageMeasure)
                const shortUrisMeasureElement = document.getElementById('shortUrisMeasure');
                if (shortUrisMeasureElement !== null) {
                    shortUrisMeasureElement.innerText = precise(shortUrisAverageMeasure) + "%";
                }

                // Measure Details
                function fillShortUriTable() {
                    let tableHTML = document.getElementById('shortUrisTable');
                    if (tableHTML !== null) {
                        tableHTML.innerHTML = "";
                    }

                    let endpointDataSerieMap = new Map();
                    Control.getInstance().shortUriData().forEach((shortUriItem, i) => {
                        if (endpointDataSerieMap.get(shortUriItem.endpoint) == undefined) {
                            endpointDataSerieMap.set(shortUriItem.endpoint, []);
                        }
                        endpointDataSerieMap.get(shortUriItem.endpoint).push([shortUriItem.date, precise(shortUriItem.measure)]);
                    });

                    let gridJSData: { endpoint: string, measure: number }[] = [];
                    endpointDataSerieMap.forEach((serieData, endpoint, map) => {
                        let endpointMeasureSum = serieData.map(a => Number.parseFloat(a[1])).reduce((previous, current) => current + previous);
                        let measureAverage = endpointMeasureSum / serieData.length;
                        let measureAverageRounded = Number.parseFloat(precise(measureAverage, 3));
                        gridJSData.push({ endpoint: endpoint, measure: measureAverageRounded });
                    });
                    let gridJSColumns = [
                        { id: "endpoint", name: "Endpoint", field: "endpoint", sortable: true },
                        {
                            id: "measure", name: "Measure", field: "measure", sortable: true, formatter: (cell, row) => {
                                return cell + "%";
                            }
                        }
                    ];
                    let gridJSTable = new gridjs.Grid({
                        columns: gridJSColumns,
                        data: gridJSData,
                        sort: true,
                        search: true,
                        pagination: {
                            limit: 10,
                            summary: false
                        }
                    });
                    let shortUrisTableElement = document.getElementById('shortUrisTable');
                    if (shortUrisTableElement != null) {
                        gridJSTable.render(shortUrisTableElement);
                    }
                }
                fillShortUriTable();
            } else {
                this.hide();
            }
            this.filled = true;
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            return Promise.resolve();
        }
    },
    redrawFunction: function () {
        const shortUrisQueryCell = document.getElementById('shortUrisQueryCell');
        if (shortUrisQueryCell !== null) {
            shortUrisQueryCell.innerHTML = "";
            let codeElement = document.createElement('code');
            codeElement.innerText = this.shortUrisMeasureQuery;
            shortUrisQueryCell.appendChild(codeElement);
            shortUrisQueryCell.style.width = getMainContentColWidth() + "px";
        }
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    }
    , clearFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        const shortUrisMeasureElement = document.getElementById('shortUrisMeasure');
        if (shortUrisMeasureElement !== null) {
            shortUrisMeasureElement.innerHTML = "";
        }
    },
    hideFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        const shortUrisMeasureElement = document.getElementById('shortUrisMeasure');
        if (shortUrisMeasureElement !== null) {
            shortUrisMeasureElement.innerHTML = "";
        }
        collapseHtml('shortUrisScatter');
        collapseHtml('shortUriMeasureRow');
    },
    showFunction: function () {
        unCollapseHtml('shortUrisScatter');
        unCollapseHtml('shortUriMeasureRow');
    }
});

export let rdfDataStructureChart = new KartoChart({
    chartObject: echarts.init(document.getElementById('rdfDataStructuresScatter')),
    option: {},
    fillFunction: function () {
        if (!this.filled) {
            this.query = "SELECT DISTINCT ?g ?endpointUrl ?measure { " +
                "GRAPH ?g {" +
                "?endpoint <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . " +
                "?metadata <http://ns.inria.fr/kg/index#curated> ?endpoint . " +
                "?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode . " +
                "?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/RDFDataStructures.ttl> . " +
                "?measureNode <http://www.w3.org/ns/dqv#value> ?measure . " +
                "}" +
                " } GROUP BY ?g ?endpointUrl ?measure ";

            let codeElement = document.createElement('code');
            codeElement.innerText = this.query;
            let rdfDataStructuresQueryCellElement = document.getElementById('rdfDataStructuresQueryCell');
            if (rdfDataStructuresQueryCellElement) {
                rdfDataStructuresQueryCellElement.innerHTML = "";
                rdfDataStructuresQueryCellElement.append(codeElement);
            }

            let rdfDataStructureDataTmp = Control.getInstance().rdfDataStructureData();
            let endpointDataSerieMap = new Map();
            rdfDataStructureDataTmp.forEach((rdfDataStructureItem, i) => {
                if (endpointDataSerieMap.get(rdfDataStructureItem.endpoint) == undefined) {
                    endpointDataSerieMap.set(rdfDataStructureItem.endpoint, []);
                }
                endpointDataSerieMap.get(rdfDataStructureItem.endpoint).push([rdfDataStructureItem.date, precise(rdfDataStructureItem.measure)]);
            });

            if (endpointDataSerieMap.size > 0) {
                this.show()

                // Chart
                this.option = Control.getInstance().retrieveFileFromVault(rdfDataStructuresEchartsOptionFilename);
                this.redraw();

                // Average measure
                let rdfDataStructureMeasureSum = rdfDataStructureDataTmp.map(a => a.measure).reduce((previous, current) => current + previous);
                let rdfDataStructuresAverageMeasure = rdfDataStructureMeasureSum / rdfDataStructureDataTmp.length;
                let rdfDataStructuresMeasureElement = document.getElementById('rdfDataStructuresMeasure');
                if (rdfDataStructuresMeasureElement !== null) {
                    rdfDataStructuresMeasureElement.innerText = precise(rdfDataStructuresAverageMeasure, 3) + "%";
                }

                // Measire Details
                let tableHTML = document.getElementById('rdfDataStructuresTable');
                if (tableHTML !== null) {
                    tableHTML.innerHTML = "";
                }

                let gridJSData: { endpoint: string, measure: number }[] = [];
                endpointDataSerieMap.forEach((serieData, endpoint, map) => {
                    let endpointMeasureSum = serieData.map(a => Number.parseFloat(a[1])).reduce((previous, current) => current + previous);
                    let measureAverage = endpointMeasureSum / serieData.length;
                    let measureAverageRounded = Number.parseFloat(precise(measureAverage, 3));
                    gridJSData.push({ endpoint: endpoint, measure: measureAverageRounded });
                });
                let gridJSColumns = [
                    { id: "endpoint", name: "Endpoint", field: "endpoint", sortable: true },
                    {
                        id: "measure", name: "Measure", field: "measure", sortable: true, formatter: (cell, row) => {
                            return cell + "%";
                        }
                    }
                ];
                let gridJSTable = new gridjs.Grid({
                    columns: gridJSColumns,
                    data: gridJSData,
                    sort: true,
                    search: true,
                    pagination: {
                        limit: 10,
                        summary: false
                    }
                });
                let rdfDataStructuresTableElement = document.getElementById('rdfDataStructuresTable');
                if (rdfDataStructuresTableElement != null) {
                    gridJSTable.render(rdfDataStructuresTableElement);
                }
            } else {
                this.hide();
            }
        }
        return Promise.resolve().then(() => { this.filled = true; });
    },
    hideFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        let rdfDataStructuresMeasureElement = document.getElementById('rdfDataStructuresMeasure');
        if (rdfDataStructuresMeasureElement !== null) {
            rdfDataStructuresMeasureElement.innerHTML = "";
        }
        collapseHtml('rdfDataStructuresScatter');
        collapseHtml("rdfDataStructureMeasureRow");
    },
    showFunction: function () {
        unCollapseHtml('rdfDataStructuresScatter');
        unCollapseHtml("rdfDataStructureMeasureRow");
    },
    redrawFunction: function () {
        let rdfDataStructuresQueryCell = document.getElementById('rdfDataStructuresQueryCell');
        if (rdfDataStructuresQueryCell !== null) {
            rdfDataStructuresQueryCell.innerHTML = "";
            let codeElement = document.createElement('code');
            codeElement.innerText = this.query;
            rdfDataStructuresQueryCell.appendChild(codeElement);
        }
        let rdfDataStructuresScatterElement = document.getElementById('rdfDataStructuresScatter');
        if (rdfDataStructuresScatterElement !== null) {
            rdfDataStructuresScatterElement.style.width = getMainContentColWidth() + "px";
        }
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    }
});

export let readableLabelsChart = new KartoChart({
    chartObject: echarts.init(document.getElementById('readableLabelsScatter')),
    option: {},
    fillFunction: function () {
        if (!this.filled) {
            this.query = "SELECT DISTINCT ?g ?endpointUrl ?measure { " +
                "GRAPH ?g {" +
                "?endpoint <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . " +
                "?metadata <http://ns.inria.fr/kg/index#curated> ?endpoint . " +
                "?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode . " +
                "?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/readableLabels.ttl> . " +
                "?measureNode <http://www.w3.org/ns/dqv#value> ?measure . " +
                "} " +
                "} GROUP BY ?g ?endpointUrl ?measure ";
            let readableLabelsQueryCellElement = document.getElementById('readableLabelsQueryCell');
            if (readableLabelsQueryCellElement) {
                readableLabelsQueryCellElement.innerHTML = "";
                let codeElement = document.createElement('code')
                codeElement.innerText = this.query;
                readableLabelsQueryCellElement.append(codeElement)
            }

            let readableLabelDataTmp = Control.getInstance().readableLabelData()

            let graphSet = new Set(readableLabelDataTmp.map(a => a.graph))

            let endpointDataSerieMap = new Map();
            readableLabelDataTmp.forEach((readableLabelItem, i) => {
                if (endpointDataSerieMap.get(readableLabelItem.endpoint) == undefined) {
                    endpointDataSerieMap.set(readableLabelItem.endpoint, []);
                }
                endpointDataSerieMap.get(readableLabelItem.endpoint).push([readableLabelItem.date, precise(readableLabelItem.measure)]);
            });

            if (endpointDataSerieMap.size > 0) {
                this.show();

                // Chart
                this.option = Control.getInstance().retrieveFileFromVault(readableLabelsEchartsOptionFilename);
                this.redraw();

                // Average measure
                let readableLabelMeasureSum = readableLabelDataTmp.map(a => a.measure).reduce((previous, current) => current + previous);
                let readableLabelsAverageMeasure = readableLabelMeasureSum / readableLabelDataTmp.length;
                let readableLabelsMeasureElement = document.getElementById('readableLabelsMeasure');
                if (readableLabelsMeasureElement !== null) {
                    readableLabelsMeasureElement.innerText = precise(readableLabelsAverageMeasure, 3) + "%";
                }

                // Measire Details
                let tableHTML = document.getElementById('readableLabelsTable');
                if (tableHTML) {
                    tableHTML.innerHTML = "";
                }

                let gridJSData: { endpoint: string, measure: number }[] = [];
                endpointDataSerieMap.forEach((serieData, endpoint, map) => {
                    let endpointMeasureSum = serieData.map(a => Number.parseFloat(a[1])).reduce((previous, current) => current + previous);
                    let measureAverage = endpointMeasureSum / serieData.length;
                    let measureAverageRounded = Number.parseFloat(precise(measureAverage, 3));
                    gridJSData.push({ endpoint: endpoint, measure: measureAverageRounded });
                });
                let gridJSColumns = [
                    { id: "endpoint", name: "Endpoint", field: "endpoint", sortable: true },
                    {
                        id: "measure", name: "Measure", field: "measure", sortable: true, formatter: (cell, row) => {
                            return cell + "%";
                        }
                    }
                ];
                let gridJSTable = new gridjs.Grid({
                    columns: gridJSColumns,
                    data: gridJSData,
                    sort: true,
                    search: true,
                    pagination: {
                        limit: 10,
                        summary: false
                    }
                });
                let readableLabelsTableElement = document.getElementById('readableLabelsTable');
                if (readableLabelsTableElement != null) {
                    gridJSTable.render(readableLabelsTableElement);
                }
            } else {
                this.hide();
            }
        }
        return Promise.resolve().then(() => { this.filled = true; });
    }, hideFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        let readableLabelMeasureElement = document.getElementById('readableLabelMeasure');
        if (readableLabelMeasureElement) {
            readableLabelMeasureElement.innerHTML = "";
        }
        collapseHtml('readableLabelsMeasureRow');
        collapseHtml('readableLabelsScatter');
    },
    showFunction: function () {
        unCollapseHtml('readableLabelsScatter');
        unCollapseHtml('readableLabelsMeasureRow');
    },
    redrawFunction: function () {
        let readableLabelsQueryCell = document.getElementById('readableLabelsQueryCell');
        if (readableLabelsQueryCell !== null) {
            readableLabelsQueryCell.innerHTML = "";
            let codeElement = document.createElement('code');
            codeElement.innerText = this.query;
            readableLabelsQueryCell.append(codeElement);
        }
        let readableLabelsScatterElement = document.getElementById('readableLabelsScatter');
        if (readableLabelsScatterElement !== null) {
            readableLabelsScatterElement.style.width = getMainContentColWidth() + "px";
        }
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    }
});

export let blankNodesChart = new KartoChart({
    chartObject: echarts.init(document.getElementById('blankNodesScatter')),
    option: {},
    fillFunction: function () {
        if (!this.filled) {
            this.query = "SELECT DISTINCT ?g ?endpointUrl ?measure { " +
                "GRAPH ?g {" +
                "?endpoint <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . " +
                "?metadata <http://ns.inria.fr/kg/index#curated> ?endpoint . " +
                "?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode . " +
                "?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/blankNodeUsage.ttl> . " +
                "?measureNode <http://www.w3.org/ns/dqv#value> ?measure . " +
                "}" +
                " } " +
                "GROUP BY ?g ?endpointUrl ?measure ";
            let blankNodesQueryCellElement = document.getElementById("blankNodesQueryCell");
            if (blankNodesQueryCellElement) {
                blankNodesQueryCellElement.innerHTML = "";
                let codeElement = document.createElement('code');
                codeElement.innerText = this.query;
                blankNodesQueryCellElement.appendChild(codeElement);
            }

            let blankNodeDataTmp = Control.getInstance().blankNodesData()

            let endpointDataSerieMap = new Map();
            blankNodeDataTmp.forEach((blankNodeItem, i) => {
                if (endpointDataSerieMap.get(blankNodeItem.endpoint) == undefined) {
                    endpointDataSerieMap.set(blankNodeItem.endpoint, []);
                }
                endpointDataSerieMap.get(blankNodeItem.endpoint).push([blankNodeItem.date, precise(blankNodeItem.measure, 3)]);
            });

            if (endpointDataSerieMap.size > 0) {
                this.show();

                // Chart
                this.option = Control.getInstance().retrieveFileFromVault(blankNodesEchartsOptionFilename);
                this.redraw();

                // Average measure
                let blankNodeMeasureSum = blankNodeDataTmp.map(a => a.measure).reduce((previous, current) => current + previous);
                let blankNodesAverageMeasure = blankNodeMeasureSum / blankNodeDataTmp.length;

                let blankNodesMeasureElement = document.getElementById('blankNodesMeasure');
                if (blankNodesMeasureElement !== null) {
                    blankNodesMeasureElement.innerText = precise(blankNodesAverageMeasure, 3) + "%";
                }

                // Measire Details
                let tableHTMl = document.getElementById('blankNodesTable');
                if (tableHTMl) {
                    tableHTMl.innerHTML = "";
                }

                let gridJSData: { endpoint: string, measure: number }[] = [];
                endpointDataSerieMap.forEach((serieData, endpoint, map) => {
                    let endpointMeasureSum = serieData.map(a => Number.parseFloat(a[1])).reduce((previous, current) => current + previous);
                    let measureAverage = endpointMeasureSum / serieData.length;
                    let measureAverageRounded = Number.parseFloat(precise(measureAverage, 3));
                    gridJSData.push({ endpoint: endpoint, measure: measureAverageRounded });
                });
                let gridJSColumns = [
                    { id: "endpoint", name: "Endpoint", field: "endpoint", sortable: true },
                    {
                        id: "measure", name: "Measure", field: "measure", sortable: true, formatter: (cell, row) => {
                            return cell + "%";
                        }
                    }
                ];
                let gridJSTable = new gridjs.Grid({
                    columns: gridJSColumns,
                    data: gridJSData,
                    sort: true,
                    search: true,
                    pagination: {
                        limit: 10,
                        summary: false
                    }
                });
                let blankNodesTableElement = document.getElementById('blankNodesTable');
                if (blankNodesTableElement != null) {
                    gridJSTable.render(blankNodesTableElement);
                }
            } else {
                this.hide();
            }
        }
        return Promise.resolve().then(() => { this.filled = true; });
    },
    hideFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
        let blankNodeMeasureElement = document.getElementById("blankNodeMeasure");
        if (blankNodeMeasureElement) {
            blankNodeMeasureElement.innerHTML = "";
        }
        collapseHtml('blankNodesMeasureRow');
        collapseHtml('blankNodesScatter');
    },
    showFunction: function () {
        unCollapseHtml('blankNodesScatter');
        unCollapseHtml('blankNodesMeasureRow');
    },
    redrawFunction: function () {
        let blankNodesQueryCellElement = document.getElementById("blankNodesQueryCell");
        if (blankNodesQueryCellElement) {
            blankNodesQueryCellElement.innerHTML = "";
            let codeElement = document.createElement('code');
            codeElement.innerText = this.query;
            blankNodesQueryCellElement.appendChild(codeElement);
        }
        let blankNodesScatterElement = document.getElementById("blankNodesScatter");
        if (blankNodesScatterElement) {
            blankNodesScatterElement.style.width = getMainContentColWidth() + "px";
        }
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    }
});

export let standardVocabCharts = new KartoChart({
    chartObject: echarts.init(document.getElementById('standardVocabs')),
    option: {},
    fillFunction: function () {
        try {
            let option = Control.getInstance().retrieveFileFromVault(standardVocabulariesEndpointGraphEchartsOptionFilename);
            this.option = option;

            this.filled = true;

            this.redraw();
            return Promise.resolve();
        } catch (e) {
            console.error(e);
            return Promise.reject(e);
        } finally {
            return Promise.resolve();
        }
    },
    hideFunction: function () {
        collapseHtml('standardVocabs');
    },
    showFunction: function () {
        unCollapseHtml('standardVocabs')
        this.redraw()
    },
    redrawFunction: function () {
        let standardVocabsElement = document.getElementById('standardVocabs')
        if (standardVocabsElement) {
            standardVocabsElement.style.width = getMainContentColWidth() + "px";
        }
        this.chartObject.setOption(this.option, true);
        this.chartObject.resize();
    },
    clearFunction: function () {
        this.chartObject.setOption({ series: [] }, true);
    }
});