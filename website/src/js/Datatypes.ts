import { Dayjs } from "dayjs"

export type TextElement = {
    key: string,
    value: string
}

export type JSONValue =
    | string
    | number
    | boolean
    | JSONObject
    | JSONArray
    | Dayjs;

export interface JSONObject {
    [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> { }

export type SPARQLJSONResult = {
    head: {
        vars: string[]
    },
    results: {
        bindings: {
            [x: string]: {
                type: string,
                value: string
            }
        }[]
    }
}

export type RunsetObject = {
    id: string,
    name: string,
    graphs: string[]
}

export interface EndpointIpGeolocObject extends JSONObject {
    key: string,
    value: {
        ip: string,
        geoloc: {
            status: string,
            country: string,
            countryCode: string,
            region: string,
            regionName: string,
            city: string,
            zip: string,
            lat: number,
            lon: number,
            timezone: string,
            isp: string,
            org: string,
            as: string,
            query: string
        }
    }
}

export interface EndpointTestObject extends JSONObject { 
    endpoint: string, 
    activity: string, 
    graph: string, 
    date: Dayjs 
}

export interface GeolocDataObject extends JSONObject {
    endpoint: string,
    lat: number,
    lon: number,
    country: string,
    region: string,
    city: string,
    org: string,
    popupHTML: string
}

export interface SPARQLCoverageDataObject extends JSONObject {
    endpoint: string,
    sparql10: number,
    sparql11: number,
    sparqlTotal: number
}

export interface SPARQLFeatureDataObject extends JSONObject {
    endpoint: string,
    features: Array<string>
}

export interface VocabEndpointDataObject extends JSONObject {
    endpoint: string,
    vocabularies: Array<string>
}

export interface EndpointKeywordsDataObject extends JSONObject {
    endpoint: string,
    keywords: Array<string>
}

export interface VocabKeywordsDataObject extends JSONObject {
    endpoint: string,
    vocabulary: string,
    keywords: Array<string>
}

export interface ClassCountDataObject extends JSONObject {
    endpoint: string,
    graph: string,
    date: Dayjs,
    classes: number
}

export interface PropertyCountDataObject extends JSONObject {
    endpoint: string,
    graph: string,
    date: Dayjs,
    properties: number
}

export interface TripleCountDataObject extends JSONObject {
    endpoint: string,
    graph: string,
    date: Dayjs,
    triples: number
}

export interface EndpointTestDataObject extends JSONObject {
    endpoint: string,
    graph: string,
    date: Dayjs,
    activity: string
}

export interface TotalRuntimeDataObject extends JSONObject {
    graph: string,
    endpoint: string,
    date: Dayjs,
    start: Dayjs,
    end: Dayjs,
    runtime: any
}

export interface AverageRuntimeDataObject extends JSONObject {
    count: number,
    start: Dayjs,
    end: Dayjs,
    runtime: any,
    graph: string,
    date: Dayjs
}

export interface ClassPropertyDataObject extends JSONObject {
}

export interface DatasetDescriptionDataObject extends JSONObject {
    endpoint: string,
    license: boolean,
    time: boolean,
    source: boolean,
    who: boolean
}

export interface ShortUriDataObject extends JSONObject {
    graph: string,
    date: Dayjs,
    endpoint: string,
    measure: number
}

export interface QualityMeasureDataObject extends JSONObject {
    graph: string,
    date: Dayjs,
    endpoint: string,
    measure: number
}

export interface SPARQLFeatureDescriptionDataObject extends JSONObject {
    feature: string,
    description: string,
    query: string
}