import * as DataCache from './DataCaching.js';
import * as Logger from './LogUtils.js';
import * as EChartsCache from './EChartsDataCaching.js';
import * as PlotlyCache from './PlotlyDataCaching.js';


Promise.allSettled([
    // DataCache.allVocabFill().then(() =>
    //     Promise.allSettled([
    //         EChartsCache.endpointVocabsGraphEchartsOption(),
    //         EChartsCache.endpointKeywordsGraphEchartsOption(),
    //         EChartsCache.endpointStandardVocabulariesGraphEchartsOption()
    //     ])
    // ),
    // DataCache.endpointMapfill(),

    // DataCache.tripleDataFill().then(() =>
    //         PlotlyCache.triplesEchartsOption()
    // ),
    DataCache.SPARQLCoverageFill().then(() =>
        PlotlyCache.sparqlCoverageEchartsOption()
    ),
    // DataCache.classDataFill().then(() =>
    //     EChartsCache.classesEchartsOption()
    // ),
    // DataCache.propertyDataFill().then(() =>
    //     EChartsCache.propertiesEchartsOption()
    // ),
    // DataCache.shortUrisDataFill().then(() =>
    //     EChartsCache.shortUrisEchartsOption()
    // ),
    // DataCache.rdfDataStructureDataFill().then(() =>
    //     EChartsCache.rdfDataStructuresEchartsOption()
    // ),
    // DataCache.readableLabelsDataFill().then(() =>
    //     EChartsCache.readableLabelsEchartsOption()
    // ),
    // DataCache.blankNodeDataFill().then(() =>
    //     EChartsCache.blankNodesEchartsOption()
    // ),
    // DataCache.datasetDescriptionDataFill().then(() =>
    //     EChartsCache.datasetDescriptionEchartsOption()
    // ),

    // DataCache.classAndPropertiesDataFill(runsetObject), // Pas de charts et très long

    // DataCache.totalRuntimeDataFill(runsetObject), // A supprimer du site
    // DataCache.averageRuntimeDataFill(), // A supprimer du site
    // DataCache.categoryTestCountFill(), // A supprimer du site // Pas OK
    // DataCache.totalCategoryTestCountFill(), // A supprimer du site // Pas OK
    // DataCache.endpointTestsDataFill(), // A supprimer du site
])
    .catch(error => {
        Logger.error(error)
    });