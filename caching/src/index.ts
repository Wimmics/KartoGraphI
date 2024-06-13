import * as DataCache from './DataCaching.js';
import * as Logger from './LogUtils.js';
import * as PlotlyCache from './PlotlyDataCaching.js';


Promise.allSettled([
    DataCache.allVocabFill(),
    // DataCache.endpointMapfill(),

    DataCache.tripleDataFill().then(() =>
            PlotlyCache.triplesChartOption()
    ),
    // DataCache.SPARQLCoverageFill().then(() =>
    //     PlotlyCache.sparqlCoverageChartOption()
    // ),
    DataCache.serverHeadersFill().then(() => 
        PlotlyCache.endpointServerChartOption()
    ),
    DataCache.classDataFill().then(() =>
        PlotlyCache.classesChartOption()
    ),
    DataCache.propertyDataFill().then(() =>
        PlotlyCache.propertiesChartOption()
    ),
    DataCache.shortUrisDataFill().then(() =>
        PlotlyCache.shortUrisChartOption()
    ),
    // DataCache.rdfDataStructureDataFill().then(() =>
    //     EChartsCache.rdfDataStructuresEchartsOption()
    // ),
    DataCache.readableLabelsDataFill().then(() =>
        PlotlyCache.readableLabelsChartOption()
    ),
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