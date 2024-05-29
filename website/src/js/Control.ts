import $ from 'jquery';
import url from 'url';
import * as Datatype from "./Datatypes";
import { setButtonAsToggleCollapse } from "./ViewUtils";
import { cachePromise, xhrJSONPromise } from "./DataConnexion";
import { KartoChart } from './ViewClasses';
import { blankNodesChart, blankNodesEchartsOptionFilename, classAndPropertiesContent, classNumberChart, classesEchartsOptionFilename, datasetDescriptionEchartsOptionFilename, descriptionElementChart, endpointVocabsChart, geolocChart, keywordEndpointEchartsOptionFilename, propertiesEchartsOptionFilename, propertyNumberChart, rdfDataStructureChart, rdfDataStructuresEchartsOptionFilename, readableLabelsChart, readableLabelsEchartsOptionFilename, shortUriChart, shortUrisEchartsOptionFilename, sparql10Chart, sparql10CoverageEchartsOptionFilename, sparql11Chart, sparql11CoverageEchartsOptionFilename, sparqlCoverCharts, sparqlCoverageEchartsOptionFilename, sparqlFeaturesContent, standardVocabCharts, standardVocabulariesEndpointGraphEchartsOptionFilename, tripleChart, triplesEchartsOptionFilename, vocabEndpointEchartsOptionFilename, vocabKeywordChart } from './Charts';

// Cached files
const geolocDataFilename = 'geolocData';
const sparqlCoverCountFilename = 'sparqlCoverageData'
const sparqlFeaturesDataFilename = 'sparqlFeaturesData'
const vocabEndpointDataFilename = 'vocabEndpointData'
const endpointKeywordDataFilename = 'endpointKeywordsData'
const classCountDataFilename = 'classCountData'
const propertyCountDataFilename = 'propertyCountData'
const tripleCountDataFilename = 'tripleCountData'
const classPropertyDataFilename = "classPropertyData";
const datasetDescriptionDataFilename = "datasetDescriptionData";
const shortUriDataFilename = "shortUriData";
const rdfDataStructureDataFilename = "rdfDataStructureData";
const readableLabelDataFilename = "readableLabelData";
const blankNodesDataFilename = "blankNodesData";

const textElementsFile = xhrJSONPromise("https://raw.githubusercontent.com/Wimmics/dekalog/master/LODMap/src/data/cache/textElements.json");
const sparqlFeatureDescFile = cachePromise("SPARQLFeatureDescriptions.json");

export class Control {

    static ControlInstance: Control;

    geolocData(): Array<Datatype.GeolocDataObject> {
        return this.retrieveFileFromVault(geolocDataFilename) as Array<Datatype.GeolocDataObject>;
    };
    sparqlCoverCountData(): Array<Datatype.SPARQLCoverageDataObject> {
        return this.retrieveFileFromVault(sparqlCoverCountFilename) as Array<Datatype.SPARQLCoverageDataObject>;
    };
    sparqlFeaturesData(): Array<Datatype.SPARQLFeatureDataObject> {
        return this.retrieveFileFromVault(sparqlFeaturesDataFilename) as Array<Datatype.SPARQLFeatureDataObject>;
    };
    vocabEndpointData(): Array<Datatype.VocabEndpointDataObject> {
        return this.retrieveFileFromVault(vocabEndpointDataFilename) as Array<Datatype.VocabEndpointDataObject>;
    };
    endpointKeywordData(): Array<Datatype.VocabKeywordsDataObject> {
        return this.retrieveFileFromVault(endpointKeywordDataFilename) as Array<Datatype.VocabKeywordsDataObject>;
    };
    classCountData(): Array<Datatype.ClassCountDataObject> {
        return this.retrieveFileFromVault(classCountDataFilename) as Array<Datatype.ClassCountDataObject>;
    };
    propertyCountData(): Array<Datatype.PropertyCountDataObject> {
        return this.retrieveFileFromVault(propertyCountDataFilename) as Array<Datatype.PropertyCountDataObject>;
    };
    tripleCountData(): Array<Datatype.TripleCountDataObject> {
        return this.retrieveFileFromVault(tripleCountDataFilename) as Array<Datatype.TripleCountDataObject>;
    };
    classPropertyData(): Array<Datatype.ClassPropertyDataObject> {
        return this.retrieveFileFromVault(classPropertyDataFilename) as Array<Datatype.ClassPropertyDataObject>;
    };
    datasetDescriptionData(): Array<Datatype.DatasetDescriptionDataObject> {
        return this.retrieveFileFromVault(datasetDescriptionDataFilename) as Array<Datatype.DatasetDescriptionDataObject>;
    };
    shortUriData(): Array<Datatype.ShortUriDataObject> {
        return this.retrieveFileFromVault(shortUriDataFilename) as Array<Datatype.ShortUriDataObject>;
    };
    rdfDataStructureData(): Array<Datatype.QualityMeasureDataObject> {
        return this.retrieveFileFromVault(rdfDataStructureDataFilename) as Array<Datatype.QualityMeasureDataObject>;
    };
    readableLabelData(): Array<Datatype.QualityMeasureDataObject> {
        return this.retrieveFileFromVault(readableLabelDataFilename) as Array<Datatype.QualityMeasureDataObject>;
    };
    blankNodesData(): Array<Datatype.QualityMeasureDataObject> {
        return this.retrieveFileFromVault(blankNodesDataFilename) as Array<Datatype.QualityMeasureDataObject>;
    };
    textElements: Array<Datatype.TextElement>;
    runsets: Array<Datatype.RunsetObject>;
    sparqlFeatureDesc: Array<Datatype.SPARQLFeatureDescriptionDataObject>;

