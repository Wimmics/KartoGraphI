import { JSONObject } from "./DataTypes.js";
import * as echarts from "echarts"

// echarts.GraphEdgeItemOption is not reachable, so we redefine a basic type for Graph links in a Graph chart
export type EchartsGraphLink = {
    source: string,
    target: string
};

// echarts.GraphNodeItemOption is not reachable, so we redefine a basic type for Graph nodes in a Graph chart
export type EchartsGraphNode = {
    name: string,
    category: string,
    symbolSize: number
}

export function getForceGraphOption(title: string, categoryArray: string[], dataNodes: EchartsGraphNode[], dataLinks: EchartsGraphLink[]): echarts.EChartsOption {
    let serieCategories: JSONObject[] = [];
    categoryArray.forEach((item, i) => {
        serieCategories.push({ name: item });
    });
    return {
        title: {
            text: title,
            top: 'top',
            left: 'center'
        },
        tooltip: {
            show: true,
            confine: true,
        },
        legend: {
            data: categoryArray,
            top: 'bottom',
        },
        series: [
            {
                type: 'graph',
                layout: 'force',
                data: dataNodes,
                links: dataLinks,
                categories: serieCategories,
                roam: true,
                draggable: true,
                label: {
                    show: false
                },
                force: {
                    repulsion: 50
                }
            }
        ]
    };
}

export function getCircularGraphOption(title: string, categoryArray: string[], dataNodes: EchartsGraphNode[], dataLinks: EchartsGraphLink[]): echarts.EChartsOption {
    let serieCategory: JSONObject[] = [];
    categoryArray.forEach((item, i) => {
        serieCategory.push({ name: item });
    });
    return {
        title: {
            text: title,
            top: 'top',
            left: 'center'
        },
        tooltip: {
            show: true,
            confine: true,
        },
        legend: {
            data: categoryArray,
            top: 'bottom',
        },
        series: [
            {
                type: 'graph',
                layout: 'circular',
                circular: {
                    rotateLabel: true
                },
                data: dataNodes,
                links: dataLinks,
                categories: serieCategory,
                roam: true,
                draggable: true,
                label: {
                    position: 'right',
                    formatter: '{b}'
                },
                lineStyle: {
                    color: 'source',
                    curveness: 0.3
                }
            }
        ]
    };
}

// export function getCategoryScatterOption(title: string, categories: string[], series): echarts.EChartsOption {
//     return {
//         title: {
//             left: 'center',
//             text: title,
//         },
//         xAxis: {
//             type: 'category',
//             data: categories,
//             axisLabel: {
//                 show: true,
//                 interval: 0,
//                 rotate: 27
//             }
//         },
//         yAxis: {
//         },
//         series: series,
//         tooltip: {
//             show: true
//         }
//     };
// }

export function getTimeScatterOption(title: string, series: echarts.SeriesOption[]): echarts.EChartsOption {
    return {
        title: {
            left: 'center',
            text: title,
        },
        xAxis: {
            type: 'time',
            axisLabel: {
                show: true,
                rotate: 27
            }
        },
        yAxis: {
        },
        series: series,
        tooltip: {
            show: true
        }
    };
}

export function getLogScatterOption(title: string, series: echarts.SeriesOption[]): echarts.EChartsOption {
    return {
        title: {
            left: 'center',
            text: title,
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                show: true
            }
        },
        yAxis: {
            type: 'log',
            axisLabel: {
                show: true,
            }
        },
        series: series,
        tooltip: {
            show: true
        }
    };
}

export function getScatterLineDataSeriesFromMap(dataMap: Map<string, string[][]>): echarts.SeriesOption[] {
    let series: any[] = [];
    dataMap.forEach((value, key, map) => {
        let chartSerie: any = {
            name: key,
            label: { show: false },
            symbolSize: 5,
            data: value,
            type: 'line'
        };

        series.push(chartSerie);
    });
    return series;
}

export function getScatterDataSeriesFromMap(dataMap: Map<string, string[]>): echarts.SeriesOption[] {
    let series: any[] = [];
    dataMap.forEach((value, key, map) => {
        let chartSerie: any = {
            name: key,
            label: { show: false },
            symbolSize: 5,
            data: [...new Set(value)].filter(a => a[0] !== null && a[0] !== undefined).sort((a, b) => a[0].localeCompare(b[0])),
            type: 'line'
        };

        series.push(chartSerie);
    });
    return series;
}