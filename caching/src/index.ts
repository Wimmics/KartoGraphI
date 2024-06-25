import * as DataCache from './DataCaching.js';
import * as Logger from './LogUtils.js';
import * as PlotlyCache from './PlotlyDataCaching.js';


Promise.allSettled([
    // DataCache.allVocabFill(),
    // DataCache.endpointMapfill(),

    // DataCache.tripleDataFill().then(() =>
    //         PlotlyCache.triplesChartOption()
    // ),
    // DataCache.SPARQLCoverageFill().then(() =>
    //     PlotlyCache.sparqlCoverageChartOption()
    // ),
    // DataCache.serverHeadersFill().then(() => 
    //     PlotlyCache.endpointServerChartOption()
    // ),
    // DataCache.classDataFill().then(() =>
    //     PlotlyCache.classesChartOption()
    // ),
    // DataCache.propertyDataFill().then(() =>
    //     PlotlyCache.propertiesChartOption()
    // ),
    // DataCache.shortUrisDataFill().then(() =>
    //     PlotlyCache.shortUrisChartOption()
    // ),
    // DataCache.rdfDataStructureDataFill().then(() =>
    //     PlotlyCache.rdfDataStructuresChartOption()
    // ),
    // DataCache.readableLabelsDataFill().then(() =>
    //     PlotlyCache.readableLabelsChartOption()
    // ),
    // DataCache.blankNodeDataFill().then(() =>
    //     PlotlyCache.blankNodesChartOption()
    // ),
    DataCache.endpointLanguagesDataFill().then(() =>
        PlotlyCache.endpointLanguagesChartOption()
    ),
    // DataCache.datasetDescriptionDataFill().then(() =>
    //     EChartsCache.datasetDescriptionEchartsOption()
    // ),
])
    .catch(error => {
        Logger.error(error)
    });