    graphList: string[] = [];
    currentRunsetId = "all";
    runsetIndexParameter = "graphSetIndex";
    endpointList: string[] = [];

    tabContentMap = new Map();


    geolocContent: KartoChart[] = [
        geolocChart
    ];
    sparqlCoverContent: KartoChart[] = [sparqlCoverCharts, sparql10Chart, sparql11Chart, sparqlFeaturesContent]
    vocabRelatedContent: KartoChart[] = [vocabKeywordChart, endpointVocabsChart, standardVocabCharts];
    datasetDescriptionContent: KartoChart[] = [descriptionElementChart];
    dataQualityContent: KartoChart[] = [blankNodesChart, readableLabelsChart, rdfDataStructureChart, shortUriChart];
    datasetPopulationsContent: KartoChart[] = [tripleChart, classNumberChart, propertyNumberChart, classAndPropertiesContent];
    allContent: KartoChart[] = this.geolocContent.concat(this.sparqlCoverContent)
        .concat(this.datasetDescriptionContent)
        .concat(this.dataQualityContent)
        .concat(this.datasetPopulationsContent)
        .concat(this.vocabRelatedContent);

    // Contains the files for each component (key: filename, value: fileContent)
    fileBank: Map<string, Datatype.JSONValue> = new Map();



    // Setup tab menu
    vocabRelatedContentTabButton: JQuery<HTMLElement>;
    sparqlTabButton: JQuery<HTMLElement>;
    populationTabButton: JQuery<HTMLElement>;
    descriptionTabButton: JQuery<HTMLElement>;
    runtimeTabButton: JQuery<HTMLElement>;
    qualityTabButton: JQuery<HTMLElement>;
    tabButtonArray: JQuery<HTMLElement>[];

