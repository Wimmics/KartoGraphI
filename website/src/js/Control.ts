import url from 'url';
import * as Datatype from "./Datatypes";
import { setButtonAsToggleCollapse } from "./ViewUtils";
import { cachePromise, xhrJSONPromise } from "./DataConnexion";
import { KartoChart } from './ViewClasses';

export const sparqlCoverageEchartsOptionFilename = "sparqlCoverageEchartsOption.json";
export const sparql10CoverageEchartsOptionFilename = "sparql10CoverageEchartsOption.json";
export const sparql11CoverageEchartsOptionFilename = "sparql11CoverageEchartsOption.json";
export const vocabEndpointEchartsOptionFilename = "vocabEndpointEchartsOption.json";
export const triplesEchartsOptionFilename = "triplesEchartOption.json";
export const classesEchartsOptionFilename = "classesEchartOption.json";
export const propertiesEchartsOptionFilename = "propertiesEchartOption.json";
export const shortUrisEchartsOptionFilename = "shortUrisEchartOption.json";
export const rdfDataStructuresEchartsOptionFilename = "rdfDataStructuresEchartOption.json";
export const readableLabelsEchartsOptionFilename = "readableLabelsEchartOption.json";
export const blankNodesEchartsOptionFilename = "blankNodesEchartOption.json";
export const datasetDescriptionEchartsOptionFilename = "datasetDescriptionEchartOption.json";
export const totalRuntimeEchartsOptionFilename = "totalRuntimeEchartsOption.json";
export const keywordEndpointEchartsOptionFilename = "keywordEndpointEchartsOption.json";
export const standardVocabulariesEndpointGraphEchartsOptionFilename = "standardVocabulariesEndpointGraphEchartsOption.json";

// Cached files
export const geolocDataFilename = 'geolocData.json';
export const sparqlCoverCountFilename = 'sparqlCoverageData.json'
export const sparqlFeaturesDataFilename = 'sparqlFeaturesData.json'
export const vocabEndpointDataFilename = 'vocabEndpointData.json'
export const endpointKeywordDataFilename = 'endpointKeywordsData.json'
export const classCountDataFilename = 'classCountData.json'
export const propertyCountDataFilename = 'propertyCountData.json'
export const tripleCountDataFilename = 'tripleCountData.json'
export const classPropertyDataFilename = "classPropertyData.json";
export const datasetDescriptionDataFilename = "datasetDescriptionData.json";
export const shortUriDataFilename = "shortUriData.json";
export const rdfDataStructureDataFilename = "rdfDataStructureData.json";
export const readableLabelDataFilename = "readableLabelData.json";
export const blankNodesDataFilename = "blankNodesData.json";

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
    sparqlFeatureDesc: Array<Datatype.SPARQLFeatureDescriptionDataObject>;

    // geolocContent: KartoChart[] = [
    //     geolocChart
    // ];
    // sparqlCoverContent: KartoChart[] = [sparqlCoverCharts, sparql10Chart, sparql11Chart, sparqlFeaturesContent]
    // vocabRelatedContent: KartoChart[] = [vocabKeywordChart, endpointVocabsChart, standardVocabCharts];
    // datasetDescriptionContent: KartoChart[] = [descriptionElementChart];
    // dataQualityContent: KartoChart[] = [blankNodesChart, readableLabelsChart, rdfDataStructureChart, shortUriChart];
    // datasetPopulationsContent: KartoChart[] = [tripleChart, classNumberChart, propertyNumberChart, classAndPropertiesContent];
    // allContent: KartoChart[] = this.geolocContent//.concat(this.sparqlCoverContent)
    //     // .concat(this.datasetDescriptionContent)
    //     // .concat(this.dataQualityContent)
    //     // .concat(this.datasetPopulationsContent)
    //     .concat(this.vocabRelatedContent);

    // Contains the files for each component (key: filename, value: fileContent)
    fileBank: Map<string, Datatype.JSONValue> = new Map();

    constructor() {
        if (Control.ControlInstance !== undefined) {
            throw new Error("Control already instantiated");
        }
        console.log("Control constructor");
        Control.ControlInstance = this;
    }

    init() {
        return this.loadDataFiles();
    }

    static getInstance() {
        if (Control.ControlInstance == null) {
            Control.ControlInstance = new Control();
        }
        return Control.ControlInstance;
    }

    static getCacheFile(filename: string) {
        return cachePromise(filename);
    }

    retrieveFileFromVault(filename: string): Datatype.JSONValue {
        console.log("Retrieving file " + filename)
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
            let itemElement = document.getElementById('#' + item.key);
            if (itemElement != null) {
                itemElement.innerHTML = item.value.replace('\"', '"');
            }
        });
    }

    loadDataFiles() {
        this.showLoadingSpinner()

        let filenameList = [
            geolocDataFilename,
            vocabEndpointDataFilename,
            endpointKeywordDataFilename,
            tripleCountDataFilename,
            // classCountDataFilename,
            // classPropertyDataFilename,
            // propertyCountDataFilename,
            // sparqlCoverCountFilename,
            // sparqlFeaturesDataFilename,
            // datasetDescriptionDataFilename,
            // shortUriDataFilename,
            // rdfDataStructureDataFilename,
            // readableLabelDataFilename,
            // blankNodesDataFilename,

            // // Echarts options
            vocabEndpointEchartsOptionFilename,
            keywordEndpointEchartsOptionFilename,
            standardVocabulariesEndpointGraphEchartsOptionFilename,
            triplesEchartsOptionFilename,
            // classesEchartsOptionFilename,
            // propertiesEchartsOptionFilename,
            // sparqlCoverageEchartsOptionFilename,
            // sparql10CoverageEchartsOptionFilename,
            // sparql11CoverageEchartsOptionFilename,
            // shortUrisEchartsOptionFilename,
            // rdfDataStructuresEchartsOptionFilename,
            // readableLabelsEchartsOptionFilename,
            // blankNodesEchartsOptionFilename,
            // datasetDescriptionEchartsOptionFilename,
        ];

        let fileRetrievalPromiseArray = filenameList.map(filename => cachePromise(filename)
            .then(jsonContent => {
                console.log(filename, "retrieved")
                this.fileBank.set(filename, jsonContent);
                return;
            })
        );

        // Loading all the data files into the bank
        return Promise.allSettled(fileRetrievalPromiseArray)
            .then(() => textElementsFile)
            .then((data) => {
                this.textElements = (data as Array<Datatype.TextElement>);
                this.insertTextElements();
                return;
            })
            .then(() => {
                return sparqlFeatureDescFile.then((data) => {
                    this.sparqlFeatureDesc = (data as Array<Datatype.SPARQLFeatureDescriptionDataObject>);
                    this.hideLoadingSpinner();
                    return;
                })
            })
    }

    hideLoadingSpinner() {

        document.getElementById('loadingSpinner')?.classList.replace('collapse', 'show');
        document.getElementById('tabContent')?.classList.replace('visible', 'invisible');
    }

    showLoadingSpinner() {
        document.getElementById('loadingSpinner')?.classList.replace('show', 'collapse');
        document.getElementById('tabContent')?.classList.replace('invisible', 'visible');
    }
}