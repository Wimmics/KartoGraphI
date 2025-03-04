import * as Datatype from "./Datatypes";
import { cachePromise, xhrJSONPromise } from "./DataConnexion";

// export const vocabEndpointEchartsPlotlyDataFilename = "vocabEndpointPlotlyData.json";
// export const keywordEndpointEchartsPlotlyDataFilename = "keywordEndpointPlotlyData.json";
// export const standardVocabulariesEndpointGraphEchartsPlotlyDataFilename = "standardVocabulariesEndpointGraphPlotlyData.json";
export const sparqlCoveragePlotlyDataFilename = "sparqlCoveragePlotlyData.json";
export const sparql10CoveragePlotlyDataFilename = "sparql10CoveragePlotlyData.json";
export const sparql11CoveragePlotlyDataFilename = "sparql11CoveragePlotlyData.json";
export const triplesPlotlyDataFilename = "triplesPlotlyData.json";
export const classesPlotlyDataFilename = "classesPlotlyData.json";
export const propertiesPlotlyDataFilename = "propertiesPlotlyData.json";
export const shortUrisPlotlyDataFilename = "shortUrisPlotlyData.json";
export const rdfDataStructuresPlotlyDataFilename = "rdfDataStructuresPlotlyData.json";
export const readableLabelsPlotlyDataFilename = "readableLabelsPlotlyData.json";
export const blankNodesPlotlyDataFilename = "blankNodesPlotlyData.json";
export const datasetDescriptionPlotlyDataFilename = "datasetDescriptionPlotlyData.json";
export const totalRuntimePlotlyDataFilename = "totalRuntimePlotlyData.json";
export const endpointServerPlotlyDataFilename = "endpointServerChartPlotlyData.json"
export const endpointLanguagesPlotlyDataFilename = "endpointLanguagesPlotlyData.json"
export const fairnessChartPlotlyDataFilename = "fairnessChartPlotlyData.json"

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
export const endpointServerDataFilename = "endpointServerData.json";
export const languageListDataFilename = "languagesData.json";
export const fairnessDataFilename = "fairnessData.json";

const sparqlFeatureDescFile = cachePromise("SPARQLFeatureDescriptions.json");

export class Control {

    static ControlInstance: Control;
    textElements: Array<Datatype.TextElement>;
    sparqlFeatureDesc: Array<Datatype.SPARQLFeatureDescriptionDataObject>;
    vocabularyPrefixes: Map<string, string> = new Map<string, string>();

    constructor() {
        if (Control.ControlInstance !== undefined) {
            throw new Error("Control already instantiated");
        }
        console.log("Control constructor");
        Control.ControlInstance = this;
    }

    init() {
        return this.loadDataFiles().then(() => this.loadPrefixes());
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

        // Loading all the data files into the bank
        return sparqlFeatureDescFile.then((data) => {
            this.sparqlFeatureDesc = (data as Array<Datatype.SPARQLFeatureDescriptionDataObject>);
            this.hideLoadingSpinner();
            return;
        }).catch(error => {
            console.error("Error loading data files", error);
            return;
        });
    }

    loadPrefixes(): Promise<void> {
        console.log("Loading prefixes")
        if (this.vocabularyPrefixes.size == 0) {
            return xhrJSONPromise("https://prefix.cc/context").then(rawJsonLDPrefixDeclaration => {
                let jsonLDPrefixDeclaration = (rawJsonLDPrefixDeclaration as Datatype.JSONObject)["@context"];
                for (let key in jsonLDPrefixDeclaration as Datatype.JSONObject) {
                    this.vocabularyPrefixes.set(jsonLDPrefixDeclaration[key], key);
                }
                console.log("Prefixes loaded")
                return;
            }).catch(error => {
                console.error("Error loading prefixes", error);
                return;
            })
        } else {
            console.log("Prefixes already loaded")
            return Promise.resolve();
        }
    }

    getPrefixes(): Map<string, string> {
        return this.vocabularyPrefixes;
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