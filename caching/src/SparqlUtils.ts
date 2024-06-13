import sparqljs from "sparqljs";
import * as $rdf from "rdflib";
import { fetchGETPromise, fetchJSONPromise, fetchPOSTPromise } from "./GlobalUtils.js";
import * as RDFUtils from "./RDFUtils.js";
import * as Logger from "./LogUtils.js"
import { JSONObject, JSONValue, SPARQLJSONResult, SPARQLJSONResultBinding } from "./DataTypes.js";

export let defaultQueryTimeout = 60000;

export const queryPaginationSize = 500;

export function setDefaultQueryTimeout(timeout: number) {
    if (timeout != undefined && timeout != null && timeout >= 0) {
        defaultQueryTimeout = timeout;
    } else {
        throw new Error("Timeout must be a positive number")
    }
}

export function sparqlQueryPromise(endpoint, query, timeout: number = defaultQueryTimeout): Promise<$rdf.Formula | SPARQLJSONResult> {
    let jsonHeaders = new Map();
    jsonHeaders.set("Accept", "application/sparql-results+json")
    if (isSparqlSelect(query)) {
        return fetchJSONPromise(endpoint + '?query=' + encodeURIComponent(query) + '&timeout=' + timeout, jsonHeaders).catch(error => { Logger.error(endpoint, query, error); throw error }) as Promise<SPARQLJSONResult>
    } else if (isSparqlAsk(query)) {
        return fetchJSONPromise(endpoint + '?query=' + encodeURIComponent(query) + '&timeout=' + timeout, jsonHeaders).catch(() => { return { boolean: false } }) as Promise<SPARQLJSONResult>
    } else if (isSparqlConstruct(query)) {
        return fetchGETPromise(endpoint + '?query=' + encodeURIComponent(query) + '&timeout=' + timeout)
            .then(result => {
                result = result.replaceAll("nodeID://", "_:") // Dirty hack to fix nodeID:// from Virtuoso servers for turtle
                return RDFUtils.parseTurtleToStore(result, RDFUtils.createStore()).catch(error => {
                    Logger.error(endpoint, query, error, result);
                    throw error;
                });
            }).catch(error => { Logger.error(endpoint, query, error); throw error })
    } else {
        Logger.error(new Error("Unexpected query type"))
    }
}

export function sendUpdateQuery(endpoint, updateQuery) {
    let updateHeader = new Map();
    updateHeader.set('Content-Type', 'application/sparql-update');
    return fetchPOSTPromise(endpoint, updateQuery, updateHeader).then(response => {
        return response;
    }).catch(error => {
        Logger.error("Error send update query", error);
    })
}

export function checkSparqlType(queryString: string, queryType: "CONSTRUCT" | "SELECT" | "ASK" | "DESCRIBE" | "update") {
    let parser = new sparqljs.Parser();
    try {
        const parsedQuery = parser.parse(queryString);
        if (parsedQuery.queryType != undefined) {
            return (parsedQuery.queryType.localeCompare(queryType) == 0);
        } else if (parsedQuery.type != undefined) {
            return (parsedQuery.type.localeCompare(queryType) == 0);
        } else {
            throw new Error("No expected query type property : " + JSON.stringify(parsedQuery));
        }
    } catch (error) {
        Logger.error(queryString, error)
    }
}

export function isSparqlConstruct(queryString: string): boolean {
    return checkSparqlType(queryString, "CONSTRUCT");
}

export function isSparqlSelect(queryString: string): boolean {
    return checkSparqlType(queryString, "SELECT");
}

export function isSparqlAsk(queryString: string): boolean {
    return checkSparqlType(queryString, "ASK");
}

export function isSparqlDescribe(queryString: string): boolean {
    return checkSparqlType(queryString, "DESCRIBE");
}

export function isSparqlUpdate(queryString: string): boolean {
    return checkSparqlType(queryString, "update");
}

export function sparqlQueryToIndeGxPromise(query: string, timeout: number = defaultQueryTimeout): Promise<$rdf.Formula | SPARQLJSONResult> {
    return sparqlQueryPromise("http://prod-dekalog.inria.fr/sparql", query, timeout);
}


function paginatedSparqlQueryPromise(endpointUrl: string, query: string, pageSize: number, iteration?: number, timeout?: number, finalResult?: $rdf.Formula | Array<SPARQLJSONResultBinding>): Promise<$rdf.Formula | Array<SPARQLJSONResultBinding>> {
    let generator = new sparqljs.Generator();
    let parser = new sparqljs.Parser();
    if (iteration == undefined) {
        iteration = 0;
    }
    if (timeout == undefined) {
        timeout = defaultQueryTimeout;
    }
    let queryObject = parser.parse(query);
    if (isSparqlSelect(query)) {
        if (finalResult == undefined) {
            finalResult = [] as Array<SPARQLJSONResultBinding>;
        }
    } else if (isSparqlConstruct(query)) {
        if (finalResult == undefined) {
            finalResult = RDFUtils.createStore() as $rdf.Formula;
        }
    }

    // We add the OFFSET and LIMIT to the query
    queryObject.offset = iteration * pageSize;
    queryObject.limit = pageSize;

    let generatedQuery = generator.stringify(queryObject);

    // We send the paginated CONSTRUCT query
    return sparqlQueryPromise(endpointUrl, generatedQuery, timeout).then(generatedQueryResult => {
        if (generatedQueryResult !== undefined) {
            if (isSparqlSelect(query)) {
                let parsedSelectQueryResult: SPARQLJSONResult = generatedQueryResult as SPARQLJSONResult;
                try {
                    if (parsedSelectQueryResult != undefined && parsedSelectQueryResult.results != undefined && parsedSelectQueryResult.results.bindings != undefined) {
                        (finalResult as Array<SPARQLJSONResultBinding>) = (finalResult as Array<SPARQLJSONResultBinding>).concat(parsedSelectQueryResult["results"].bindings as SPARQLJSONResultBinding[]);
                        if ((parsedSelectQueryResult as SPARQLJSONResult)["results"].bindings.length > 0) {
                            return paginatedSparqlQueryPromise(endpointUrl, query, pageSize, iteration + 1, timeout, finalResult);
                        } else {
                            return finalResult;
                        }
                    } else {
                        throw new Error("Invalid SPARQL result" + JSON.stringify(generatedQueryResult));
                    }
                } catch (error) {
                    Logger.error("Error while parsing the query result as SELECT result: ", error, generatedQueryResult);
                    throw error;
                }
            } else if (isSparqlConstruct(query)) {
                (finalResult as $rdf.Formula).addAll((generatedQueryResult as $rdf.Formula).statements)
                if ((generatedQueryResult as $rdf.Formula).statements.length > 0) {
                    return paginatedSparqlQueryPromise(endpointUrl, query, pageSize, iteration + 1, timeout, finalResult);
                } else {
                    return finalResult;
                }
            } else {
                return finalResult;
            }
        } else {
            return finalResult;
        }
    }).catch(error => {
        Logger.error("Error while paginating the query: ", error);
        throw error;
    })
        .finally(() => {
            return finalResult;
        });
}

export function paginatedSparqlQueryToIndeGxPromise(query, pageSize = 100): Promise<$rdf.Formula | SPARQLJSONResultBinding[]> {
    return paginatedSparqlQueryPromise("http://prod-dekalog.inria.fr/sparql", query, pageSize);
}