    constructor() {
        if (Control.ControlInstance !== undefined) {
            throw new Error("Control already instantiated");
        }
        console.log("Control constructor");

        // Setup tab menu
        this.vocabRelatedContentTabButton = $('#vocabRelatedContent-tab')
        this.sparqlTabButton = $('#sparql-tab')
        this.populationTabButton = $('#population-tab')
        this.descriptionTabButton = $('#description-tab')
        this.runtimeTabButton = $('#runtime-tab')
        this.qualityTabButton = $('#quality-tab')
        this.tabButtonArray = [this.vocabRelatedContentTabButton, this.sparqlTabButton, this.populationTabButton, this.descriptionTabButton, this.runtimeTabButton, this.qualityTabButton];

        setButtonAsToggleCollapse('endpointGeolocDetails', 'endpointGeolocDatatable');
        setButtonAsToggleCollapse('tableSPARQLFeaturesDetails', 'SPARQLFeaturesDatatable');
        setButtonAsToggleCollapse('tableSPARQLFeaturesStatsDetails', 'SPARQLFeaturesCountDatatable');
        setButtonAsToggleCollapse('KnownVocabulariesDetails', 'knowVocabEndpointDatatable');
        setButtonAsToggleCollapse('endpointKeywordsDetails', 'endpointKeywordsDatatable');
        setButtonAsToggleCollapse('tableRuleDetails', 'rulesDatatable');
        setButtonAsToggleCollapse('classDescriptionDetails', 'classDescriptionDatatable');
        setButtonAsToggleCollapse('classPropertiesDescriptionDetails', 'classPropertiesDescriptionDatatable');
        setButtonAsToggleCollapse('datasetDescriptionStatDetails', 'datasetDescriptionDatatable');
        setButtonAsToggleCollapse('shortUrisDetails', 'shortUrisDatatable');
        setButtonAsToggleCollapse('rdfDataStructuresDetails', 'rdfDataStructuresDatatable');
        setButtonAsToggleCollapse('readableLabelsDetails', 'readableLabelsDatatable');
        setButtonAsToggleCollapse('blankNodesDetails', 'blankNodesDatatable');

        this.tabContentMap.set('vocabRelatedContent', this.vocabRelatedContent);
        this.tabContentMap.set('sparql', this.sparqlCoverContent);
        this.tabContentMap.set('population', this.datasetPopulationsContent);
        this.tabContentMap.set('description', this.datasetDescriptionContent);
        this.tabContentMap.set('quality', this.dataQualityContent);

        this.vocabRelatedContentTabButton.on('click', function (event) {
            Control.getInstance().changeActiveTab("vocabRelatedContent");
        })
        this.sparqlTabButton.on('click', function (event) {
            Control.getInstance().changeActiveTab("sparql");
        })
        this.populationTabButton.on('click', function (event) {
            Control.getInstance().changeActiveTab("population");
        })
        this.descriptionTabButton.on('click', function (event) {
            Control.getInstance().changeActiveTab("description");
        })
        this.qualityTabButton.on('click', function (event) {
            Control.getInstance().changeActiveTab("quality");
        })

        $(window).on('resize', () => {
            this.redrawCharts();
        })

        Control.ControlInstance = this;
    }

    init() {
        console.log("Initialization START");
        console.log("File loading started");
        return this.loadDataFiles().then(() => {


            console.log("File loading finished");

            console.log("setting up the runset ID in the URL")
            let urlParams = new URLSearchParams(url.search);
            // Set up graphs sets
            // TODO: without runset

            console.log("Initialization END");
            return Promise.resolve();

        })
    }

    static getInstance() {
        if (Control.ControlInstance == null) {
            Control.ControlInstance = new Control();
        }
        return Control.ControlInstance;
    }

    static getCacheFileForRunset(filename, runsetObject: Datatype.RunsetObject) {
        return cachePromise(filename + "." + runsetObject.id + '.json');
    }

    retrieveFileFromVault(filename: string, ): Datatype.JSONValue {
        console.log("Retrieving file " + filename )
            const fileFromVault = this.fileBank.get(filename);
            if (fileFromVault !== undefined) {
                return fileFromVault;
            } else {
                throw new Error("File " + filename + " not found in the bank");
            }
    }

    insertTextElements() {
        // adding the HTML text where it belong
        this.textElements.forEach(item => {
            $('#' + item.key).html(item.value.replace('\"', '"'));
        });
    }

