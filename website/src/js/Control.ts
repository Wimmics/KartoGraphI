import * as Datatype from "./Datatypes";
import { cachePromise, xhrJSONPromise } from "./DataConnexion";

// export const vocabEndpointEchartsOptionFilename = "vocabEndpointOption.json";
// export const keywordEndpointEchartsOptionFilename = "keywordEndpointOption.json";
// export const standardVocabulariesEndpointGraphEchartsOptionFilename = "standardVocabulariesEndpointGraphOption.json";
export const sparqlCoverageOptionFilename = "sparqlCoverageOption.json";
export const sparql10CoverageOptionFilename = "sparql10CoverageOption.json";
export const sparql11CoverageOptionFilename = "sparql11CoverageOption.json";
export const triplesOptionFilename = "triplesOption.json";
export const classesOptionFilename = "classesOption.json";
export const propertiesOptionFilename = "propertiesOption.json";
export const shortUrisOptionFilename = "shortUrisOption.json";
export const rdfDataStructuresOptionFilename = "rdfDataStructuresOption.json";
export const readableLabelsOptionFilename = "readableLabelsOption.json";
export const blankNodesOptionFilename = "blankNodesOption.json";
export const datasetDescriptionOptionFilename = "datasetDescriptionOption.json";
export const totalRuntimeOptionFilename = "totalRuntimeOption.json";

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
    textElements: Array<Datatype.TextElement>;
    sparqlFeatureDesc: Array<Datatype.SPARQLFeatureDescriptionDataObject>;
    
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
            sparqlCoverCountFilename,
            sparqlFeaturesDataFilename,
            // datasetDescriptionDataFilename,
            // shortUriDataFilename,
            // rdfDataStructureDataFilename,
            // readableLabelDataFilename,
            // blankNodesDataFilename,

            // // Echarts options
            // vocabEndpointEchartsOptionFilename,
            // keywordEndpointEchartsOptionFilename,
            // standardVocabulariesEndpointGraphEchartsOptionFilename,
            triplesOptionFilename,
            // classesEchartsOptionFilename,
            // propertiesEchartsOptionFilename,
            sparqlCoverageOptionFilename,
            // shortUrisEchartsOptionFilename,
            // rdfDataStructuresEchartsOptionFilename,
            // readableLabelsEchartsOptionFilename,
            // blankNodesEchartsOptionFilename,
            // datasetDescriptionEchartsOptionFilename,
        ];

        // Loading all the data files into the bank
        return textElementsFile
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