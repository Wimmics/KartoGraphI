import { Dayjs } from "dayjs"

export type JSONValue =
    Object
    | string
    | number
    | boolean
    | JSONObject
    | JSONArray;

export interface JSONObject {
    [x: string]: JSONValue;
}

export interface JSONArray extends Array<JSONValue> { }

export interface SPARQLJSONResult extends JSONObject {
    head: {
        vars: string[]
    },
    results: {
        bindings: SPARQLJSONResultBinding[]
    }
}

export interface SPARQLJSONResultBinding extends JSONObject {
            [x: string]: {
                type: string,
                value: string
            }
        }

export type RunSetObject = {
    id: string,
    name: string,
    graphs: string[]
}

export type EndpointItem = {
    endpoint: string
    lat: number
    lon: number
    country: string
    region: string
    city: string
    org: string
    timezone?: string
    sparqlTimezone?: string
    popupHTML?: string
}

export type EndpointTestObject = { 
    endpoint: string, 
    activity: string, 
    graph: string, 
    date: Dayjs 
}

export type GeolocDataObject = {
    endpoint: string,
    lat: number,
    lon: number,
    country: string,
    region: string,
    city: string,
    org: string,
    popupHTML: string
}

export type SPARQLCoverageDataObject = {
    endpoint: string,
    sparql10: number,
    sparql11: number,
    sparqlTotal: number
}

export type SPARQLFeatureDataObject = {
    endpoint: string,
    features: Array<string>
}

export type VocabEndpointDataObject = {
    endpoint: string,
    vocabularies: Array<string>
}

export type VocabKeywordsDataObject = {
    vocabulary: string,
    keywords: Array<string>
}

export type KeywordsEndpointDataObject = {
    endpoint: string,
    keywords: Array<string>
}

export type ClassCountDataObject = {
    endpoint: string,
    classes: number
}

export type PropertyCountDataObject = {
    endpoint: string,
    properties: number
}

export type TripleCountDataObject = {
    endpoint: string,
    triples: number
}

export type EndpointTestDataObject = {
    endpoint: string,
    graph: string,
    date: Dayjs,
    activity: string
}

export type TotalRuntimeDataObject = {
    graph: string,
    endpoint: string,
    date: Dayjs,
    start: Dayjs,
    end: Dayjs,
    runtime: any
}

export type AverageRuntimeDataObject = {
    count: number,
    start: Dayjs,
    end: Dayjs,
    runtime: any,
    graph: string,
    date: Dayjs
}

export type ClassPropertyDataObject = {
}

export type DatasetDescriptionDataObject = {
    endpoint: string,
    license: boolean,
    time: boolean,
    source: boolean,
    who: boolean
}

export type QualityMeasureDataObject = {
    endpoint: string,
    measure: number
}

export type LanguageListDataObject = {    
    endpoint: string,
    languages: Array<string>
}

export type GraphListDataObject = {    
    name: string,
    graphs: Array<string>
}

export type SPARQLFeatureDescriptionDataObject = {
    feature: string,
    description: string,
    query: string
}

export type EndpointServerDataObject = {
    endpoint: string,
    server: string,
}

export type FAIRDataObject = {
    kg: string,
    endpoint: string,
    f1a: number,
    f1b: number,
    f2a: number,
    f2b: number,
    a11: number,
    a12: number,
    i1: number,
    i2: number,
    i3: number,
    r11: number,
    r12: number,
    r13: number
}