    loadDataFiles() {
        this.showLoadingSpinner()

        let filenameList = [
            geolocDataFilename,
            sparqlCoverCountFilename,
            sparqlFeaturesDataFilename,
            vocabEndpointDataFilename,
            endpointKeywordDataFilename,
            classCountDataFilename,
            propertyCountDataFilename,
            tripleCountDataFilename,
            classPropertyDataFilename,
            datasetDescriptionDataFilename,
            shortUriDataFilename,
            rdfDataStructureDataFilename,
            readableLabelDataFilename,
            blankNodesDataFilename,

            // Echarts options
            sparqlCoverageEchartsOptionFilename,
            sparql10CoverageEchartsOptionFilename,
            sparql11CoverageEchartsOptionFilename,
            vocabEndpointEchartsOptionFilename,
            triplesEchartsOptionFilename,
            classesEchartsOptionFilename,
            propertiesEchartsOptionFilename,
            shortUrisEchartsOptionFilename,
            rdfDataStructuresEchartsOptionFilename,
            readableLabelsEchartsOptionFilename,
            blankNodesEchartsOptionFilename,
            datasetDescriptionEchartsOptionFilename,
            keywordEndpointEchartsOptionFilename,
            standardVocabulariesEndpointGraphEchartsOptionFilename
        ];

        // Loading all the data files into the bank
        return textElementsFile.then((data) => {
            this.textElements = (data as Array<Datatype.TextElement>);
            this.insertTextElements();
            return Promise.resolve();
        }).then(() => {
            return sparqlFeatureDescFile.then((data) => {
                this.sparqlFeatureDesc = (data as Array<Datatype.SPARQLFeatureDescriptionDataObject>);
                return Promise.resolve();
            })
        }).then(() => {
            let fileRetrivalPromiseArray = filenameList.map(filename => {
                return cachePromise(filename + ".json").then(jsonContent => {
                    this.fileBank.set(filename, jsonContent);
                    return ;
                });
            })
            return Promise.allSettled(fileRetrivalPromiseArray)
        })
        .then(() => {
            this.hideLoadingSpinner();
            return;
        })
    }

    changeActiveTab(tabName) {
        $("div .tab-pane").each((i, element) => {
            $(element).addClass('collapse')
            $(element).removeClass('show')
            $(element).removeClass('active')
        });
        $('.nav-link').each((i, element) => {
            $(element).removeClass('active')
        });
        this.showLoadingSpinner();
        let content = this.tabContentMap.get(tabName);
        return Promise.allSettled(content.map(item => item.fill()))
            .then(() => {
                content.forEach(contentChart => contentChart.redraw());
                content.forEach(contentChart => contentChart.show());
            })
            .then(() => {
                this.hideLoadingSpinner()
            }).then(() => {
                $('#' + tabName).addClass("active");
                $('#' + tabName).addClass("show");
                $('#' + tabName).removeClass("collapse");
                $('#' + tabName + "-tab").addClass("active");
            })
    }

    refresh() {
        this.showLoadingSpinner();
        this.clear();
        this.allContent.forEach(contentChart => { contentChart.filled = false; })
        return Promise.allSettled(this.allContent.map(content => content.fill())).then(() => { this.hideLoadingSpinner() });
    }

    clear() {
        this.allContent.forEach(content => { content.clear() });
    }

    redrawCharts() {
        return Promise.all(this.allContent.map(content => { content.redraw() }));
    }

    generateGraphValueFilterClause(runset: Datatype.RunsetObject) {
        let result = "FILTER( ";
        runset.graphs.forEach((item, i) => {
            if (i > 0) {
                result += " || REGEX( str(?g) , '" + item + "' )";
            } else {
                result += "REGEX( str(?g) , '" + item + "' )";
            }
        });
        result += " )";
        return result;
    }

    changeGraphSetIndex(index) {
        console.log("changeGraphSetIndex", index);

        let urlParams = new URLSearchParams(window.location.search);
        urlParams.delete(this.runsetIndexParameter);
        urlParams.append(this.runsetIndexParameter, index);
        history.pushState(null, "", '?' + urlParams.toString());
        let indexRunset = this.runsets.find(runsetObject => runsetObject.id === index);
        if (indexRunset !== undefined) {
            let historyGraphList = indexRunset?.graphs;
            this.graphList = historyGraphList;
        } else {
            throw new Error("Graph set with id '" + index + "' not found");
        }
        return this.refresh();
    }



    hideLoadingSpinner() {
        this.tabButtonArray.forEach(item => {
            item.prop('disabled', false);
        })

        $('#loadingSpinner').addClass('collapse');
        $('#loadingSpinner').removeClass('show');
        $('#tabContent').addClass('visible');
        $('#tabContent').removeClass('invisible');
    }

    showLoadingSpinner() {
        this.tabButtonArray.forEach(item => {
            item.prop('disabled', true);
        })
        $('#loadingSpinner').addClass('show');
        $('#loadingSpinner').removeClass('collapse');
        $('#tabContent').addClass('invisible');
        $('#tabContent').removeClass('visible');
    }
}