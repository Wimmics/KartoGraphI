import {writeFileSync as $hgUW1$writeFileSync} from "node:fs";
import $hgUW1$dayjs from "dayjs";
import $hgUW1$dayjsplugindurationjs from "dayjs/plugin/duration.js";
import $hgUW1$dayjsplugincustomParseFormatjs from "dayjs/plugin/customParseFormat.js";
import $hgUW1$dayjspluginrelativeTimejs from "dayjs/plugin/relativeTime.js";
import $hgUW1$nodefetch, {Headers as $hgUW1$Headers, FetchError as $hgUW1$FetchError} from "node-fetch";
import {writeFile as $hgUW1$writeFile, readFile as $hgUW1$readFile} from "node:fs/promises";
import {setTimeout as $hgUW1$setTimeout} from "node:timers/promises";
import {format as $hgUW1$format} from "node:util";
import $hgUW1$sparqljs from "sparqljs";
import {Namespace as $hgUW1$Namespace, graph as $hgUW1$graph, sym as $hgUW1$sym, lit as $hgUW1$lit, blankNode as $hgUW1$blankNode, isLiteral as $hgUW1$isLiteral, serialize as $hgUW1$serialize, parse as $hgUW1$parse, SPARQLToQuery as $hgUW1$SPARQLToQuery, isNamedNode as $hgUW1$isNamedNode, isBlankNode as $hgUW1$isBlankNode} from "rdflib";
import {createReadStream as $hgUW1$createReadStream} from "fs";
import $hgUW1$graphycontentttlread from "@graphy/content.ttl.read";
import $hgUW1$graphycontentntread from "@graphy/content.nt.read";
import $hgUW1$graphycontentnqread from "@graphy/content.nq.read";
import $hgUW1$graphycontenttrigread from "@graphy/content.trig.read";
import {readFile as $hgUW1$readFile1, writeFile as $hgUW1$writeFile1} from "fs/promises";













let $8a991e7a11d82128$var$logFileName = "kartographicaching.log";
function $8a991e7a11d82128$export$1a41b952b1d6d091(fileName) {
    if (fileName == null || fileName == undefined || fileName == "") $8a991e7a11d82128$var$logFileName = "kartographicaching.log";
    else $8a991e7a11d82128$var$logFileName = fileName;
}
function $8a991e7a11d82128$export$bef1f36f5486a6a3(logObject, ...o) {
    $8a991e7a11d82128$var$logging("LOG", logObject, ...o);
}
function $8a991e7a11d82128$export$a3bc9b8ed74fc(logObject, ...o) {
    $8a991e7a11d82128$var$logging("ERROR", logObject, ...o);
}
function $8a991e7a11d82128$export$a80b3bd66acc52ff(logObject, ...o) {
    $8a991e7a11d82128$var$logging("INFO", logObject, ...o);
}
function $8a991e7a11d82128$var$logging(level, logObject, ...o) {
    const now = (0, $hgUW1$dayjs)();
    const message = $hgUW1$format("[%s][%s]: %s", level, now.toISOString(), logObject, ...o);
    console.error(message);
    (0, $ffc2274b02472392$export$4f58cbbefe506af9)($8a991e7a11d82128$var$logFileName, message + "\n");
}



let $ffc2274b02472392$export$ff9145aa8f5d08d8 = 10;
let $ffc2274b02472392$export$606d8b965266a4fd = 5000;
let $ffc2274b02472392$var$countConcurrentQueries = 0;
let $ffc2274b02472392$export$e69c944f813dd417 = 300;
let $ffc2274b02472392$export$ae866de19353582e = 1000;
function $ffc2274b02472392$export$e74e8de8dd192304(runsetId, filename) {
    return $86c4b18dfd9981cd$export$acfe9088a868a3b7 + filename + "." + runsetId + ".json";
}
function $ffc2274b02472392$export$6b862160d295c8e(input, format = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") {
    let result = (0, $hgUW1$dayjs)(input, format);
    if (format.localeCompare("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'") == 0 && !result.isValid()) result = $ffc2274b02472392$export$6b862160d295c8e(input, "dd-MM-yyyy'T'HH:mm:ss.SSS'Z'");
    else if (format.localeCompare("dd-MM-yyyy'T'HH:mm:ss.SSS'Z'") && !result.isValid()) result = $ffc2274b02472392$export$6b862160d295c8e(input, "yyyy-MM-dd'T'HH:mm:ss");
    else if (format.localeCompare("yyyy-MM-dd'T'HH:mm:ss") && !result.isValid()) result = $ffc2274b02472392$export$6b862160d295c8e(input, "dd-MM-yyyy'T'HH:mm:ss");
    else if (format.localeCompare("dd-MM-yyyy'T'HH:mm:ss") && !result.isValid()) result = $ffc2274b02472392$export$6b862160d295c8e(input, "dd-MM-yyyy'T'HH:mm:ss.SSSXXX");
    else if (format.localeCompare("dd-MM-yyyy'T'HH:mm:ss.SSSXXX") && !result.isValid()) result = $ffc2274b02472392$export$6b862160d295c8e(input, "dd-MM-yyyy'T'HH:mm:ssXXX");
    return result;
}
function $ffc2274b02472392$export$6cc6e25203630304() {
    return $ffc2274b02472392$var$countConcurrentQueries;
}
function $ffc2274b02472392$export$66826636ef5e1530(nb) {
    if (nb !== undefined && nb !== null && nb >= 0) $ffc2274b02472392$export$ff9145aa8f5d08d8 = nb;
    else throw new Error("The number of retries must be a positive integer");
}
function $ffc2274b02472392$export$f60a4bbf81e656d4(milliseconds) {
    if (milliseconds !== undefined && milliseconds !== null && milliseconds >= 0) $ffc2274b02472392$export$606d8b965266a4fd = milliseconds;
    else throw new Error("The number of milliseconds between retries must be a positive integer");
}
function $ffc2274b02472392$export$652c9b10c84c8691(max) {
    if (max !== undefined && max !== null && max >= 0) $ffc2274b02472392$export$e69c944f813dd417 = max;
    else throw new Error("The number of maximum concurrent queries must be a positive integer");
}
function $ffc2274b02472392$export$4ddac1eae8e1a9ec(milliseconds) {
    if (milliseconds !== undefined && milliseconds !== null && milliseconds >= 0) $ffc2274b02472392$export$ae866de19353582e = milliseconds;
    else throw new Error("The number of milliseconds between queries must be a positive integer");
}
function $ffc2274b02472392$export$4f58cbbefe506af9(filename, content) {
    return $hgUW1$writeFile(filename, content, {
        flag: "a+"
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error appending to file", error);
    });
}
function $ffc2274b02472392$export$552bfb764b5cd2b4(filename, content) {
    return $hgUW1$writeFile(filename, content).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error writing to file", filename, error);
    });
}
function $ffc2274b02472392$export$72c04af63de9061a(filename) {
    let readFilePromise;
    if (filename.startsWith("http://") || filename.startsWith("https://")) readFilePromise = $ffc2274b02472392$export$a6e59c03a779ef88(filename);
    else if (filename.startsWith("file://")) readFilePromise = $hgUW1$readFile(filename.replace("file://", "")).then((buffer)=>buffer.toString());
    else readFilePromise = $hgUW1$readFile(filename).then((buffer)=>buffer.toString());
    return readFilePromise;
}
function $ffc2274b02472392$export$aa2c7ad2063c8ec6(filename) {
    return $ffc2274b02472392$export$72c04af63de9061a(filename).then((content)=>JSON.parse(content));
}
function $ffc2274b02472392$export$4282b215e95fd9cb(settledPromisesResult) {
    return settledPromisesResult.map((promiseResult)=>{
        if (promiseResult.status === "fulfilled") return promiseResult.value;
        else return undefined;
    });
}
function $ffc2274b02472392$export$43afd36b730bac7c(args, promiseCreationFunction) {
    let argsCopy = args.map((arg)=>arg);
    if (argsCopy.length > 0) return promiseCreationFunction.apply(this, argsCopy[0]).then(()=>{
        argsCopy.shift();
        return $ffc2274b02472392$export$43afd36b730bac7c(argsCopy, promiseCreationFunction);
    });
    return new Promise((resolve, reject)=>resolve());
}
function $ffc2274b02472392$export$7fc4ea9a72a632dc(url, header = new Map(), method = "GET", query = "", numTry = 0) {
    let myHeaders = new (0, $hgUW1$Headers)();
    myHeaders.set("pragma", "no-cache");
    myHeaders.set("cache-control", "no-cache");
    header.forEach((value, key)=>{
        myHeaders.set(key, value);
    });
    let myInit = {
        method: method,
        headers: myHeaders,
        redirect: "follow"
    };
    if (method.localeCompare("POST") == 0) myInit.body = query;
    if ($ffc2274b02472392$var$countConcurrentQueries >= $ffc2274b02472392$export$e69c944f813dd417) return (0, $hgUW1$setTimeout)($ffc2274b02472392$export$ae866de19353582e).then(()=>$ffc2274b02472392$export$7fc4ea9a72a632dc(url, header, method, query, numTry));
    else {
        $ffc2274b02472392$var$countConcurrentQueries++;
        return (0, $hgUW1$nodefetch)(url, myInit).then((response)=>{
            if (response.ok) return response.blob().then((blob)=>blob.text());
            else throw response;
        }).catch((error)=>{
            if (error instanceof (0, $hgUW1$FetchError)) {
                $8a991e7a11d82128$export$a3bc9b8ed74fc(error.type, error.message);
                $8a991e7a11d82128$export$a80b3bd66acc52ff("Try:", numTry, "Fetch ", method, url, query);
                if (numTry < $ffc2274b02472392$export$ff9145aa8f5d08d8) return (0, $hgUW1$setTimeout)($ffc2274b02472392$export$606d8b965266a4fd).then($ffc2274b02472392$export$7fc4ea9a72a632dc(url, header, method, query, numTry + 1));
                else $8a991e7a11d82128$export$a3bc9b8ed74fc("Too many retries", error);
            } else $8a991e7a11d82128$export$a3bc9b8ed74fc("FetchError, try n\xb0", numTry, error);
        }).finally(()=>{
            $ffc2274b02472392$var$countConcurrentQueries--;
            return;
        });
    }
}
function $ffc2274b02472392$export$a6e59c03a779ef88(url, header = new Map()) {
    return $ffc2274b02472392$export$7fc4ea9a72a632dc(url, header);
}
function $ffc2274b02472392$export$3233bfa38a51357e(url, query = "", header = new Map()) {
    return $ffc2274b02472392$export$7fc4ea9a72a632dc(url, header, "POST", query);
}
function $ffc2274b02472392$export$230442c21b56ff1e(url, otherHeaders = new Map()) {
    let header = new Map();
    header.set("Content-Type", "application/json");
    otherHeaders.forEach((value, key)=>{
        header.set(key, value);
    });
    return $ffc2274b02472392$export$7fc4ea9a72a632dc(url, header).then((response)=>{
        if (response == null || response == undefined || response == "") return {};
        else try {
            return JSON.parse(response);
        } catch (error) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(url, error, response);
            throw error;
        }
    });
}
function $ffc2274b02472392$export$a699a8b2615a99e(text) {
    return text.replace(/\\u[\dA-F]{4}/gi, function(match) {
        let unicodeMatch = String.fromCharCode(parseInt(match.replace(/\\u/g, ""), 16));
        let urlEncodedMatch = encodeURIComponent(unicodeMatch);
        return urlEncodedMatch;
    });
}
function $ffc2274b02472392$export$bbf2ffbffa00b288(x, n = 2) {
    return x.toPrecision(n);
}












const $78e87bfa2b5916a2$export$1cd1943b3a73bbe8 = $hgUW1$Namespace("http://rdfs.org/ns/void#");
const $78e87bfa2b5916a2$export$65dca9476b1ea120 = $hgUW1$Namespace("http://www.w3.org/2001/XMLSchema#");
const $78e87bfa2b5916a2$export$7be7716cc4115fc5 = $hgUW1$Namespace("http://www.w3.org/ns/dcat#");
const $78e87bfa2b5916a2$export$afb74c410165642c = $hgUW1$Namespace("http://www.w3.org/ns/prov#");
const $78e87bfa2b5916a2$export$5b088def975a652b = $hgUW1$Namespace("http://www.w3.org/ns/sparql-service-description#");
const $78e87bfa2b5916a2$export$969f4e5258613036 = $hgUW1$Namespace("http://purl.org/dc/terms/");
const $78e87bfa2b5916a2$export$65000094e116eac3 = $hgUW1$Namespace("http://purl.org/pav/");
const $78e87bfa2b5916a2$export$fd985e82eeb3038 = $hgUW1$Namespace("http://www.w3.org/1999/02/22-rdf-syntax-ns#");
const $78e87bfa2b5916a2$export$ed40fb79445e6c3f = $hgUW1$Namespace("http://www.w3.org/2000/01/rdf-schema#");
const $78e87bfa2b5916a2$export$f4d442bee9f13350 = $hgUW1$Namespace("http://www.w3.org/2002/07/owl#");
const $78e87bfa2b5916a2$export$2399ee13db66b01b = $hgUW1$Namespace("http://xmlns.com/foaf/0.1/");
const $78e87bfa2b5916a2$export$166a3e0dcf6b0f25 = $hgUW1$Namespace("http://schema.org/");
const $78e87bfa2b5916a2$export$31263f9522fbe61c = $hgUW1$Namespace("http://purl.org/dc/elements/1.1/");
const $78e87bfa2b5916a2$export$b613353551a25804 = $hgUW1$Namespace("http://www.w3.org/2004/02/skos/core#");
const $78e87bfa2b5916a2$export$4c64c06afd02bfd3 = $hgUW1$Namespace("https://w3id.org/mod#");
const $78e87bfa2b5916a2$export$d3b38a047f2b40c9 = $hgUW1$Namespace("http://www.w3.org/ns/earl#");
const $78e87bfa2b5916a2$export$d02421b6d5283efe = $hgUW1$Namespace("http://www.w3.org/2001/sw/DataAccess/tests/test-manifest#");
const $78e87bfa2b5916a2$export$7da59e8c4251b58c = $hgUW1$Namespace("http://ns.inria.fr/kg/index#");
const $78e87bfa2b5916a2$export$6b64c61e92e05834 = $78e87bfa2b5916a2$export$fd985e82eeb3038("type");
function $78e87bfa2b5916a2$export$8fc05e03d96f502e(url) {
    const baseURI = url.replace(new RegExp("/^(?:.*/)*([^/\r\n]+?|)(?=(?:.[^/\r\n..]*.)?$)/gm"), "");
    return baseURI;
}
function $78e87bfa2b5916a2$export$f51a9068ac82ea43() {
    let store = $hgUW1$graph();
    store.setPrefixForURI("cc", "http://creativecommons.org/ns#");
    store.setPrefixForURI("culturefr", "https://www.culture.gouv.fr/");
    store.setPrefixForURI("dbfr", "http://fr.dbpedia.org/");
    store.setPrefixForURI("dbfrg", "http://fr.dbpedia.org/graph/");
    store.setPrefixForURI("dbfrp", "http://fr.dbpedia.org/property/");
    store.setPrefixForURI("dbo", "http://dbpedia.org/ontology/");
    store.setPrefixForURI("dbspr", "http://dbpedia.org/schema/property_rules#");
    store.setPrefixForURI("dcat", "http://www.w3.org/ns/dcat#");
    store.setPrefixForURI("dce", "http://purl.org/dc/elements/1.1/");
    store.setPrefixForURI("dcmitype", "http://purl.org/dc/dcmitype/");
    store.setPrefixForURI("eclass", "http://www.ebusiness-unibw.org/ontologies/eclass/5.1.4/#");
    store.setPrefixForURI("ex", "https://e.g/#");
    store.setPrefixForURI("georss", "http://www.georss.org/georss/");
    store.setPrefixForURI("goodrel", "http://purl.org/goodrelations/v1#");
    store.setPrefixForURI("inria", "https://www.inria.fr/");
    store.setPrefixForURI("kgi", "http://ns.inria.fr/kg/index#");
    store.setPrefixForURI("localdav", "http://localhost:8890/DAV/");
    store.setPrefixForURI("mod", "https://w3id.org/mod#");
    store.setPrefixForURI("oa", "http://www.w3.org/ns/oa#");
    store.setPrefixForURI("openvoc", "http://open.vocab.org/terms/");
    store.setPrefixForURI("pav", "http://purl.org/pav/");
    store.setPrefixForURI("powders", "http://www.w3.org/2007/05/powder-s#");
    store.setPrefixForURI("schema", "http://schema.org/");
    store.setPrefixForURI("sd", "http://www.w3.org/ns/sparql-service-description#");
    store.setPrefixForURI("skos", "http://www.w3.org/2004/02/skos/core#");
    store.setPrefixForURI("vann", "http://purl.org/vocab/vann/");
    store.setPrefixForURI("voaf", "http://purl.org/vocommons/voaf#");
    store.setPrefixForURI("wdentity", "http://www.wikidata.org/entity/");
    store.setPrefixForURI("wimmics", "https://team.inria.fr/wimmics/");
    return store;
}
function $78e87bfa2b5916a2$var$getGraphyReadingFunction(contentType) {
    switch(contentType){
        case $78e87bfa2b5916a2$export$72c700663a6da118:
            return 0, $hgUW1$graphycontentnqread;
        case $78e87bfa2b5916a2$export$1c7d73fda2689091:
            return 0, $hgUW1$graphycontentntread;
        case $78e87bfa2b5916a2$export$b0cb396944dacc84:
            return 0, $hgUW1$graphycontenttrigread;
        default:
        case $78e87bfa2b5916a2$export$9be2284ddc122481:
            return 0, $hgUW1$graphycontentttlread;
    }
}
function $78e87bfa2b5916a2$var$graphyQuadLoadingToStore(store, y_quad, baseURI = $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value) {
    let s = undefined;
    if (y_quad.subject.termType === "NamedNode") s = $hgUW1$sym(y_quad.subject.value);
    else if (y_quad.subject.termType === "Literal") {
        if (y_quad.subject.language != null && y_quad.subject.language != undefined && y_quad.subject.language != "") s = $hgUW1$lit(y_quad.subject.value, y_quad.subject.language);
        else if (y_quad.subject.datatype != null && y_quad.subject.datatype != undefined && y_quad.subject.datatype != "") s = $hgUW1$lit(y_quad.subject.value, undefined, $hgUW1$sym(y_quad.subject.datatype));
        else s = $hgUW1$lit(y_quad.subject.value);
    } else s = $hgUW1$blankNode(baseURI + "#" + y_quad.subject.value);
    const p = $hgUW1$sym(y_quad.predicate.value);
    let o = undefined;
    if (y_quad.object.termType === "NamedNode") o = $hgUW1$sym(y_quad.object.value);
    else if (y_quad.object.termType === "Literal") {
        if (y_quad.object.language != null && y_quad.object.language != undefined && y_quad.object.language != "") o = $hgUW1$lit(y_quad.object.value, y_quad.object.language);
        else if (y_quad.object.datatype != null && y_quad.object.datatype != undefined && y_quad.object.datatype != "") o = $hgUW1$lit(y_quad.object.value, undefined, $hgUW1$sym(y_quad.object.datatype));
        else o = $hgUW1$lit(y_quad.object.value);
    } else o = $hgUW1$blankNode(baseURI + "#" + y_quad.object.value);
    if (!$hgUW1$isLiteral(s)) {
        if (y_quad.graph.value === "") store.add(s, p, o);
        else {
            const g = $hgUW1$sym(y_quad.graph);
            store.add(s, p, o, g);
        }
    }
}
function $78e87bfa2b5916a2$export$d17f379544103d74(file, store, baseURI) {
    return $78e87bfa2b5916a2$export$f7e34cb4c320986e([
        file
    ], store, baseURI);
}
function $78e87bfa2b5916a2$export$f7e34cb4c320986e(files, store, generalBaseUri) {
    try {
        const promiseArray = files.map((filename)=>{
            let baseURI = $78e87bfa2b5916a2$export$8fc05e03d96f502e(filename);
            if (generalBaseUri != null && generalBaseUri != undefined) baseURI = generalBaseUri;
            const contentType = $78e87bfa2b5916a2$export$660184b15845db27(filename);
            let readingFunction = (0, $hgUW1$graphycontentttlread);
            if (contentType != undefined) readingFunction = $78e87bfa2b5916a2$var$getGraphyReadingFunction(contentType);
            else throw new Error("Unsupported content type for " + filename + ", only .ttl, .nq, .nt and .trig supported.");
            return new Promise((resolve, reject)=>{
                try {
                    if (filename.startsWith("http")) filename = filename.replace("http://", "https://");
                    else if (filename.startsWith("file")) filename = filename.replace("file://", "");
                    $hgUW1$createReadStream(filename).pipe(readingFunction({
                        baseURI: baseURI
                    })).on("data", (y_quad)=>{
                        $78e87bfa2b5916a2$var$graphyQuadLoadingToStore(store, y_quad, baseURI);
                    }).on("eof", (prefixes)=>{
                        resolve();
                    }).on("error", (error)=>{
                        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error while reading RDF file", filename, "during stream", "error", error);
                        reject(error);
                    });
                } catch (error) {
                    $8a991e7a11d82128$export$a3bc9b8ed74fc("Error while loading RDF files", files, "error", error);
                    reject(error);
                }
            }).catch((error)=>{
                $8a991e7a11d82128$export$a3bc9b8ed74fc("Error while loading RDF files", files, "error", error);
                return Promise.reject(error);
            });
        });
        return Promise.allSettled(promiseArray).then(()=>{});
    } catch (error) {
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error while loading RDF files", files, "error", error);
        return Promise.reject(error);
    }
}
function $78e87bfa2b5916a2$export$147c92fc1e54141d(store) {
    return new Promise((accept, reject)=>{
        try {
            $hgUW1$serialize(null, store, $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value, "text/turtle", function(err, str) {
                if (err != null) reject(err);
                str = $ffc2274b02472392$export$a699a8b2615a99e(str);
                accept(str);
            }, {
                namespaces: store.namespaces
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$4128d08d4610f65f(store) {
    return new Promise((accept, reject)=>{
        try {
            $hgUW1$serialize(null, store, $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value, "application/n-triples", function(err, str) {
                if (err != null) reject(err);
                str = $ffc2274b02472392$export$a699a8b2615a99e(str);
                accept(str);
            }, {
                // flags: 'deinprstux', // r: Flag to escape /u unicode characters, t: flag to replace rdf:type by "a", d: flag to use the default namespace for unqualified terms with prefix ":"
                namespaces: store.namespaces
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$b37a8f1ff56a0ace(store) {
    return new Promise((accept, reject)=>{
        try {
            $hgUW1$serialize(null, store, $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value, "application/trig", function(err, str) {
                if (err != null) reject(err);
                str = $ffc2274b02472392$export$a699a8b2615a99e(str);
                accept(str);
            }, {
                namespaces: store.namespaces
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$53d6b4153e4d31a3(store) {
    return new Promise((accept, reject)=>{
        try {
            $hgUW1$serialize(null, store, $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value, "application/nquads", function(err, str) {
                if (err != null) reject(err);
                str = $ffc2274b02472392$export$a699a8b2615a99e(str);
                accept(str);
            }, {
                namespaces: store.namespaces
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$3f751611e1c07e11(content, store) {
    return new Promise((accept, reject)=>{
        try {
            content = $ffc2274b02472392$export$a699a8b2615a99e(content);
            $hgUW1$parse(content, store, $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value, "application/n-triples", (err, kb)=>{
                if (err != null) reject(err);
                accept(kb);
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$c5a866906ae935ba(content, store) {
    return new Promise((accept, reject)=>{
        try {
            content = $ffc2274b02472392$export$a699a8b2615a99e(content);
            $hgUW1$parse(content, store, $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value, "text/n3", (err, kb)=>{
                if (err != null) reject(err);
                accept(kb);
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$968deea481412d5d(content, store, baseURI = $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value) {
    return new Promise((accept, reject)=>{
        try {
            (0, $hgUW1$graphycontentttlread)(content, {
                data (y_quad) {
                    $78e87bfa2b5916a2$var$graphyQuadLoadingToStore(store, y_quad, baseURI);
                },
                eof (prefixes) {
                    accept(store);
                },
                error (error) {
                    $8a991e7a11d82128$export$a3bc9b8ed74fc("Error while parsing turtle content", "error", error);
                    reject(error);
                }
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$ef9657044009dbea(content, store) {
    return new Promise((accept, reject)=>{
        try {
            content = $ffc2274b02472392$export$a699a8b2615a99e(content);
            $hgUW1$parse(content, store, $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value, "text/html", (err, kb)=>{
                if (err != null) reject(err);
                accept(kb);
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$6725074973fc00d(content, store) {
    return new Promise((accept, reject)=>{
        try {
            content = $ffc2274b02472392$export$a699a8b2615a99e(content);
            $hgUW1$parse(content, store, $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value, "application/ld+json", (err, kb)=>{
                if (err != null) reject(err);
                accept(kb);
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$1843c9c1bbbb33a(content, store) {
    return new Promise((accept, reject)=>{
        try {
            content = $ffc2274b02472392$export$a699a8b2615a99e(content);
            $hgUW1$parse(content, store, $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value, "application/nquads", (err, kb)=>{
                if (err != null) reject(err);
                accept(kb);
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$4e369e5d821beb3f(content, store) {
    return new Promise((accept, reject)=>{
        try {
            content = $ffc2274b02472392$export$a699a8b2615a99e(content);
            $hgUW1$parse(content, store, $78e87bfa2b5916a2$export$7da59e8c4251b58c("").value, "application/rdf+xml", (err, kb)=>{
                if (err != null) reject(err);
                accept(kb);
            });
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$548d67cf2ef0f340(store, query) {
    return new Promise((resolve, reject)=>{
        try {
            let parsedQuery = $hgUW1$SPARQLToQuery(query, false, store);
            if (parsedQuery) {
                parsedQuery;
                store.query(parsedQuery, (results)=>{
                    resolve(results);
                });
            } else reject("Query is not a valid SPARQL query" + query);
        } catch (error) {
            reject(error);
        }
    });
}
function $78e87bfa2b5916a2$export$177a7908c10ca9b0(collection, store) {
    let result = [];
    store.statementsMatching(collection, $78e87bfa2b5916a2$export$fd985e82eeb3038("first")).forEach((statement)=>{
        if (!statement.object.equals($78e87bfa2b5916a2$export$fd985e82eeb3038("nil"))) result.push(statement.object);
    });
    store.statementsMatching(collection, $78e87bfa2b5916a2$export$fd985e82eeb3038("rest")).forEach((statement)=>{
        if (!statement.object.equals($78e87bfa2b5916a2$export$fd985e82eeb3038("nil"))) {
            if ($hgUW1$isNamedNode(statement.object)) result = result.concat($78e87bfa2b5916a2$export$177a7908c10ca9b0(statement.object, store));
            else if ($hgUW1$isBlankNode(statement.object)) result = result.concat($78e87bfa2b5916a2$export$177a7908c10ca9b0(statement.object, store));
        }
    });
    return [
        ...new Set(result)
    ];
}
const $78e87bfa2b5916a2$export$1c7d73fda2689091 = "application/n-triples";
const $78e87bfa2b5916a2$export$72c700663a6da118 = "application/nquads";
const $78e87bfa2b5916a2$export$9be2284ddc122481 = "text/turtle";
const $78e87bfa2b5916a2$export$b0cb396944dacc84 = "application/trig";
function $78e87bfa2b5916a2$export$660184b15845db27(filename) {
    filename = filename.trim();
    if (filename.endsWith(".ttl")) return $78e87bfa2b5916a2$export$9be2284ddc122481;
    else if (filename.endsWith(".nt")) return $78e87bfa2b5916a2$export$1c7d73fda2689091;
    else if (filename.endsWith(".nq")) return $78e87bfa2b5916a2$export$72c700663a6da118;
    else if (filename.endsWith(".trig")) return $78e87bfa2b5916a2$export$b0cb396944dacc84;
    else return undefined;
}




let $fc64c962fef42e90$export$91240bce4e364bef = 60000;
const $fc64c962fef42e90$export$96568ddd73a6678c = 500;
function $fc64c962fef42e90$export$9b672861111f5f8f(timeout) {
    if (timeout != undefined && timeout != null && timeout >= 0) $fc64c962fef42e90$export$91240bce4e364bef = timeout;
    else throw new Error("Timeout must be a positive number");
}
function $fc64c962fef42e90$export$d37bf5547347f960(endpoint, query, timeout = $fc64c962fef42e90$export$91240bce4e364bef) {
    let jsonHeaders = new Map();
    jsonHeaders.set("Accept", "application/sparql-results+json");
    if ($fc64c962fef42e90$export$3cdb12c099e58bd1(query)) return (0, $ffc2274b02472392$export$230442c21b56ff1e)(endpoint + "?query=" + encodeURIComponent(query) + "&format=json&timeout=" + timeout, jsonHeaders).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(endpoint, query, error);
        throw error;
    });
    else if ($fc64c962fef42e90$export$6fc7ccfd73d62d6(query)) return (0, $ffc2274b02472392$export$230442c21b56ff1e)(endpoint + "?query=" + encodeURIComponent(query) + "&format=json&timeout=" + timeout, jsonHeaders).catch(()=>{
        return {
            boolean: false
        };
    });
    else if ($fc64c962fef42e90$export$8b54a6cc6363eda0(query)) return (0, $ffc2274b02472392$export$a6e59c03a779ef88)(endpoint + "?query=" + encodeURIComponent(query) + "&format=turtle&timeout=" + timeout).then((result)=>{
        result = result.replaceAll("nodeID://", "_:") // Dirty hack to fix nodeID:// from Virtuoso servers for turtle
        ;
        console.log(result);
        return $78e87bfa2b5916a2$export$968deea481412d5d(result, $78e87bfa2b5916a2$export$f51a9068ac82ea43()).catch((error)=>{
            $8a991e7a11d82128$export$a3bc9b8ed74fc(endpoint, query, error, result);
            throw error;
        });
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(endpoint, query, error);
        throw error;
    });
    else $8a991e7a11d82128$export$a3bc9b8ed74fc(new Error("Unexpected query type"));
}
function $fc64c962fef42e90$export$5700dc806452a6b3(endpoint, updateQuery) {
    let updateHeader = new Map();
    updateHeader.set("Content-Type", "application/sparql-update");
    return (0, $ffc2274b02472392$export$3233bfa38a51357e)(endpoint, updateQuery, updateHeader).then((response)=>{
        return response;
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error send update query", error);
    });
}
function $fc64c962fef42e90$export$2ffe62e6fe70d843(queryString, queryType) {
    let parser = new (0, $hgUW1$sparqljs).Parser();
    try {
        const parsedQuery = parser.parse(queryString);
        if (parsedQuery.queryType != undefined) return parsedQuery.queryType.localeCompare(queryType) == 0;
        else if (parsedQuery.type != undefined) return parsedQuery.type.localeCompare(queryType) == 0;
        else throw new Error("No expected query type property : " + JSON.stringify(parsedQuery));
    } catch (error) {
        $8a991e7a11d82128$export$a3bc9b8ed74fc(queryString, error);
    }
}
function $fc64c962fef42e90$export$8b54a6cc6363eda0(queryString) {
    return $fc64c962fef42e90$export$2ffe62e6fe70d843(queryString, "CONSTRUCT");
}
function $fc64c962fef42e90$export$3cdb12c099e58bd1(queryString) {
    return $fc64c962fef42e90$export$2ffe62e6fe70d843(queryString, "SELECT");
}
function $fc64c962fef42e90$export$6fc7ccfd73d62d6(queryString) {
    return $fc64c962fef42e90$export$2ffe62e6fe70d843(queryString, "ASK");
}
function $fc64c962fef42e90$export$e96226776349d85c(queryString) {
    return $fc64c962fef42e90$export$2ffe62e6fe70d843(queryString, "DESCRIBE");
}
function $fc64c962fef42e90$export$25d0fe831c5dfff3(queryString) {
    return $fc64c962fef42e90$export$2ffe62e6fe70d843(queryString, "update");
}
function $fc64c962fef42e90$export$90ab2bee66c1c2b(query, timeout = $fc64c962fef42e90$export$91240bce4e364bef) {
    return $fc64c962fef42e90$export$d37bf5547347f960("http://prod-dekalog.inria.fr/sparql", query, timeout);
}
function $fc64c962fef42e90$var$paginatedSparqlQueryPromise(endpointUrl, query, pageSize, iteration, timeout, finalResult) {
    let generator = new (0, $hgUW1$sparqljs).Generator();
    let parser = new (0, $hgUW1$sparqljs).Parser();
    if (iteration == undefined) iteration = 0;
    if (timeout == undefined) timeout = $fc64c962fef42e90$export$91240bce4e364bef;
    let queryObject = parser.parse(query);
    if ($fc64c962fef42e90$export$3cdb12c099e58bd1(query)) {
        if (finalResult == undefined) finalResult = [];
    } else if ($fc64c962fef42e90$export$8b54a6cc6363eda0(query)) {
        if (finalResult == undefined) finalResult = $78e87bfa2b5916a2$export$f51a9068ac82ea43();
    }
    // We add the OFFSET and LIMIT to the query
    queryObject.offset = iteration * pageSize;
    queryObject.limit = pageSize;
    let generatedQuery = generator.stringify(queryObject);
    // We send the paginated CONSTRUCT query
    return $fc64c962fef42e90$export$d37bf5547347f960(endpointUrl, generatedQuery, timeout).then((generatedQueryResult)=>{
        if (generatedQueryResult !== undefined) {
            if ($fc64c962fef42e90$export$3cdb12c099e58bd1(query)) try {
                let parsedSelectQueryResult = generatedQueryResult;
                finalResult = finalResult.concat(parsedSelectQueryResult["results"].bindings);
                if (parsedSelectQueryResult["results"].bindings.length > 0) return $fc64c962fef42e90$var$paginatedSparqlQueryPromise(endpointUrl, query, pageSize, iteration + 1, timeout, finalResult);
                else return finalResult;
            } catch (error) {
                $8a991e7a11d82128$export$a3bc9b8ed74fc("Error while parsing the query result as SELECT result: ", error, generatedQueryResult);
                throw error;
            }
            else if ($fc64c962fef42e90$export$8b54a6cc6363eda0(query)) {
                finalResult.addAll(generatedQueryResult.statements);
                if (generatedQueryResult.statements.length > 0) return $fc64c962fef42e90$var$paginatedSparqlQueryPromise(endpointUrl, query, pageSize, iteration + 1, timeout, finalResult);
                else return finalResult;
            } else return finalResult;
        } else return finalResult;
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error while paginating the query: ", error);
        throw error;
    }).finally(()=>{
        return finalResult;
    });
}
function $fc64c962fef42e90$export$d6354ffe809edad0(query, pageSize = 100) {
    return $fc64c962fef42e90$var$paginatedSparqlQueryPromise("http://prod-dekalog.inria.fr/sparql", query, pageSize);
}



(0, $hgUW1$dayjs).extend((0, $hgUW1$dayjsplugindurationjs));
(0, $hgUW1$dayjs).extend((0, $hgUW1$dayjspluginrelativeTimejs));
(0, $hgUW1$dayjs).extend((0, $hgUW1$dayjsplugincustomParseFormatjs));
(0, $hgUW1$dayjs).extend((0, $hgUW1$dayjsplugindurationjs));
const $86c4b18dfd9981cd$var$dataFilePrefix = "./data/";
const $86c4b18dfd9981cd$export$acfe9088a868a3b7 = "./data/cache/";
const $86c4b18dfd9981cd$export$7e2698228288ee1d = $ffc2274b02472392$export$aa2c7ad2063c8ec6($86c4b18dfd9981cd$var$dataFilePrefix + "runSets.json");
const $86c4b18dfd9981cd$var$timezoneMap = $ffc2274b02472392$export$aa2c7ad2063c8ec6($86c4b18dfd9981cd$var$dataFilePrefix + "timezoneMap.json");
const $86c4b18dfd9981cd$var$endpointIpMap = $ffc2274b02472392$export$aa2c7ad2063c8ec6($86c4b18dfd9981cd$var$dataFilePrefix + "endpointIpGeoloc.json");
const $86c4b18dfd9981cd$export$31c598d018c7a7e9 = "geolocData";
const $86c4b18dfd9981cd$export$776e8cfc2eab0bb4 = "sparqlCoverageData";
const $86c4b18dfd9981cd$export$f481206edcff624 = "sparqlFeaturesData";
const $86c4b18dfd9981cd$export$8049da97f78fd771 = "vocabEndpointData";
const $86c4b18dfd9981cd$export$c42765cfd861d753 = "endpointKeywordsData";
const $86c4b18dfd9981cd$export$d748c622ce9aa433 = "tripleCountData";
const $86c4b18dfd9981cd$export$61a2d883ed2b87e = "classCountData";
const $86c4b18dfd9981cd$export$8bb9ac0bd733e449 = "propertyCountData";
const $86c4b18dfd9981cd$export$5ab318386d569d9f = "categoryTestCountData";
const $86c4b18dfd9981cd$export$3a5de26904625cee = "totalCategoryTestCountData";
const $86c4b18dfd9981cd$export$bd6675dcbf3d13e3 = "endpointTestsData";
const $86c4b18dfd9981cd$export$77c3cb8c70c0e802 = "totalRuntimeData";
const $86c4b18dfd9981cd$export$73aa59d1e4e4b764 = "averageRuntimeData";
const $86c4b18dfd9981cd$export$9dda46939e07a2c8 = "classPropertyData";
const $86c4b18dfd9981cd$export$cf5152f6d9df51be = "datasetDescriptionData";
const $86c4b18dfd9981cd$export$b62a39d8cba11308 = "shortUriData";
const $86c4b18dfd9981cd$export$81e0991a81036b6f = "rdfDataStructureData";
const $86c4b18dfd9981cd$export$a1b53662e08a6975 = "readableLabelData";
const $86c4b18dfd9981cd$export$e8b173baf7249be8 = "blankNodesData";
const $86c4b18dfd9981cd$export$56ae5d32186e125 = $86c4b18dfd9981cd$var$dataFilePrefix + "knownVocabulariesLOV.json";
let $86c4b18dfd9981cd$var$knownVocabularies = new Set();
function $86c4b18dfd9981cd$export$d57f956200529ac1() {
    return $ffc2274b02472392$export$230442c21b56ff1e("https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/list").then((responseLOV)=>{
        if (responseLOV !== undefined) {
            responseLOV.forEach((item)=>{
                $86c4b18dfd9981cd$var$knownVocabularies.add(item["uri"]);
            });
            try {
                let content = JSON.stringify(responseLOV);
                return $ffc2274b02472392$export$552bfb764b5cd2b4($86c4b18dfd9981cd$export$56ae5d32186e125, content).then(()=>{
                    return Promise.resolve($86c4b18dfd9981cd$var$knownVocabularies);
                });
            } catch (err) {
                $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
                return Promise.reject(err);
            }
        } else return Promise.reject("LOV response is undefined");
    }).then((knownVocabularies)=>$ffc2274b02472392$export$230442c21b56ff1e("http://prefix.cc/context").then((responsePrefixCC)=>{
            for (let prefix of Object.keys(responsePrefixCC["@context"]))knownVocabularies.add(responsePrefixCC["@context"][prefix]);
            return Promise.resolve(knownVocabularies);
        })).then((knownVocabularies)=>$ffc2274b02472392$export$230442c21b56ff1e("https://www.ebi.ac.uk/ols/api/ontologies?page=0&size=1000").then((responseOLS)=>{
            responseOLS["_embedded"].ontologies.forEach((ontologyItem)=>{
                if (ontologyItem.config.baseUris.length > 0) {
                    let ontology = ontologyItem.config.baseUris[0];
                    knownVocabularies.add(ontology);
                }
            });
            return Promise.resolve(knownVocabularies);
        }));
}
function $86c4b18dfd9981cd$var$generateGraphValueFilterClause(graphList) {
    let result = "FILTER( ";
    graphList.forEach((item, i)=>{
        if (i > 0) result += ` || REGEX( str(?g) , '${item}' )`;
        else result += `REGEX( str(?g) , '${item}' )`;
    });
    result += " )";
    return result;
}
function $86c4b18dfd9981cd$export$16baa7a4d0ab148f(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("endpointMapfill", runset.id, " START");
    let endpointGeolocData = [];
    let endpointSet = new Set();
    let endpointTimezoneSPARQL = new Map();
    let endpointLabelMap = new Map();
    let endpointIpMapArray = [];
    // Marked map with the geoloc of each endpoint
    return $86c4b18dfd9981cd$var$endpointIpMap.then((endpointIpMap)=>{
        endpointIpMapArray = endpointIpMap;
        return Promise.resolve();
    }).then(()=>{
        let endpointListForRunsetQuery = `SELECT DISTINCT ?endpoint {
            GRAPH ?g {
                ?base <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint .
                ?metadata <http://ns.inria.fr/kg/index#curated> ?base .
            }
            ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
        }`;
        return $fc64c962fef42e90$export$d6354ffe809edad0(endpointListForRunsetQuery).then((jsonResponse)=>{
            jsonResponse.forEach((itemResponse, i)=>{
                endpointSet.add(itemResponse["endpoint"].value);
            });
            return Promise.resolve();
        });
    }).then(()=>{
        let timezoneSPARQLquery = `SELECT DISTINCT ?timezone ?endpoint { 
            GRAPH ?g { 
                ?base <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . 
                ?metadata <http://ns.inria.fr/kg/index#curated> ?base . 
                ?base <https://schema.org/broadcastTimezone> ?timezone .
            } 
            ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
        }`;
        return $fc64c962fef42e90$export$d6354ffe809edad0(timezoneSPARQLquery).then((jsonResponse)=>{
            if (jsonResponse != undefined) jsonResponse.forEach((itemResponse, i)=>{
                endpointTimezoneSPARQL.set(itemResponse["endpoint"].value, itemResponse["timezone"].value);
            });
            return Promise.resolve();
        });
    }).then(()=>{
        let labelQuery = `SELECT DISTINCT ?label ?endpoint { 
                GRAPH ?g { 
                    ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . 
                    { ?dataset <http://www.w3.org/2000/01/rdf-schema#label> ?label } 
                    UNION { ?dataset <http://www.w3.org/2004/02/skos/core#prefLabel> ?label } 
                    UNION { ?dataset <http://purl.org/dc/terms/title> ?label } 
                    UNION { ?dataset <http://xmlns.com/foaf/0.1/name> ?label } 
                    UNION { ?dataset <http://schema.org/name> ?label } . 
                }  
                ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
            }`;
        return $fc64c962fef42e90$export$90ab2bee66c1c2b(labelQuery).then((responseLabels)=>{
            responseLabels;
            if (responseLabels != undefined) responseLabels.results.bindings.forEach((itemResponse, i)=>{
                endpointLabelMap.set(itemResponse["endpoint"].value, itemResponse["label"].value);
            });
        });
    }).then(()=>{
        let endpointItemMap = new Map();
        return Promise.allSettled(endpointIpMapArray.map((item)=>{
            if (item !== undefined) {
                // Add the markers for each endpoints.
                let endpoint = item.key;
                let endpointItem;
                if (endpointSet.has(endpoint)) return $86c4b18dfd9981cd$var$timezoneMap.then((timeZoneMapArray)=>{
                    let ipTimezoneArrayFiltered = timeZoneMapArray.filter((itemtza)=>itemtza.key == item.value.geoloc.timezone);
                    let ipTimezone;
                    if (ipTimezoneArrayFiltered.length > 0) ipTimezone = ipTimezoneArrayFiltered[0].value.utc_offset.padStart(6, "-").padStart(6, "+");
                    let sparqlTimezone;
                    if (endpointTimezoneSPARQL.get(endpoint) != undefined) sparqlTimezone = endpointTimezoneSPARQL.get(endpoint).padStart(6, "-").padStart(6, "+");
                    endpointItem = {
                        endpoint: endpoint,
                        lat: item.value.geoloc.lat,
                        lon: item.value.geoloc.lon,
                        country: "",
                        region: "",
                        city: "",
                        org: "",
                        timezone: ipTimezone,
                        sparqlTimezone: sparqlTimezone,
                        popupHTML: ""
                    };
                    if (item.value.geoloc.country != undefined) endpointItem.country = item.value.geoloc.country;
                    if (item.value.geoloc.regionName != undefined) endpointItem.region = item.value.geoloc.regionName;
                    if (item.value.geoloc.city != undefined) endpointItem.city = item.value.geoloc.city;
                    if (item.value.geoloc.org != undefined) endpointItem.org = item.value.geoloc.org;
                    endpointItemMap.set(endpoint, endpointItem);
                    return Promise.resolve();
                });
                else return Promise.reject();
            } else return Promise.reject();
        })).then(()=>{
            return Promise.resolve(endpointItemMap);
        });
    }).then((endpointItemMap)=>{
        endpointItemMap.forEach((endpointItem, endpoint)=>{
            let popupString = `<table> <thead> <tr> <th colspan='2'> <a href='${endpointItem.endpoint}' >${endpointItem.endpoint}</a> </th> </tr> </thead></body>`;
            if (endpointItem.country != undefined) popupString += `<tr><td>Country: </td><td>${endpointItem.country}</td></tr>`;
            if (endpointItem.region != undefined) popupString += `<tr><td>Region: </td><td>${endpointItem.region}</td></tr>`;
            if (endpointItem.city != undefined) popupString += `<tr><td>City: </td><td>${endpointItem.city}</td></tr>`;
            if (endpointItem.org != undefined) popupString += `<tr><td>Organization: </td><td>${endpointItem.org}</td></tr>`;
            if (endpointItem.timezone != undefined) {
                popupString += `<tr><td>Timezone of endpoint URL: </td><td>${endpointItem.timezone}</td></tr>`;
                if (endpointItem.sparqlTimezone != undefined) {
                    let badTimezone = endpointItem.timezone.localeCompare(endpointItem.sparqlTimezone) != 0;
                    if (badTimezone) popupString += `<tr><td>Timezone declared by endpoint: </td><td>${endpointItem.sparqlTimezone}</td></tr>`;
                }
            }
            if (endpointLabelMap.get(endpoint) != undefined) {
                let endpointLabel = endpointLabelMap.get(endpoint);
                popupString += `<tr><td colspan='2'>${endpointLabel}</td></tr>`;
            }
            popupString += "</tbody></table>";
            endpointItem.popupHTML = popupString;
        });
        endpointItemMap.forEach((endpointItem, endpoint)=>{
            endpointGeolocData.push(endpointItem);
        });
        return Promise.resolve(endpointGeolocData);
    }).then((endpointGeolocData)=>{
        try {
            let content = JSON.stringify(endpointGeolocData);
            $8a991e7a11d82128$export$a80b3bd66acc52ff("endpointMapfill for", runset.id, "END");
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$31c598d018c7a7e9), content);
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
    });
}
function $86c4b18dfd9981cd$export$c70d9697a8c9e4fd(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("SPARQLCoverageFill", runset.id, " START");
    // Create an histogram of the SPARQLES rules passed by endpoint.
    let sparqlesFeatureQuery = `SELECT DISTINCT ?endpoint ?sparqlNorm (COUNT(DISTINCT ?activity) AS ?count) { 
            GRAPH ?g { 
                { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . }
                UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . }
                UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpoint . }
                ?metadata <http://ns.inria.fr/kg/index#curated> ?curated, ?dataset .
                #OPTIONAL { 
                    { ?dataset <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity . }
                    UNION { ?metadata <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity .}
                    FILTER(CONTAINS(str(?activity), ?sparqlNorm)) 
                    VALUES ?sparqlNorm { "SPARQL10" "SPARQL11" } 
                #} 
            } 
            ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
        } 
        GROUP BY ?endpoint ?sparqlNorm `;
    let jsonBaseFeatureSparqles = [];
    let sparqlFeaturesDataArray = [];
    return $fc64c962fef42e90$export$d6354ffe809edad0(sparqlesFeatureQuery).then((json)=>{
        let endpointSet = new Set();
        let sparql10Map = new Map();
        let sparql11Map = new Map();
        json.forEach((bindingItem, i)=>{
            let endpointUrl = bindingItem["endpoint"].value;
            endpointSet.add(endpointUrl);
            let feature = undefined;
            if (bindingItem["sparqlNorm"] != undefined) feature = bindingItem["sparqlNorm"].value;
            let count = bindingItem["count"].value;
            if (feature == undefined || feature.localeCompare("SPARQL10") == 0) sparql10Map.set(endpointUrl, Number(count));
            if (feature == undefined || feature.localeCompare("SPARQL11") == 0) sparql11Map.set(endpointUrl, Number(count));
        });
        endpointSet.forEach((item)=>{
            let sparql10 = sparql10Map.get(item);
            let sparql11 = sparql11Map.get(item);
            if (sparql10 == undefined) sparql10 = 0;
            if (sparql11 == undefined) sparql11 = 0;
            let sparqlJSONObject = {
                "endpoint": item,
                "sparql10": sparql10,
                "sparql11": sparql11,
                "sparqlTotal": sparql10 + sparql11
            };
            jsonBaseFeatureSparqles.push(sparqlJSONObject);
        });
    }).then(()=>{
        const sparqlFeatureQuery = `SELECT DISTINCT ?endpoint ?activity { 
                GRAPH ?g { 
                    { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpoint . }
                    UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpoint . }
                    UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpoint . }
                    ?metadata <http://ns.inria.fr/kg/index#curated> ?curated, ?dataset .
                    #OPTIONAL { 
                        { ?dataset <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity . }
                        UNION { ?metadata <http://www.w3.org/ns/prov#wasGeneratedBy> ?activity .}
                        FILTER(CONTAINS(str(?activity), ?sparqlNorm)) 
                        VALUES ?sparqlNorm { "SPARQL10" "SPARQL11" } 
                    #} 
                } 
                ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
            } GROUP BY ?endpoint ?activity `;
        let endpointFeatureMap = new Map();
        let featuresShortName = new Map();
        return $fc64c962fef42e90$export$d6354ffe809edad0(sparqlFeatureQuery).then((json)=>{
            endpointFeatureMap = new Map();
            let featuresSet = new Set();
            json.forEach((bindingItem)=>{
                const endpointUrl = bindingItem["endpoint"].value;
                if (!endpointFeatureMap.has(endpointUrl)) endpointFeatureMap.set(endpointUrl, new Set());
                if (bindingItem["activity"] != undefined) {
                    const activity = bindingItem["activity"].value;
                    if (!endpointFeatureMap.has(endpointUrl)) endpointFeatureMap.set(endpointUrl, new Set());
                    featuresSet.add(activity);
                    if (featuresShortName.get(activity) == undefined) featuresShortName.set(activity, activity.replace("https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL10/SPARQLES_", "sparql10:").replace("https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL11/SPARQLES_", "sparql11:").replace(".ttl#activity", ""));
                    endpointFeatureMap.get(endpointUrl).add(featuresShortName.get(activity));
                }
            });
            endpointFeatureMap.forEach((featureSet, endpointUrl, map)=>{
                let sortedFeatureArray = [
                    ...featureSet
                ].sort((a, b)=>a.localeCompare(b));
                sparqlFeaturesDataArray.push({
                    endpoint: endpointUrl,
                    features: sortedFeatureArray
                });
            });
            sparqlFeaturesDataArray.sort((a, b)=>{
                return a.endpoint.localeCompare(b.endpoint);
            });
        });
    }).finally(()=>{
        if (jsonBaseFeatureSparqles.length > 0) try {
            let content = JSON.stringify(jsonBaseFeatureSparqles);
            $hgUW1$writeFileSync($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$776e8cfc2eab0bb4), content);
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
        if (sparqlFeaturesDataArray.length > 0) try {
            let content = JSON.stringify(sparqlFeaturesDataArray);
            $hgUW1$writeFileSync($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$f481206edcff624), content);
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
        $8a991e7a11d82128$export$a80b3bd66acc52ff("SPARQLCoverageFill", runset.id, " END");
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
    });
}
let $86c4b18dfd9981cd$var$endpointVocabMap = new Map();
let $86c4b18dfd9981cd$var$vocabKeywords = new Map();
let $86c4b18dfd9981cd$var$endpointKeywords = new Map();
function $86c4b18dfd9981cd$export$27e383496ec87203() {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("allVocabFill START");
    let sparqlQuery = `SELECT DISTINCT ?endpointUrl ?vocabulary {
        GRAPH ?g {
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated, ?dataset .
            ?dataset <http://rdfs.org/ns/void#vocabulary> ?vocabulary .
        }
    }`;
    return $fc64c962fef42e90$export$d6354ffe809edad0(sparqlQuery).then((json)=>{
        let vocabSet = new Set();
        json.forEach((bindingItem)=>{
            const endpointUrl = bindingItem["endpointUrl"].value;
            const vocabulary = bindingItem["vocabulary"].value;
            if (!$86c4b18dfd9981cd$var$endpointVocabMap.has(endpointUrl)) $86c4b18dfd9981cd$var$endpointVocabMap.set(endpointUrl, []);
            if ($86c4b18dfd9981cd$var$knownVocabularies.has(vocabulary)) {
                $86c4b18dfd9981cd$var$endpointVocabMap.get(endpointUrl).push(vocabulary);
                vocabSet.add(vocabulary);
            }
        });
        return vocabSet;
    }).then((vocabSet)=>{
        let vocabArray = [
            ...vocabSet
        ];
        let queryArray = vocabArray.map((item, i)=>{
            return $ffc2274b02472392$export$230442c21b56ff1e(`https://lov.linkeddata.es/dataset/lov/api/v2/vocabulary/info?vocab=${item}`);
        });
        return Promise.allSettled(queryArray).then((jsonKeywordsArraySettled)=>{
            let jsonKeywordsArray = $ffc2274b02472392$export$4282b215e95fd9cb(jsonKeywordsArraySettled);
            jsonKeywordsArray.forEach((jsonKeywords)=>{
                $8a991e7a11d82128$export$bef1f36f5486a6a3(jsonKeywords);
                if (jsonKeywords !== undefined) {
                    let vocab = jsonKeywords.uri;
                    let keywordList = jsonKeywords.tags;
                    if (keywordList !== undefined) keywordList.forEach((keyword)=>{
                        if (!$86c4b18dfd9981cd$var$vocabKeywords.has(vocab)) $86c4b18dfd9981cd$var$vocabKeywords.set(vocab, []);
                        $86c4b18dfd9981cd$var$vocabKeywords.get(vocab).push(keyword);
                    });
                }
            });
            return Promise.resolve();
        }).then(()=>{
            $86c4b18dfd9981cd$var$endpointVocabMap.forEach((vocabArray, endpointUrl, map)=>{
                let keywordSet = new Set();
                vocabArray.forEach((vocab)=>{
                    if ($86c4b18dfd9981cd$var$vocabKeywords.has(vocab)) $86c4b18dfd9981cd$var$vocabKeywords.get(vocab).forEach((keyword)=>{
                        keywordSet.add(keyword);
                    });
                });
                $86c4b18dfd9981cd$var$endpointKeywords.set(endpointUrl, [
                    ...keywordSet
                ]);
            });
            return Promise.resolve();
        });
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
    });
}
function $86c4b18dfd9981cd$export$8489754ba2a1564a(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("vocabFill", runset.id, " START");
    let runsetsEndpointQuery = `SELECT DISTINCT ?endpointUrl { 
        GRAPH ?g { 
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
        } 
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } 
    GROUP BY ?endpointUrl ?vocabulary `;
    return $fc64c962fef42e90$export$d6354ffe809edad0(runsetsEndpointQuery).then((json)=>{
        if (json !== undefined) {
            let endpointSet = new Set();
            json.forEach((bindingItem)=>{
                const endpointUrl = bindingItem["endpointUrl"].value;
                endpointSet.add(endpointUrl);
            });
            return endpointSet;
        } else return Promise.resolve(new Set());
    }).then((endpointSet)=>{
        let runsetEndpointVocabulary = new Map();
        endpointSet.forEach((endpointUrl)=>{
            runsetEndpointVocabulary.set(endpointUrl, $86c4b18dfd9981cd$var$endpointVocabMap.get(endpointUrl));
        });
        let runsetEndpointKeywords = new Map();
        endpointSet.forEach((endpointUrl)=>{
            runsetEndpointKeywords.set(endpointUrl, $86c4b18dfd9981cd$var$endpointKeywords.get(endpointUrl));
        });
        try {
            let endpointVocabData = [];
            runsetEndpointVocabulary.forEach((vocabArray, endpointUrl, map)=>{
                endpointVocabData.push({
                    endpoint: endpointUrl,
                    vocabularies: vocabArray
                });
            });
            let content = JSON.stringify(endpointVocabData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$8049da97f78fd771), content).then(()=>{
                let endpointKeywordsData = [];
                runsetEndpointKeywords.forEach((keywordArray, endpointUrl, map)=>{
                    endpointKeywordsData.push({
                        endpoint: endpointUrl,
                        keywords: keywordArray
                    });
                });
                let content = JSON.stringify(endpointKeywordsData);
                return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$c42765cfd861d753), content);
            }).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("vocabFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
    });
}
function $86c4b18dfd9981cd$export$78044303c52d154c(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("tripleDataFill", runset.id, " START");
    // Scatter plot of the number of triples through time
    let triplesSPARQLquery = `SELECT DISTINCT ?g ?date ?endpointUrl (MAX(?rawO) AS ?o) {
        GRAPH ?g {
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?curated <http://rdfs.org/ns/void#triples> ?rawO .
        }
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } GROUP BY ?g ?date ?endpointUrl`;
    return $fc64c962fef42e90$export$d6354ffe809edad0(triplesSPARQLquery).then((json)=>{
        let endpointTriplesDataIndex = new Map();
        let endpointTriplesData = [];
        json.forEach((itemResult, i)=>{
            let graph = itemResult["g"].value.replace("http://ns.inria.fr/indegx#", "");
            let date; //= Global.parseDate(itemResult["date"].value);
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
            }
            let endpointUrl = itemResult["endpointUrl"].value;
            let triples = Number.parseInt(itemResult["o"].value);
            if (endpointTriplesDataIndex.get(endpointUrl) == undefined) endpointTriplesDataIndex.set(endpointUrl, new Map());
            if (endpointTriplesDataIndex.get(endpointUrl).get(graph) == undefined) endpointTriplesDataIndex.get(endpointUrl).set(graph, {
                date: date,
                triples: triples
            });
            else {
                let previousDate = endpointTriplesDataIndex.get(endpointUrl).get(graph).date;
                if (date.isBefore(previousDate) && date.year() != previousDate.year() && date.month() != previousDate.month() && date.date() != previousDate.date()) endpointTriplesDataIndex.get(endpointUrl).set(graph, {
                    date: date,
                    triples: triples
                });
            }
        });
        endpointTriplesDataIndex.forEach((graphTripleMap, endpointUrl)=>{
            graphTripleMap.forEach((tripleData, graph)=>{
                endpointTriplesData.push({
                    endpoint: endpointUrl,
                    graph: graph,
                    date: tripleData.date,
                    triples: tripleData.triples
                });
            });
        });
        return Promise.resolve(endpointTriplesData);
    }).then((endpointTriplesData)=>{
        try {
            let content = JSON.stringify(endpointTriplesData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$d748c622ce9aa433), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("tripleDataFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
            return Promise.reject(err);
        }
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject(error);
    });
}
function $86c4b18dfd9981cd$export$2dd4008ac1f64a09(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("classDataFill", runset.id, " START");
    // Scatter plot of the number of classes through time
    let classesSPARQLquery = `SELECT DISTINCT ?g ?endpointUrl ?date (MAX(?rawO) AS ?o) { 
        GRAPH ?g {
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?curated <http://rdfs.org/ns/void#classes> ?rawO .
        }
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } GROUP BY ?g ?endpointUrl ?date`;
    let endpointClassesDataIndex = new Map();
    return $fc64c962fef42e90$export$d6354ffe809edad0(classesSPARQLquery).then((json)=>{
        let endpointClassCountData = [];
        json.forEach((itemResult, i)=>{
            let graph = itemResult["g"].value.replace("http://ns.inria.fr/indegx#", "");
            let date; //= Global.parseDate(itemResult["date"].value);
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
            }
            let endpointUrl = itemResult["endpointUrl"].value;
            let classes = Number.parseInt(itemResult["o"].value);
            if (endpointClassesDataIndex.get(endpointUrl) == undefined) endpointClassesDataIndex.set(endpointUrl, new Map());
            if (endpointClassesDataIndex.get(endpointUrl).get(graph) == undefined) endpointClassesDataIndex.get(endpointUrl).set(graph, {
                date: date,
                classes: classes
            });
            else {
                let previousDate = endpointClassesDataIndex.get(endpointUrl).get(graph).date;
                if (date.isBefore(previousDate) && date.year() != previousDate.year() && date.month() != previousDate.month() && date.date() != previousDate.date()) endpointClassesDataIndex.get(endpointUrl).set(graph, {
                    date: date,
                    classes: classes
                });
            }
        });
        endpointClassesDataIndex.forEach((graphClassesMap, endpointUrl)=>{
            graphClassesMap.forEach((classesData, graph)=>{
                endpointClassCountData.push({
                    endpoint: endpointUrl,
                    graph: graph,
                    date: classesData.date,
                    classes: classesData.classes
                });
            });
        });
        return Promise.resolve(endpointClassCountData);
    }).then((endpointClassCountData)=>{
        try {
            let content = JSON.stringify(endpointClassCountData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$61a2d883ed2b87e), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("classDataFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
            return Promise.reject(err);
        }
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject(error);
    });
}
function $86c4b18dfd9981cd$export$bef24a095c7f4c37(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("propertyDataFill", runset.id, " START");
    // scatter plot of the number of properties through time
    let propertiesSPARQLquery = `SELECT DISTINCT ?g ?date ?endpointUrl (MAX(?rawO) AS ?o) {
        GRAPH ?g {
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?curated <http://rdfs.org/ns/void#properties> ?rawO .
        }
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } GROUP BY ?endpointUrl ?g ?date`;
    let endpointPropertiesDataIndex = new Map();
    return $fc64c962fef42e90$export$d6354ffe809edad0(propertiesSPARQLquery).then((json)=>{
        let endpointPropertyCountData = [];
        json.forEach((itemResult, i)=>{
            let graph = itemResult["g"].value.replace("http://ns.inria.fr/indegx#", "");
            let endpointUrl = itemResult["endpointUrl"].value;
            let properties = Number.parseInt(itemResult["o"].value);
            let date; // = Global.parseDate(itemResult["date"].value);
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
            }
            if (endpointPropertiesDataIndex.get(endpointUrl) == undefined) endpointPropertiesDataIndex.set(endpointUrl, new Map());
            if (endpointPropertiesDataIndex.get(endpointUrl).get(graph) == undefined) endpointPropertiesDataIndex.get(endpointUrl).set(graph, {
                date: date,
                properties: properties
            });
            else {
                let previousDate = endpointPropertiesDataIndex.get(endpointUrl).get(graph).date;
                if (date.isAfter(previousDate)) endpointPropertiesDataIndex.get(endpointUrl).set(graph, {
                    date: date,
                    properties: properties
                });
            }
        });
        endpointPropertiesDataIndex.forEach((graphPropertiesMap, endpointUrl)=>{
            graphPropertiesMap.forEach((propertiesData, graph)=>{
                endpointPropertyCountData.push({
                    endpoint: endpointUrl,
                    graph: graph,
                    date: propertiesData.date,
                    properties: propertiesData.properties
                });
            });
        });
        return Promise.resolve(endpointPropertyCountData);
    }).then((endpointPropertyCountData)=>{
        try {
            let content = JSON.stringify(endpointPropertyCountData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$8bb9ac0bd733e449), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("propertyDataFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
            return Promise.reject(err);
        }
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject(error);
    });
}
function $86c4b18dfd9981cd$export$bd4b142afd880b62(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("categoryTestCountFill", runset.id, " START");
    let testCategoryData = [];
    // Number of tests passed by test categories
    let testCategoryQuery = `SELECT DISTINCT ?g ?date ?category (count(DISTINCT ?test) AS ?count) ?endpointUrl { 
        GRAPH ?g { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?metadata <http://ns.inria.fr/kg/index#trace> ?trace . 
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?trace <http://www.w3.org/ns/earl#test> ?test . 
            ?trace <http://www.w3.org/ns/earl#result> ?result .
            ?result <http://www.w3.org/ns/earl#outcome> <http://www.w3.org/ns/earl#passed> .
            FILTER(STRSTARTS(str(?test), ?category))
            VALUES ?category { 
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/' 
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/extraction/asserted/' 
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/extraction/computed/' 
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sportal/' 
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL10/'
                'https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL11/' 
            }
        }  
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } GROUP BY ?g ?date ?category ?endpointUrl`;
    // {?metadata <http://purl.org/dc/terms/modified> ?date .}
    // UNION { ?curated <http://purl.org/dc/terms/modified> ?date . }
    return $fc64c962fef42e90$export$d6354ffe809edad0(testCategoryQuery).then((json)=>{
        json.forEach((itemResult, i)=>{
            let category = itemResult["category"].value;
            let count = itemResult["count"].value;
            let endpoint = itemResult["endpointUrl"].value;
            let graph = itemResult["g"].value.replace("http://ns.inria.fr/indegx#", "");
            let date; // = Global.parseDate(itemResult["date"].value);
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
            }
            testCategoryData.push({
                category: category,
                graph: graph,
                date: date,
                endpoint: endpoint,
                count: count
            });
        });
        return Promise.resolve();
    }).then(()=>{
        if (testCategoryData.length > 0) try {
            let content = JSON.stringify(testCategoryData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$5ab318386d569d9f), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("categoryTestCountFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject(error);
    });
}
function $86c4b18dfd9981cd$export$2e46526af0a653b5(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("totalCategoryTestCountFill", runset.id, " START");
    // Number of tests passed by test categories
    let testCategoryQuery = `SELECT DISTINCT ?category ?g ?date (count(DISTINCT ?test) AS ?count) ?endpointUrl { 
        GRAPH ?g { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?metadata <http://ns.inria.fr/kg/index#trace> ?trace .
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            ?trace <http://www.w3.org/ns/earl#test> ?test .
            ?trace <http://www.w3.org/ns/earl#result> ?result .
            ?result <http://www.w3.org/ns/earl#outcome> <http://www.w3.org/ns/earl#passed> .
            FILTER(STRSTARTS(str(?test), str(?category))) 
            VALUES ?category {
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/> 
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/extraction/asserted/> 
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/extraction/computed/> 
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sportal/>
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL10/> 
                <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/sparqles/SPARQL11/> 
            } 
        } 
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } 
    GROUP BY ?g ?date ?category ?endpointUrl 
    ORDER BY ?category `;
    // ?metadata <http://purl.org/dc/terms/modified> ?date .
    return $fc64c962fef42e90$export$d6354ffe809edad0(testCategoryQuery).then((json)=>{
        let totalTestCategoryData = [];
        json.forEach((itemResult, i)=>{
            let category = itemResult["category"].value;
            let count = itemResult["count"].value;
            let endpoint = itemResult["endpointUrl"].value;
            let graph = itemResult["g"].value;
            let date; // = Global.parseDate(itemResult["date"].value);
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
            }
            totalTestCategoryData.push({
                category: category,
                endpoint: endpoint,
                graph: graph,
                date: date,
                count: count
            });
            return Promise.resolve(totalTestCategoryData);
        });
    }).then((totalTestCategoryData)=>{
        try {
            let content = JSON.stringify(totalTestCategoryData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$3a5de26904625cee), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("totalCategoryTestCountFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
            return Promise.reject(err);
        }
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject();
    });
}
function $86c4b18dfd9981cd$export$b86fabdae8cc4ea8(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("endpointTestsDataFill", runset.id, " START");
    let appliedTestQuery = `SELECT DISTINCT ?endpointUrl ?g ?date ?rule { 
        GRAPH ?g { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated . 
            ?curated <http://www.w3.org/ns/prov#wasGeneratedBy> ?rule . 
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
        } 
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    }`;
    let endpointGraphTestsIndex = new Map();
    return $fc64c962fef42e90$export$d6354ffe809edad0(appliedTestQuery).then((json)=>{
        let endpointTestsData = [];
        json.forEach((item, i)=>{
            let endpointUrl = item["endpointUrl"].value;
            let rule = item["rule"].value;
            let graph = item["g"].value;
            let date; // = Global.parseDate(item["date"].value);
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
            }
            if (!endpointGraphTestsIndex.has(endpointUrl)) endpointGraphTestsIndex.set(endpointUrl, new Map());
            let graphTestsIndex = endpointGraphTestsIndex.get(endpointUrl);
            if (!graphTestsIndex.has(graph)) graphTestsIndex.set(graph, {
                activity: rule,
                date: date
            });
            else {
                let previousDate = endpointGraphTestsIndex.get(endpointUrl).get(graph).date;
                if (date.isBefore(previousDate)) endpointGraphTestsIndex.get(endpointUrl).set(graph, {
                    activity: rule,
                    date: date
                });
            }
            endpointGraphTestsIndex.forEach((graphTestsIndex, endpointUrl)=>{
                graphTestsIndex.forEach((item, graph)=>{
                    endpointTestsData.push({
                        endpoint: endpointUrl,
                        activity: item.activity,
                        graph: graph,
                        date: item.date
                    });
                });
            });
        });
        return Promise.resolve(endpointTestsData);
    }).then((endpointTestsData)=>{
        try {
            let content = JSON.stringify(endpointTestsData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$bd6675dcbf3d13e3), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("endpointTestsDataFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
            return Promise.reject(err);
        }
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject(error);
    });
}
function $86c4b18dfd9981cd$export$4164c9b1c34b8fc2(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("totalRuntimeDataFill ", runset.id, "START");
    let maxMinTimeQuery = `SELECT DISTINCT ?g ?endpointUrl ?date ?startTime ?endTime { 
        GRAPH ?g { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
            ?metadata <http://ns.inria.fr/kg/index#trace> ?trace . 
            ?trace <http://www.w3.org/ns/prov#startedAtTime> ?startTime .
            ?trace <http://www.w3.org/ns/prov#endedAtTime> ?endTime .
            { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?curated <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl . }
            UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
        }
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } `;
    // ?metadata <http://purl.org/dc/terms/modified> ?date .
    return $fc64c962fef42e90$export$d6354ffe809edad0(maxMinTimeQuery).then((jsonResponse)=>{
        let totalRuntimeData = [];
        let graphEndpointMinStartDateMap = new Map();
        let graphEndpointMaxStartDateMap = new Map();
        jsonResponse.forEach((itemResult, i)=>{
            let graph = itemResult["g"].value.replace("http://ns.inria.fr/indegx#", "");
            let date// = Global.parseDate(itemResult["date"].value);
            ;
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
            }
            let start = $ffc2274b02472392$export$6b862160d295c8e(itemResult["startTime"].value);
            let end = $ffc2274b02472392$export$6b862160d295c8e(itemResult["endTime"].value);
            let endpointUrl = itemResult["endpointUrl"].value;
            $8a991e7a11d82128$export$bef1f36f5486a6a3("totalRuntimeDataFill", runset.id, graph, endpointUrl, date.format(), start.format(), end.format());
            if (!graphEndpointMinStartDateMap.has(graph)) graphEndpointMinStartDateMap.set(graph, new Map());
            if (!graphEndpointMaxStartDateMap.has(graph)) graphEndpointMaxStartDateMap.set(graph, new Map());
            if (!graphEndpointMinStartDateMap.get(graph).has(endpointUrl)) graphEndpointMinStartDateMap.get(graph).set(endpointUrl, start);
            else {
                let previousStart = graphEndpointMinStartDateMap.get(graph).get(endpointUrl);
                if (start.isBefore(previousStart)) graphEndpointMinStartDateMap.get(graph).set(endpointUrl, start);
            }
            if (!graphEndpointMaxStartDateMap.get(graph).has(endpointUrl)) graphEndpointMaxStartDateMap.get(graph).set(endpointUrl, end);
            else {
                let previousEnd = graphEndpointMaxStartDateMap.get(graph).get(endpointUrl);
                if (end.isAfter(previousEnd)) graphEndpointMaxStartDateMap.get(graph).set(endpointUrl, end);
            }
        });
        graphEndpointMinStartDateMap.forEach((endpointMinStartDateMap, graph)=>{
            endpointMinStartDateMap.forEach((minStartDate, endpointUrl)=>{
                let maxStartDate = graphEndpointMaxStartDateMap.get(graph).get(endpointUrl);
                let totalRuntime = maxStartDate.diff(minStartDate, "second");
                totalRuntimeData.push({
                    graph: graph,
                    endpoint: endpointUrl,
                    start: minStartDate,
                    end: maxStartDate,
                    runtime: totalRuntime
                });
            });
        });
        return Promise.resolve(totalRuntimeData);
    }).then((totalRuntimeData)=>{
        try {
            let content = JSON.stringify(totalRuntimeData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$77c3cb8c70c0e802), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("totalRuntimeDataFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
            return Promise.reject(err);
        }
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject(error);
    });
}
function $86c4b18dfd9981cd$export$ccbdac6cb99669e9(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("averageRuntimeDataFill", runset.id, " START");
    let maxMinTimeQuery = `SELECT DISTINCT ?g ?date (MIN(?startTime) AS ?start) (MAX(?endTime) AS ?end) { 
        GRAPH ?g {
            ?metadata <http://ns.inria.fr/kg/index#curated> ?data , ?endpoint .
            ?metadata <http://ns.inria.fr/kg/index#trace> ?trace .
            ?trace <http://www.w3.org/ns/prov#startedAtTime> ?startTime .
            ?trace <http://www.w3.org/ns/prov#endedAtTime> ?endTime .
        }
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    }`;
    // ?metadata <http://purl.org/dc/terms/modified> ?date .
    let numberOfEndpointQuery = `SELECT DISTINCT ?g (COUNT(?endpointUrl) AS ?count) { 
        GRAPH ?g { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?endpoint , ?dataset . 
            { ?endpoint <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
            UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . }
        } 
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } GROUP BY ?g`;
    let averageRuntimeData = [];
    let graphStartEndMap = new Map();
    return Promise.allSettled([
        $fc64c962fef42e90$export$d6354ffe809edad0(maxMinTimeQuery).then((jsonResponse)=>{
            jsonResponse.forEach((itemResult, i)=>{
                let graph = itemResult["g"].value.replace("http://ns.inria.fr/indegx#", "");
                let date; // = Global.parseDate(itemResult["date"].value);
                let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
                if (rawDateUnderscoreIndex != -1) {
                    let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                    date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
                }
                let start = $ffc2274b02472392$export$6b862160d295c8e(itemResult["start"].value);
                let end = $ffc2274b02472392$export$6b862160d295c8e(itemResult["end"].value);
                let runtime = (0, $hgUW1$dayjs).duration(end.diff(start));
                if (graphStartEndMap.get(graph) == undefined) graphStartEndMap.set(graph, {});
                graphStartEndMap.get(graph).start = start;
                graphStartEndMap.get(graph).end = end;
                graphStartEndMap.get(graph).runtime = runtime;
                graphStartEndMap.get(graph).graph = graph;
                graphStartEndMap.get(graph).date = date;
            });
            return Promise.resolve();
        }),
        $fc64c962fef42e90$export$d6354ffe809edad0(numberOfEndpointQuery).then((numberOfEndpointJson)=>{
            numberOfEndpointJson.forEach((numberEndpointItem, i)=>{
                let graph = numberEndpointItem["g"].value;
                graph = graph.replace("http://ns.inria.fr/indegx#", "");
                let count = numberEndpointItem["count"].value;
                if (graphStartEndMap.get(graph) == undefined) graphStartEndMap.set(graph, {});
                graphStartEndMap.get(graph).count = count;
                averageRuntimeData.push(graphStartEndMap.get(graph));
            });
            return Promise.resolve();
        })
    ]).then(()=>{
        if (averageRuntimeData.length > 0) try {
            let content = JSON.stringify(averageRuntimeData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$73aa59d1e4e4b764), content);
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
        $8a991e7a11d82128$export$a80b3bd66acc52ff("averageRuntimeDataFill", runset.id, " END");
        return Promise.resolve();
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject();
    });
}
function $86c4b18dfd9981cd$export$e69e6a32b963a9d(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("classAndPropertiesDataFill ", runset.id, "START");
    let classPartitionQuery = `CONSTRUCT { ?classPartition <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl ;
            <http://rdfs.org/ns/void#class> ?c ;
            <http://rdfs.org/ns/void#triples> ?ct ;
            <http://rdfs.org/ns/void#classes> ?cc ;
            <http://rdfs.org/ns/void#properties> ?cp ;
            <http://rdfs.org/ns/void#distinctSubjects> ?cs ;
            <http://rdfs.org/ns/void#distinctObjects> ?co . 
    } WHERE { 
        GRAPH ?g { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?curated . 
            ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . 
            ?base <http://rdfs.org/ns/void#classPartition> ?classPartition . 
            ?classPartition <http://rdfs.org/ns/void#class> ?c . 
            OPTIONAL { ?classPartition <http://rdfs.org/ns/void#triples> ?ct . } 
            OPTIONAL { ?classPartition <http://rdfs.org/ns/void#classes> ?cc . }
            OPTIONAL { ?classPartition <http://rdfs.org/ns/void#properties> ?cp . } 
            OPTIONAL { ?classPartition <http://rdfs.org/ns/void#distinctSubjects> ?cs . } 
            OPTIONAL { ?classPartition <http://rdfs.org/ns/void#distinctObjects> ?co . } 
            FILTER(! isBlank(?c)) 
        } 
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    }`;
    let classSet = new Set();
    let classCountsEndpointsMap = new Map();
    let classPropertyCountsEndpointsMap = new Map();
    let classContentData = [];
    return $fc64c962fef42e90$export$d6354ffe809edad0(classPartitionQuery).then((classPartitionStore)=>{
        classPartitionStore;
        let classStatements = classPartitionStore.statementsMatching(null, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("class"), null);
        classStatements.forEach((classStatement, i)=>{
            let c = classStatement.subject.value; //item.c.value;
            classSet.add(c);
            classPartitionStore.statementsMatching(classStatement.subject, $78e87bfa2b5916a2$export$5b088def975a652b("endpoint"), null).forEach((classEndpointStatement, i)=>{
                let endpointUrl = classEndpointStatement.object.value;
                if (classCountsEndpointsMap.get(c) == undefined) classCountsEndpointsMap.set(c, {
                    class: c
                });
                classCountsEndpointsMap.get(c).endpoints.add(endpointUrl);
            });
            classPartitionStore.statementsMatching(classStatement.subject, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("triples"), null).forEach((classTriplesStatement, i)=>{
                let ct = Number.parseInt(classTriplesStatement.object.value);
                let currentClassItem = classCountsEndpointsMap.get(c);
                if (classCountsEndpointsMap.get(c).triples == undefined) {
                    currentClassItem.triples = 0;
                    classCountsEndpointsMap.set(c, currentClassItem);
                }
                currentClassItem.triples = currentClassItem.triples + ct;
                classCountsEndpointsMap.set(c, currentClassItem);
            });
            classPartitionStore.statementsMatching(classStatement.subject, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("classes"), null).forEach((classClassesStatement, i)=>{
                let cc = Number.parseInt(classClassesStatement.object.value);
                let currentClassItem = classCountsEndpointsMap.get(c);
                if (classCountsEndpointsMap.get(c).classes == undefined) {
                    currentClassItem.classes = 0;
                    classCountsEndpointsMap.set(c, currentClassItem);
                }
                currentClassItem.classes = currentClassItem.classes + cc;
                classCountsEndpointsMap.set(c, currentClassItem);
            });
            classPartitionStore.statementsMatching(classStatement.subject, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("properties"), null).forEach((classPropertiesStatement, i)=>{
                let cp = Number.parseInt(classPropertiesStatement.object.value);
                let currentClassItem = classCountsEndpointsMap.get(c);
                if (classCountsEndpointsMap.get(c).properties == undefined) {
                    currentClassItem.properties = 0;
                    classCountsEndpointsMap.set(c, currentClassItem);
                }
                currentClassItem.properties = currentClassItem.properties + cp;
                classCountsEndpointsMap.set(c, currentClassItem);
            });
            classPartitionStore.statementsMatching(classStatement.subject, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("distinctSubjects"), null).forEach((classDistinctSubjectsStatement, i)=>{
                let cs = Number.parseInt(classDistinctSubjectsStatement.object.value);
                let currentClassItem = classCountsEndpointsMap.get(c);
                if (classCountsEndpointsMap.get(c).distinctSubjects == undefined) {
                    currentClassItem.distinctSubjects = 0;
                    classCountsEndpointsMap.set(c, currentClassItem);
                }
                currentClassItem.distinctSubjects = currentClassItem.distinctSubjects + cs;
                classCountsEndpointsMap.set(c, currentClassItem);
            });
            classPartitionStore.statementsMatching(classStatement.subject, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("distinctObjects"), null).forEach((classDistinctObjectsStatement, i)=>{
                let co = Number.parseInt(classDistinctObjectsStatement.object.value);
                let currentClassItem = classCountsEndpointsMap.get(c);
                if (classCountsEndpointsMap.get(c).distinctObjects == undefined) {
                    currentClassItem.distinctObjects = 0;
                    classCountsEndpointsMap.set(c, currentClassItem);
                }
                currentClassItem.distinctObjects = currentClassItem.distinctObjects + co;
                classCountsEndpointsMap.set(c, currentClassItem);
            });
            if (classCountsEndpointsMap.get(c).endpoints == undefined) {
                let currentClassItem = classCountsEndpointsMap.get(c);
                currentClassItem.endpoints = new Set();
                classCountsEndpointsMap.set(c, currentClassItem);
            }
        });
        return Promise.resolve();
    }).then(()=>{
        let classPropertyPartitionQuery = `CONSTRUCT {
                ?classPropertyPartition <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl  ;
                    <http://rdfs.org/ns/void#class> ?c ;
                    <http://rdfs.org/ns/void#property> ?p ;
                    <http://rdfs.org/ns/void#triples> ?pt ;
                    <http://rdfs.org/ns/void#distinctSubjects> ?ps ;
                    <http://rdfs.org/ns/void#distinctObjects> ?po .
            } { 
                GRAPH ?g {
                    ?endpoint <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . 
                    ?metadata <http://ns.inria.fr/kg/index#curated> ?endpoint , ?base . 
                    ?base <http://rdfs.org/ns/void#classPartition> ?classPartition . 
                    ?classPartition <http://rdfs.org/ns/void#class> ?c . 
                    ?classPartition <http://rdfs.org/ns/void#propertyPartition> ?classPropertyPartition . 
                    ?classPropertyPartition <http://rdfs.org/ns/void#property> ?p . 
                    OPTIONAL { ?classPropertyPartition <http://rdfs.org/ns/void#triples> ?pt . } 
                    OPTIONAL { ?classPropertyPartition <http://rdfs.org/ns/void#distinctSubjects> ?ps . } 
                    OPTIONAL { ?classPropertyPartition <http://rdfs.org/ns/void#distinctObjects> ?po . } 
                    FILTER(! isBlank(?c)) 
                }
                ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
            }`;
        return $fc64c962fef42e90$export$d6354ffe809edad0(classPropertyPartitionQuery).then((classPropertyStore)=>{
            classPropertyStore;
            classPropertyStore.statementsMatching(null, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("class"), null).forEach((classPropertyStatement, i)=>{
                let partitionNode = classPropertyStatement.subject;
                let c = classPropertyStatement.object.value;
                classSet.add(c);
                if (classPropertyCountsEndpointsMap.get(c) == undefined) classPropertyCountsEndpointsMap.set(c, new Map());
                classPropertyStore.statementsMatching(partitionNode, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("property"), null).forEach((propertyStatement, i)=>{
                    let p = propertyStatement.object.value;
                    if (classPropertyCountsEndpointsMap.get(c).get(p) == undefined) classPropertyCountsEndpointsMap.get(c).set(p, {
                        property: p
                    });
                    classPropertyStore.statementsMatching(partitionNode, $78e87bfa2b5916a2$export$5b088def975a652b("endpoint"), null).forEach((endpointStatement, i)=>{
                        let endpointUrl = endpointStatement.object.value;
                        if (classPropertyCountsEndpointsMap.get(c).get(p).endpoints == undefined) classPropertyCountsEndpointsMap.get(c).get(p).endpoints = new Set();
                        classPropertyCountsEndpointsMap.get(c).get(p).endpoints.add(endpointUrl);
                    });
                    classPropertyStore.statementsMatching(partitionNode, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("triples"), null).forEach((triplesStatement, i)=>{
                        let pt = Number.parseInt(triplesStatement.object.value);
                        if (classPropertyCountsEndpointsMap.get(c).get(p).triples == undefined) classPropertyCountsEndpointsMap.get(c).get(p).triples = 0;
                        classPropertyCountsEndpointsMap.get(c).get(p).triples = classPropertyCountsEndpointsMap.get(c).get(p).triples + pt;
                    });
                    classPropertyStore.statementsMatching(partitionNode, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("distinctSubjects"), null).forEach((distinctSubjectsStatement, i)=>{
                        let ps = Number.parseInt(distinctSubjectsStatement.object.value);
                        if (classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects == undefined) classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects = 0;
                        classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects = classPropertyCountsEndpointsMap.get(c).get(p).distinctSubjects + ps;
                    });
                    classPropertyStore.statementsMatching(partitionNode, $78e87bfa2b5916a2$export$1cd1943b3a73bbe8("distinctObjects"), null).forEach((distinctObjectsStatement, i)=>{
                        let po = Number.parseInt(distinctObjectsStatement.object.value);
                        if (classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects == undefined) classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects = 0;
                        classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects = classPropertyCountsEndpointsMap.get(c).get(p).distinctObjects + po;
                    });
                });
            });
            return Promise.resolve();
        });
    }).then(()=>{
        classSet.forEach((className)=>{
            let classCountItem = classCountsEndpointsMap.get(className);
            let classItem = classCountItem;
            if (classCountItem == undefined) classItem = {
                class: className
            };
            if (classItem.endpoints != undefined) classItem.endpoints = [
                ...classItem.endpoints
            ];
            let classPropertyItem = classPropertyCountsEndpointsMap.get(className);
            if (classPropertyItem != undefined) {
                classItem.propertyPartitions = [];
                classPropertyItem.forEach((propertyPartitionItem, propertyName, map1)=>{
                    propertyPartitionItem.endpoints = [
                        ...propertyPartitionItem.endpoints
                    ];
                    classItem.propertyPartitions.push(propertyPartitionItem);
                });
            }
            classContentData.push(classItem);
        });
        try {
            let content = JSON.stringify(classContentData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$9dda46939e07a2c8), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("classAndPropertiesDataFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
            return Promise.reject(err);
        }
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject(error);
    });
}
function $86c4b18dfd9981cd$export$58a2aa7eec898f2(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("datasetDescriptionDataDataFill", runset.id, " START");
    let provenanceWhoCheckQuery = `SELECT DISTINCT ?endpointUrl ?o { 
        GRAPH ?g { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset . 
            { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
            UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl }
            UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
            OPTIONAL {
                { ?dataset <http://purl.org/dc/terms/creator> ?o }
                UNION { ?dataset <http://purl.org/dc/terms/contributor> ?o }
                UNION { ?dataset <http://purl.org/dc/terms/publisher> ?o }
            }
        }
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    }`;
    let provenanceLicenseCheckQuery = `SELECT DISTINCT ?endpointUrl ?o { 
        GRAPH ?g {
            ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset .
            { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl } 
            UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
            OPTIONAL {
                { ?dataset <http://purl.org/dc/terms/license> ?o } 
                UNION {?dataset <http://purl.org/dc/terms/conformsTo> ?o }
            } 
        }
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } `;
    let provenanceDateCheckQuery = `SELECT DISTINCT ?endpointUrl ?o { 
        GRAPH ?g { 
            ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset . 
            { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl }
            UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
            OPTIONAL {
                { ?dataset <http://purl.org/dc/terms/modified> ?o }
                UNION { ?dataset <http://www.w3.org/ns/prov#wasGeneratedAtTime> ?o } 
                UNION { ?dataset <http://purl.org/dc/terms/issued> ?o }
            }
        }
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } `;
    let provenanceSourceCheckQuery = `SELECT DISTINCT ?endpointUrl ?o {
        GRAPH ?g {
            ?metadata <http://ns.inria.fr/kg/index#curated> ?dataset .
            { ?dataset <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
            UNION { ?dataset <http://www.w3.org/ns/dcat#endpointURL> ?endpointUrl }
            UNION { ?dataset <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl }
            OPTIONAL {
                { ?dataset <http://purl.org/dc/terms/source> ?o } 
                UNION { ?dataset <http://www.w3.org/ns/prov#wasDerivedFrom> ?o }
                UNION { ?dataset <http://purl.org/dc/terms/format> ?o }
            }
        }
        ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
    } `;
    let endpointDescriptionElementMap = new Map();
    return Promise.allSettled([
        $fc64c962fef42e90$export$d6354ffe809edad0(provenanceWhoCheckQuery).then((json)=>{
            json.forEach((item, i)=>{
                let endpointUrl = item["endpointUrl"].value;
                let who = item["o"] != undefined;
                let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                if (currentEndpointItem == undefined) {
                    endpointDescriptionElementMap.set(endpointUrl, {
                        endpoint: endpointUrl
                    });
                    currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                }
                currentEndpointItem.who = who;
                if (who) currentEndpointItem.whoValue = item["o"].value;
                endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
            });
            return Promise.resolve();
        }),
        $fc64c962fef42e90$export$d6354ffe809edad0(provenanceLicenseCheckQuery).then((json)=>{
            json.forEach((item, i)=>{
                let endpointUrl = item["endpointUrl"].value;
                let license = item["o"] != undefined;
                let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                if (currentEndpointItem == undefined) {
                    endpointDescriptionElementMap.set(endpointUrl, {
                        endpoint: endpointUrl
                    });
                    currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                }
                currentEndpointItem.license = license;
                if (license) currentEndpointItem.licenseValue = item["o"].value;
                endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
            });
            return Promise.resolve();
        }).catch((error)=>{
            $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
            return Promise.reject(error);
        }),
        $fc64c962fef42e90$export$d6354ffe809edad0(provenanceDateCheckQuery).then((json)=>{
            json.forEach((item, i)=>{
                let endpointUrl = item["endpointUrl"].value;
                let time = item["o"] != undefined;
                let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                if (currentEndpointItem == undefined) {
                    endpointDescriptionElementMap.set(endpointUrl, {
                        endpoint: endpointUrl
                    });
                    currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                }
                currentEndpointItem.time = time;
                if (time) currentEndpointItem.timeValue = item["o"].value;
                endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
            });
            return Promise.resolve();
        }).catch((error)=>{
            $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
            return Promise.reject(error);
        }),
        $fc64c962fef42e90$export$d6354ffe809edad0(provenanceSourceCheckQuery).then((json)=>{
            json.forEach((item, i)=>{
                let endpointUrl = item["endpointUrl"].value;
                let source = item["o"] != undefined;
                let currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                if (currentEndpointItem == undefined) {
                    endpointDescriptionElementMap.set(endpointUrl, {
                        endpoint: endpointUrl
                    });
                    currentEndpointItem = endpointDescriptionElementMap.get(endpointUrl);
                }
                currentEndpointItem.source = source;
                if (source) currentEndpointItem.sourceValue = item["o"].value;
                endpointDescriptionElementMap.set(endpointUrl, currentEndpointItem);
            });
            return Promise.resolve();
        }).catch((error)=>{
            $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
            return Promise.reject(error);
        })
    ]).then(()=>{
        let datasetDescriptionData = [];
        endpointDescriptionElementMap.forEach((prov, endpoint, map)=>{
            datasetDescriptionData.push(prov);
        });
        return Promise.resolve(datasetDescriptionData);
    }).then((datasetDescriptionData)=>{
        try {
            let content = JSON.stringify(datasetDescriptionData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$cf5152f6d9df51be), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("datasetDescriptionDataDataFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject(error);
    });
}
function $86c4b18dfd9981cd$export$8c439a864a3d1cd1(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("shortUrisDataFill", runset.id, " START");
    let shortUrisMeasureQuery = `SELECT DISTINCT ?g ?date ?endpointUrl ?measure {
            GRAPH ?g {
                { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
                UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
                ?metadata <http://ns.inria.fr/kg/index#curated> ?curated .
                ?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode .
                ?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/shortUris.ttl> .
                ?measureNode <http://www.w3.org/ns/dqv#value> ?measure .
            }
            ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
        } GROUP BY ?g ?date ?endpointUrl ?measure`;
    // ?metadata <http://purl.org/dc/terms/modified> ?date . 
    return $fc64c962fef42e90$export$d6354ffe809edad0(shortUrisMeasureQuery).then((json)=>{
        let shortUriData = [];
        let graphSet = new Set();
        json.forEach((jsonItem, i)=>{
            let endpoint = jsonItem["endpointUrl"].value;
            let shortUriMeasure = Number.parseFloat($ffc2274b02472392$export$bbf2ffbffa00b288(Number.parseFloat(jsonItem["measure"].value) * 100));
            let graph = jsonItem["g"].value.replace("http://ns.inria.fr/indegx#", "");
            let date// = Global.parseDate(jsonItem["date"].value);
            ;
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
            }
            graphSet.add(graph);
            shortUriData.push({
                graph: graph,
                date: date,
                endpoint: endpoint,
                measure: shortUriMeasure
            });
        });
        return Promise.resolve(shortUriData);
    }).then((shortUriData)=>{
        if (shortUriData.length > 0) try {
            let content = JSON.stringify(shortUriData);
            $hgUW1$writeFileSync($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$b62a39d8cba11308), content);
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
        $8a991e7a11d82128$export$a80b3bd66acc52ff("shortUrisDataFill", runset.id, " END");
        return Promise.resolve();
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject(error);
    });
}
function $86c4b18dfd9981cd$export$e9e270353a52a8b8(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("readableLabelsDataFill", runset.id, " START");
    let readableLabelsQuery = `SELECT DISTINCT ?g ?date ?endpointUrl ?measure { 
            GRAPH ?g {
                { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . }
                UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
                ?metadata <http://ns.inria.fr/kg/index#curated> ?curated . 
                ?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode . 
                ?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/readableLabels.ttl> . 
                ?measureNode <http://www.w3.org/ns/dqv#value> ?measure . 
            } 
            ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
        } GROUP BY ?g ?date ?endpointUrl ?measure`;
    // ?metadata <http://purl.org/dc/terms/modified> ?date . 
    return $fc64c962fef42e90$export$d6354ffe809edad0(readableLabelsQuery).then((json)=>{
        let readableLabelData = [];
        json.forEach((jsonItem, i)=>{
            let endpoint = jsonItem["endpointUrl"].value;
            let readableLabelMeasure = Number.parseFloat($ffc2274b02472392$export$bbf2ffbffa00b288(Number.parseFloat(jsonItem["measure"].value) * 100));
            let graph = jsonItem["g"].value.replace("http://ns.inria.fr/indegx#", "");
            let date; // = Global.parseDate(jsonItem["date"].value);
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
            }
            readableLabelData.push({
                graph: graph,
                date: date,
                endpoint: endpoint,
                measure: readableLabelMeasure
            });
        });
        return Promise.resolve(readableLabelData);
    }).then((readableLabelData)=>{
        if (readableLabelData.length > 0) try {
            let content = JSON.stringify(readableLabelData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$a1b53662e08a6975), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("readableLabelsDataFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
        return Promise.resolve();
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
        return Promise.reject(error);
    });
}
function $86c4b18dfd9981cd$export$171d2a27f8f910f2(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("rdfDataStructureDataFill", runset.id, " START");
    let rdfDataStructureQuery = `SELECT DISTINCT ?g ?date ?endpointUrl ?measure { 
            GRAPH ?g {
                { ?curated <http://www.w3.org/ns/sparql-service-description#endpoint> ?endpointUrl . } 
                UNION { ?curated <http://rdfs.org/ns/void#sparqlEndpoint> ?endpointUrl . } 
                ?metadata <http://ns.inria.fr/kg/index#curated> ?curated . 
                ?metadata <http://www.w3.org/ns/dqv#hasQualityMeasurement> ?measureNode . 
                ?measureNode <http://www.w3.org/ns/dqv#isMeasurementOf> <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/RDFDataStructures.ttl> . 
                ?measureNode <http://www.w3.org/ns/dqv#value> ?measure . 
            }
            ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
        } 
        GROUP BY ?g ?date ?endpointUrl ?measure`;
    // ?metadata <http://purl.org/dc/terms/modified> ?date . 
    return $fc64c962fef42e90$export$d6354ffe809edad0(rdfDataStructureQuery).then((json)=>{
        let rdfDataStructureData = [];
        json.forEach((jsonItem, i)=>{
            let endpoint = jsonItem["endpointUrl"].value;
            let rdfDataStructureMeasure = Number.parseFloat($ffc2274b02472392$export$bbf2ffbffa00b288(Number.parseFloat(jsonItem["measure"].value) * 100));
            let graph = jsonItem["g"].value.replace("http://ns.inria.fr/indegx#", "");
            let date; // = Global.parseDate(jsonItem["date"].value);
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                date = $ffc2274b02472392$export$6b862160d295c8e(rawDate, "YYYYMMDD");
            }
            rdfDataStructureData.push({
                graph: graph,
                date: date,
                endpoint: endpoint,
                measure: rdfDataStructureMeasure
            });
        });
        return Promise.resolve(rdfDataStructureData);
    }).then((rdfDataStructureData)=>{
        try {
            let content = JSON.stringify(rdfDataStructureData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$81e0991a81036b6f), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("rdfDataStructureDataFill", runset.id, " END");
                return;
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
        return Promise.resolve();
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
    });
}
function $86c4b18dfd9981cd$export$aa8fab067441ee22(runset) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("blankNodeDataFill", runset.id, " START");
    let blankNodeQuery = `PREFIX dcat: <http://www.w3.org/ns/dcat#>
        PREFIX dct: <http://purl.org/dc/terms/>
        PREFIX sd: <http://www.w3.org/ns/sparql-service-description#>
        PREFIX void: <http://rdfs.org/ns/void#>
        PREFIX kgi: <http://ns.inria.fr/kg/index#>
        PREFIX dqv: <http://www.w3.org/ns/dqv#>
        SELECT DISTINCT ?g ?date ?endpointUrl ?measure { 
            GRAPH ?g {
                ?metadata kgi:curated ?curated . 
                { ?curated sd:endpoint ?endpointUrl . } 
                UNION { ?curated void:sparqlEndpoint ?endpointUrl . } 
                UNION { ?curated dcat:endpointURL ?endpointUrl . } 
    			{ ?metadata dqv:hasQualityMeasurement ?measureNode . }
    			UNION { ?curated dqv:hasQualityMeasurement ?measureNode . }
                ?measureNode dqv:isMeasurementOf <https://raw.githubusercontent.com/Wimmics/dekalog/master/rules/check/blankNodeUsage.ttl> . 
                ?measureNode dqv:value ?measure . 
            }
            ${$86c4b18dfd9981cd$var$generateGraphValueFilterClause(runset.graphs)}
        } 
        GROUP BY ?g ?date ?endpointUrl ?measure`;
    // { ?metadata dct:modified ?date . }
    // UNION { ?curated dct:modified ?date }
    return $fc64c962fef42e90$export$90ab2bee66c1c2b(blankNodeQuery).then((json)=>{
        let blankNodeData = [];
        let graphSet = new Set();
        let graphEndpointDateMeasureMap = new Map();
        json.results.bindings.forEach((jsonItem, i)=>{
            let endpoint = jsonItem.endpointUrl.value;
            let blankNodeMeasure = Number.parseFloat($ffc2274b02472392$export$bbf2ffbffa00b288(Number.parseFloat(jsonItem.measure.value) * 100));
            let graph = jsonItem.g.value.replace("http://ns.inria.fr/indegx#", "");
            let rawDate; //= Global.parseDate(jsonItem.date.value);
            let rawDateUnderscoreIndex = graph.lastIndexOf("_"); // Cheating on the date of the indexation
            if (rawDateUnderscoreIndex != -1) {
                let rawRawDate = graph.substring(rawDateUnderscoreIndex, graph.length);
                rawDate = $ffc2274b02472392$export$6b862160d295c8e(rawRawDate, "YYYYMMDD");
            }
            let date = rawDate.format("YYYY-MM-DD");
            if (!graphEndpointDateMeasureMap.has(graph)) graphEndpointDateMeasureMap.set(graph, new Map());
            if (!graphEndpointDateMeasureMap.get(graph).has(endpoint)) graphEndpointDateMeasureMap.get(graph).set(endpoint, new Map());
            if (!graphEndpointDateMeasureMap.get(graph).get(endpoint).has(date)) graphEndpointDateMeasureMap.get(graph).get(endpoint).set(date, blankNodeMeasure);
            if (graphEndpointDateMeasureMap.get(graph).get(endpoint).has(date) && graphEndpointDateMeasureMap.get(graph).get(endpoint).get(date) < blankNodeMeasure) graphEndpointDateMeasureMap.get(graph).get(endpoint).set(date, blankNodeMeasure);
            graphSet.add(graph);
        });
        graphEndpointDateMeasureMap.forEach((endpointDateMeasureMap, graph)=>{
            endpointDateMeasureMap.forEach((dateMeasureMap, endpoint)=>{
                dateMeasureMap.forEach((measure, date)=>{
                    blankNodeData.push({
                        graph: graph,
                        date: date,
                        endpoint: endpoint,
                        measure: measure
                    });
                });
            });
        });
        return Promise.resolve(blankNodeData);
    }).then((blankNodeData)=>{
        try {
            let content = JSON.stringify(blankNodeData);
            return $ffc2274b02472392$export$552bfb764b5cd2b4($ffc2274b02472392$export$e74e8de8dd192304(runset.id, $86c4b18dfd9981cd$export$e8b173baf7249be8), content).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("blankNodeDataFill", runset.id, " END");
                return Promise.resolve();
            });
        } catch (err) {
            $8a991e7a11d82128$export$a3bc9b8ed74fc(err);
        }
        return Promise.reject();
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
    });
}






function $7f0727dd3bc71455$export$373abb636e55333f(title, legendData, dataNodes, dataLinks) {
    let categories = [];
    legendData.forEach((item, i)=>{
        categories.push({
            name: item
        });
    });
    return {
        title: {
            text: title,
            top: "top",
            left: "center"
        },
        tooltip: {
            show: true,
            confine: true
        },
        legend: {
            data: legendData,
            top: "bottom"
        },
        series: [
            {
                type: "graph",
                layout: "force",
                data: dataNodes,
                links: dataLinks,
                categories: categories,
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
function $7f0727dd3bc71455$export$102a183e61f71aa9(title, legendData, dataNodes, dataLinks) {
    let categories = [];
    legendData.forEach((item, i)=>{
        categories.push({
            name: item
        });
    });
    return {
        title: {
            text: title,
            top: "top",
            left: "center"
        },
        tooltip: {
            show: true,
            confine: true
        },
        legend: {
            data: legendData,
            top: "bottom"
        },
        series: [
            {
                type: "graph",
                layout: "circular",
                circular: {
                    rotateLabel: true
                },
                data: dataNodes,
                links: dataLinks,
                categories: categories,
                roam: true,
                draggable: true,
                label: {
                    position: "right",
                    formatter: "{b}"
                },
                lineStyle: {
                    color: "source",
                    curveness: 0.3
                }
            }
        ]
    };
}
function $7f0727dd3bc71455$export$7c04ef278b754277(title, categories, series) {
    return {
        title: {
            left: "center",
            text: title
        },
        xAxis: {
            type: "category",
            data: categories,
            axisLabel: {
                show: true,
                interval: 0,
                rotate: 27
            }
        },
        yAxis: {},
        series: series,
        tooltip: {
            show: true
        }
    };
}
function $7f0727dd3bc71455$export$cf0e65b2f6ae17a4(title, series) {
    return {
        title: {
            left: "center",
            text: title
        },
        xAxis: {
            type: "time",
            axisLabel: {
                show: true,
                interval: 0,
                rotate: 27
            }
        },
        yAxis: {},
        series: series,
        tooltip: {
            show: true
        }
    };
}
function $7f0727dd3bc71455$export$8c0fd4d4fb408619(dataMap) {
    let series = [];
    dataMap.forEach((value, key, map)=>{
        let chartSerie = {
            name: key,
            label: {
                show: false
            },
            symbolSize: 5,
            data: [
                ...new Set(value)
            ].filter((a)=>a[0] !== null && a[0] !== undefined).sort((a, b)=>a[0].localeCompare(b[0])),
            type: "line"
        };
        series.push(chartSerie);
    });
    return series;
}




const $9826f49ddc647f24$var$numberOfVocabulariesLimit = 1000;
const $9826f49ddc647f24$export$5232ea905f675d65 = "sparqlCoverageEchartsOption";
const $9826f49ddc647f24$export$8a1239a90477d84f = "sparql10CoverageEchartsOption";
const $9826f49ddc647f24$export$1475f0f720ebbee1 = "sparql11CoverageEchartsOption";
const $9826f49ddc647f24$export$368b16ad73eea9b2 = "vocabEndpointEchartsOption";
const $9826f49ddc647f24$export$b3bf9f661942f4a6 = "triplesEchartOption";
const $9826f49ddc647f24$export$203fcf63ac3b1903 = "classesEchartOption";
const $9826f49ddc647f24$export$c7bdb7dbca4bc4cd = "propertiesEchartOption";
const $9826f49ddc647f24$export$240ecbd3e822ec59 = "shortUrisEchartOption";
const $9826f49ddc647f24$export$3f2632b7367e6100 = "rdfDataStructuresEchartOption";
const $9826f49ddc647f24$export$4ac3a23fdb8b9d57 = "readableLabelsEchartOption";
const $9826f49ddc647f24$export$661a2c3b9861cb0e = "blankNodesEchartOption";
const $9826f49ddc647f24$export$18d97433d9d76860 = "datasetDescriptionEchartOption";
const $9826f49ddc647f24$export$a9880d7f91a2a4c8 = "totalRuntimeEchartsOption";
const $9826f49ddc647f24$export$cc0a9fc1a70de46d = "keywordEndpointEchartsOption";
const $9826f49ddc647f24$export$99d8ce4a1bca824a = "standardVocabulariesEndpointGraphEchartsOption";
let $9826f49ddc647f24$var$whiteListData;
let $9826f49ddc647f24$var$geolocData;
let $9826f49ddc647f24$var$sparqlFeaturesData;
let $9826f49ddc647f24$var$knownVocabData;
let $9826f49ddc647f24$var$vocabKeywordData;
let $9826f49ddc647f24$var$classCountData;
let $9826f49ddc647f24$var$propertyCountData;
let $9826f49ddc647f24$var$tripleCountData;
let $9826f49ddc647f24$var$shortUrisData;
let $9826f49ddc647f24$var$rdfDataStructureData;
let $9826f49ddc647f24$var$readableLabelData;
let $9826f49ddc647f24$var$blankNodesData;
let $9826f49ddc647f24$var$classPropertyData;
let $9826f49ddc647f24$var$datasetDescriptionData;
let $9826f49ddc647f24$var$sparqlFeatureDesc;
function $9826f49ddc647f24$export$6c4170db1877f301(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$776e8cfc2eab0bb4), "utf8").then((sparqlCoverageCountRawData)=>{
        const sparqlCoverageCountData = JSON.parse(sparqlCoverageCountRawData);
        let maxSparql10 = 25;
        let maxSparql11 = 19;
        let maxSparqlTotal = maxSparql10 + maxSparql11;
        let chart10ValueMap = new Map();
        let chart11ValueMap = new Map();
        let chartSPARQLValueMap = new Map();
        for(let i = -1; i < 10; i++){
            chart10ValueMap.set(i, 0);
            chart11ValueMap.set(i, 0);
            chartSPARQLValueMap.set(i, 0);
        }
        let sparql10Step = maxSparql10 / 10;
        let sparql11Step = maxSparql11 / 10;
        let sparqlTotalStep = maxSparqlTotal / 10;
        sparqlCoverageCountData.forEach((item)=>{
            let itemBinSparql10 = -1;
            if (item.sparql10 > 0) {
                itemBinSparql10 = Math.floor(item.sparql10 / sparql10Step);
                if (itemBinSparql10 == 10) itemBinSparql10 = 9;
            }
            chart10ValueMap.set(itemBinSparql10, chart10ValueMap.get(itemBinSparql10) + 1);
            let itemBinSparql11 = -1;
            if (item.sparql11 > 0) {
                itemBinSparql11 = Math.floor(item.sparql11 / sparql11Step);
                if (itemBinSparql11 == 10) itemBinSparql11 = 9;
            }
            chart11ValueMap.set(itemBinSparql11, chart11ValueMap.get(itemBinSparql11) + 1);
            let itemBinSparqlTotal = -1;
            if (item.sparql11 > 0 || item.sparql10 > 0) {
                itemBinSparqlTotal = Math.floor(item.sparqlTotal / sparqlTotalStep);
                if (itemBinSparqlTotal == 10) itemBinSparqlTotal = 9;
            }
            chartSPARQLValueMap.set(itemBinSparqlTotal, chartSPARQLValueMap.get(itemBinSparqlTotal) + 1);
        });
        let chart10DataMap = new Map();
        let chart11DataMap = new Map();
        let chartSPARQLDataMap = new Map();
        let categorySet = new Set();
        chart10ValueMap.forEach((binCount, itemBin, map)=>{
            let categoryName = "[ " + (itemBin * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            if (itemBin == 0) categoryName = "] " + (itemBin * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            if (itemBin == -1) categoryName = "[ 0% ]";
            categorySet.add(categoryName);
            chart10DataMap.set(categoryName, binCount);
        });
        chart11ValueMap.forEach((binCount, itemBin, map)=>{
            let categoryName = "[ " + (itemBin * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            if (itemBin == 0) categoryName = "] " + (itemBin * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            if (itemBin == -1) categoryName = "[ 0% ]";
            categorySet.add(categoryName);
            chart11DataMap.set(categoryName, binCount);
        });
        chartSPARQLValueMap.forEach((binCount, itemBin, map)=>{
            let categoryName = "[ " + (itemBin * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            if (itemBin == 0) categoryName = "] " + (itemBin * 10).toString() + "%, " + ((itemBin + 1) * 10).toString() + " % ]";
            if (itemBin == -1) categoryName = "[ 0% ]";
            categorySet.add(categoryName);
            chartSPARQLDataMap.set(categoryName, binCount);
        });
        // let categories = ([...categorySet]).sort((a, b) => a.localeCompare(b));
        let sparql10Series = [];
        chart10DataMap.forEach((percentage, category, map)=>{
            sparql10Series.push({
                name: category,
                type: "bar",
                data: [
                    percentage
                ],
                label: {
                    show: true,
                    formatter: "{a}",
                    verticalAlign: "bottom",
                    position: "top"
                }
            });
        });
        let sparql11Series = [];
        chart11DataMap.forEach((percentage, category, map)=>{
            sparql11Series.push({
                name: category,
                type: "bar",
                data: [
                    percentage
                ],
                label: {
                    show: true,
                    formatter: "{a}",
                    verticalAlign: "bottom",
                    position: "top"
                }
            });
        });
        let sparqlCategorySeries = [];
        chartSPARQLDataMap.forEach((percentage, category, map)=>{
            sparqlCategorySeries.push({
                name: category,
                type: "bar",
                data: [
                    percentage
                ],
                label: {
                    show: true,
                    formatter: "{a}",
                    verticalAlign: "bottom",
                    position: "top"
                }
            });
        });
        let sparql10ChartOption = {
            title: {
                left: "center",
                text: "Number of endpoints according to\n their coverage of SPARQL 1.0 features",
                textStyle: {
                    overflow: "breakAll",
                    width: "80%"
                }
            },
            legend: {
                show: false
            },
            toolbox: {
                show: false
            },
            tooltip: {
                show: true
            },
            xAxis: {
                type: "category",
                data: [
                    "Endpoints supporting SPARQL 1.0 features"
                ],
                show: false,
                splitLine: {
                    show: false
                },
                splitArea: {
                    show: false
                }
            },
            yAxis: {
                type: "value",
                max: "dataMax"
            },
            color: [
                "#060705ff",
                "#10200Eff",
                "#1A3917ff",
                "#245121ff",
                "#2E6A2Aff",
                "#388333ff",
                "#419C3Cff",
                "#4BB545ff",
                "#55CD4Fff",
                "#5FE658ff",
                "#69FF61ff"
            ],
            series: sparql10Series
        };
        let sparql11ChartOption = {
            title: {
                left: "center",
                text: "Number of endpoints according to\n their coverage of SPARQL 1.1 features",
                textStyle: {
                    overflow: "breakAll",
                    width: "80%"
                }
            },
            legend: {
                show: false
            },
            toolbox: {
                show: false
            },
            tooltip: {
                show: true
            },
            xAxis: {
                type: "category",
                data: [
                    "Endpoints supporting SPARQL 1.1 features"
                ],
                show: false,
                splitLine: {
                    show: false
                },
                splitArea: {
                    show: false
                }
            },
            yAxis: {
                type: "value",
                max: "dataMax"
            },
            color: [
                "#060705ff",
                "#10200Eff",
                "#1A3917ff",
                "#245121ff",
                "#2E6A2Aff",
                "#388333ff",
                "#419C3Cff",
                "#4BB545ff",
                "#55CD4Fff",
                "#5FE658ff",
                "#69FF61ff"
            ],
            series: sparql11Series
        };
        let sparqlChartOption = {
            title: {
                left: "center",
                text: "Number of endpoints according to\n their coverage of all SPARQL features",
                textStyle: {
                    overflow: "breakAll",
                    width: "80%"
                }
            },
            legend: {
                show: false
            },
            toolbox: {
                show: false
            },
            tooltip: {
                show: true
            },
            xAxis: {
                type: "category",
                data: [
                    "Endpoints supporting SPARQL 1.0 and 1.1 features"
                ],
                splitLine: {
                    show: false
                },
                splitArea: {
                    show: false
                },
                show: false
            },
            yAxis: {
                type: "value",
                max: "dataMax"
            },
            color: [
                "#060705ff",
                "#10200Eff",
                "#1A3917ff",
                "#245121ff",
                "#2E6A2Aff",
                "#388333ff",
                "#419C3Cff",
                "#4BB545ff",
                "#55CD4Fff",
                "#5FE658ff",
                "#69FF61ff"
            ],
            series: sparqlCategorySeries
        };
        return Promise.allSettled([
            (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$8a1239a90477d84f), JSON.stringify(sparql10ChartOption)).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("SPARQL 1.0 chart data for", runsetId, " generated");
            }),
            (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$1475f0f720ebbee1), JSON.stringify(sparql11ChartOption)).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("SPARQL 1.1 chart data for", runsetId, " generated");
            }),
            (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$5232ea905f675d65), JSON.stringify(sparqlChartOption)).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("SPARQL chart data for", runsetId, " generated");
            })
        ]).then(()=>{
            return Promise.resolve();
        });
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during sparql cached data reading", error);
    });
}
function $9826f49ddc647f24$export$1c443380fda47baf(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$8049da97f78fd771), "utf-8").then((vocabEndpointRawData)=>{
        let vocabEndpointData = JSON.parse(vocabEndpointRawData);
        // Create an force graph with the graph linked by co-ocurrence of vocabularies
        // Endpoint and vocabularies graph
        let linkArray = [];
        let nodeArray = [];
        let vocabularySet = new Set();
        let endpointSet = new Set();
        vocabEndpointData.forEach((item, i)=>{
            let endpoint = item.endpoint;
            let vocabularies = item.vocabularies;
            if (vocabularies !== undefined) {
                endpointSet.add(endpoint);
                vocabularies.forEach((vocab)=>{
                    vocabularySet.add(vocab);
                    linkArray.push({
                        source: endpoint,
                        target: vocab
                    });
                });
            }
        });
        endpointSet.forEach((endpoint)=>{
            nodeArray.push({
                name: endpoint,
                category: "Endpoint",
                symbolSize: 5
            });
        });
        vocabularySet.forEach((vocab)=>{
            nodeArray.push({
                name: vocab,
                category: "Vocabulary",
                symbolSize: 5
            });
        });
        if (nodeArray.length > 0 && linkArray.length > 0) {
            let content = JSON.stringify($7f0727dd3bc71455$export$373abb636e55333f("Endpoints and vocabularies*", [
                "Vocabulary",
                "Endpoint"
            ], nodeArray, linkArray));
            return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$368b16ad73eea9b2), content);
        } else return Promise.reject("No data to generate the vocabulary graph for " + runsetId);
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during vocab graph data reading", error);
    });
}
function $9826f49ddc647f24$export$656da41063ce34d0(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$c42765cfd861d753), "utf-8").then((endpointKeywordsRawData)=>{
        let endpointKeywordData = JSON.parse(endpointKeywordsRawData);
        // Endpoint and keywords graph
        let linkArray = [];
        let nodeArray = [];
        let keywordSet = new Set();
        let endpointSet = new Set();
        endpointKeywordData.forEach((item, i)=>{
            let endpoint = item.endpoint;
            let keywords = item.keywords;
            if (keywords !== undefined) {
                endpointSet.add(endpoint);
                keywords.forEach((vocab)=>{
                    keywordSet.add(vocab);
                    linkArray.push({
                        source: endpoint,
                        target: vocab
                    });
                });
            }
        });
        endpointSet.forEach((endpoint)=>{
            nodeArray.push({
                name: endpoint,
                category: "Endpoint",
                symbolSize: 5
            });
        });
        keywordSet.forEach((vocab)=>{
            nodeArray.push({
                name: vocab,
                category: "Keyword",
                symbolSize: 5
            });
        });
        if (nodeArray.length > 0 && linkArray.length > 0) {
            let content = JSON.stringify($7f0727dd3bc71455$export$373abb636e55333f("Endpoints and keywords of their vocabularies", [
                "Keyword",
                "Endpoint"
            ], nodeArray, linkArray));
            return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$cc0a9fc1a70de46d), content);
        } else return Promise.reject("No data to generate the keyword graph for " + runsetId);
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during keyword graph data reading", error);
    });
}
function $9826f49ddc647f24$export$d55a4bb131fed90d(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$8049da97f78fd771), "utf-8").then((vocabEndpointRawData)=>{
        let vocabEndpointData = JSON.parse(vocabEndpointRawData);
        let vocabStandardSet = new Set();
        let vocabStandardNameMap = new Map([
            [
                "http://www.w3.org/1999/02/22-rdf-syntax-ns#",
                "RDF"
            ],
            [
                "http://www.w3.org/2000/01/rdf-schema#",
                "RDFS"
            ],
            [
                "http://www.w3.org/ns/shacl#",
                "SHACL"
            ],
            [
                "http://www.w3.org/2002/07/owl#",
                "OWL"
            ],
            [
                "http://www.w3.org/2004/02/skos/core#",
                "SKOS"
            ],
            [
                "http://spinrdf.org/spin#",
                "SPIN"
            ],
            [
                "http://www.w3.org/2003/11/swrl#",
                "SWRL"
            ]
        ]);
        vocabStandardNameMap.forEach((value, key, map)=>{
            vocabStandardSet.add(key);
        });
        // Endpoint and vocabularies graph
        let linkArray = [];
        let nodeArray = [];
        let vocabSet = new Set();
        let endpointSet = new Set();
        vocabEndpointData.forEach((item, i)=>{
            let endpoint = item.endpoint;
            let vocabularies = item.vocabularies;
            if (vocabularies !== undefined) {
                endpointSet.add(endpoint);
                vocabularies.forEach((vocab)=>{
                    if (vocabStandardSet.has(vocab)) {
                        vocabSet.add(vocab);
                        linkArray.push({
                            source: vocab,
                            target: endpoint
                        });
                    }
                });
            }
        });
        endpointSet.forEach((endpoint)=>{
            nodeArray.push({
                name: endpoint,
                category: "Endpoint",
                symbolSize: 5
            });
        });
        vocabSet.forEach((vocab)=>{
            nodeArray.push({
                name: vocab,
                category: vocabStandardNameMap.get(vocab),
                symbolSize: 5
            });
        });
        if (nodeArray.length > 0 && linkArray.length > 0) {
            let categoryArray = [
                ...vocabStandardSet
            ].map((vocab)=>vocabStandardNameMap.get(vocab));
            categoryArray.push("Endpoint");
            let content = JSON.stringify($7f0727dd3bc71455$export$102a183e61f71aa9("Endpoints and meta-vocabularies", categoryArray, nodeArray, linkArray));
            return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$99d8ce4a1bca824a), content);
        } else return Promise.reject("No data to generate the vocabulary graph for " + runsetId);
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during vocab graph data reading", error);
    });
}
function $9826f49ddc647f24$export$ee72fc4ede93c668(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$d748c622ce9aa433), "utf-8").then((tripleCountRawData)=>{
        $9826f49ddc647f24$var$tripleCountData = JSON.parse(tripleCountRawData);
        // Scatter plot of the number of triples through time
        let endpointDataSerieMap = new Map();
        $9826f49ddc647f24$var$tripleCountData.forEach((itemResult, i)=>{
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        $9826f49ddc647f24$var$tripleCountData.forEach((itemResult, i)=>{
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let triples = itemResult.triples;
            endpointDataSerieMap.get(endpointUrl).push([
                date,
                triples
            ]);
        });
        if (endpointDataSerieMap.size > 0) {
            let triplesSeries = $7f0727dd3bc71455$export$8c0fd4d4fb408619(endpointDataSerieMap);
            return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$b3bf9f661942f4a6), JSON.stringify($7f0727dd3bc71455$export$cf0e65b2f6ae17a4("Size of the datasets", triplesSeries))).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("Triple chart data for", runsetId, " generated");
            });
        } else return Promise.reject("No data to generate the triple graph for " + runsetId);
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during triple data reading", error);
    });
}
function $9826f49ddc647f24$export$fd98b1913a15077f(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$61a2d883ed2b87e), "utf-8").then((classesCountRawData)=>{
        $9826f49ddc647f24$var$classCountData = JSON.parse(classesCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        $9826f49ddc647f24$var$classCountData.forEach((itemResult, i)=>{
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        $9826f49ddc647f24$var$classCountData.forEach((itemResult, i)=>{
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let classes = itemResult.classes;
            endpointDataSerieMap.get(endpointUrl).push([
                date,
                classes
            ]);
        });
        if (endpointDataSerieMap.size > 0) {
            let classesSeries = $7f0727dd3bc71455$export$8c0fd4d4fb408619(endpointDataSerieMap);
            return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$203fcf63ac3b1903), JSON.stringify($7f0727dd3bc71455$export$cf0e65b2f6ae17a4("Number of classes in the datasets", classesSeries))).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("Class chart data for", runsetId, " generated");
            });
        } else return Promise.reject("No data to generate the classes graph for " + runsetId);
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during classes data reading", error);
    });
}
function $9826f49ddc647f24$export$feac2169b990f705(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$8bb9ac0bd733e449), "utf-8").then((propertiesCountRawData)=>{
        $9826f49ddc647f24$var$propertyCountData = JSON.parse(propertiesCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        $9826f49ddc647f24$var$propertyCountData.forEach((itemResult, i)=>{
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        $9826f49ddc647f24$var$propertyCountData.forEach((itemResult, i)=>{
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let properties = itemResult.properties;
            endpointDataSerieMap.get(endpointUrl).push([
                date,
                properties
            ]);
        });
        if (endpointDataSerieMap.size > 0) {
            let propertiesSeries = $7f0727dd3bc71455$export$8c0fd4d4fb408619(endpointDataSerieMap);
            return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$c7bdb7dbca4bc4cd), JSON.stringify($7f0727dd3bc71455$export$cf0e65b2f6ae17a4("Number of properties in the datasets", propertiesSeries))).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("Property chart data for", runsetId, " generated");
            });
        } else return Promise.reject("No data to generate the properties graph for " + runsetId);
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during properties data reading", error);
    });
}
function $9826f49ddc647f24$export$c50476c152d07291(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$b62a39d8cba11308), "utf-8").then((shortUrisCountRawData)=>{
        $9826f49ddc647f24$var$shortUrisData = JSON.parse(shortUrisCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        $9826f49ddc647f24$var$shortUrisData.forEach((itemResult, i)=>{
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        $9826f49ddc647f24$var$shortUrisData.forEach((itemResult, i)=>{
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let shortUris = itemResult.measure;
            endpointDataSerieMap.get(endpointUrl).push([
                date,
                shortUris
            ]);
        });
        if (endpointDataSerieMap.size > 0) {
            let shortUrisSeries = $7f0727dd3bc71455$export$8c0fd4d4fb408619(endpointDataSerieMap);
            return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$240ecbd3e822ec59), JSON.stringify($7f0727dd3bc71455$export$cf0e65b2f6ae17a4("Proportion of short URIs in the datasets", shortUrisSeries))).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("Short URIs chart data for", runsetId, " generated");
            });
        } else return Promise.reject("No data to generate the Short URIs graph for " + runsetId);
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during Short URIs data reading", error);
    });
}
function $9826f49ddc647f24$export$ac77b7438a17c958(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$81e0991a81036b6f), "utf-8").then((rdfDataStructuresCountRawData)=>{
        $9826f49ddc647f24$var$rdfDataStructureData = JSON.parse(rdfDataStructuresCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        $9826f49ddc647f24$var$rdfDataStructureData.forEach((itemResult, i)=>{
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        $9826f49ddc647f24$var$rdfDataStructureData.forEach((itemResult, i)=>{
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let rdfDatastructures = itemResult.measure;
            endpointDataSerieMap.get(endpointUrl).push([
                date,
                rdfDatastructures
            ]);
        });
        if (endpointDataSerieMap.size > 0) {
            let rdfDataStructuresSeries = $7f0727dd3bc71455$export$8c0fd4d4fb408619(endpointDataSerieMap);
            return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$3f2632b7367e6100), JSON.stringify($7f0727dd3bc71455$export$cf0e65b2f6ae17a4("Proportion of RDF data structures in the datasets", rdfDataStructuresSeries))).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("RDF data structures chart data generated");
            });
        } else return Promise.reject("No data to generate the RDF data structures chart for " + runsetId);
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during RDF data structures data reading", error);
    });
}
function $9826f49ddc647f24$export$328b5d2526e5f967(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$a1b53662e08a6975), "utf-8").then((readableLabelsCountRawData)=>{
        $9826f49ddc647f24$var$readableLabelData = JSON.parse(readableLabelsCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        $9826f49ddc647f24$var$readableLabelData.forEach((itemResult, i)=>{
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        $9826f49ddc647f24$var$readableLabelData.forEach((itemResult, i)=>{
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let readableLabels = itemResult.measure;
            endpointDataSerieMap.get(endpointUrl).push([
                date,
                readableLabels
            ]);
        });
        if (endpointDataSerieMap.size > 0) {
            let readableLabelsSeries = $7f0727dd3bc71455$export$8c0fd4d4fb408619(endpointDataSerieMap);
            return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$4ac3a23fdb8b9d57), JSON.stringify($7f0727dd3bc71455$export$cf0e65b2f6ae17a4("Proportion of resources with readable labels in the datasets", readableLabelsSeries))).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("Readable labels chart data for", runsetId, " generated");
            });
        } else return Promise.reject("No data to generate the readable labels chart for " + runsetId);
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during RDF data structures data reading for", runsetId, "", error);
    });
}
function $9826f49ddc647f24$export$c369fa4ac53895cc(runsetId) {
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$e8b173baf7249be8), "utf-8").then((blankNodesCountRawData)=>{
        $9826f49ddc647f24$var$blankNodesData = JSON.parse(blankNodesCountRawData);
        // Scatter plot of the number of classes through time
        let endpointDataSerieMap = new Map();
        $9826f49ddc647f24$var$blankNodesData.forEach((itemResult, i)=>{
            let endpointUrl = itemResult.endpoint;
            endpointDataSerieMap.set(endpointUrl, []);
        });
        $9826f49ddc647f24$var$blankNodesData.forEach((itemResult, i)=>{
            let date = itemResult.date;
            let endpointUrl = itemResult.endpoint;
            let blankNodes = itemResult.measure;
            endpointDataSerieMap.get(endpointUrl).push([
                date,
                blankNodes
            ]);
        });
        if (endpointDataSerieMap.size > 0) {
            let blankNodesSeries = $7f0727dd3bc71455$export$8c0fd4d4fb408619(endpointDataSerieMap);
            return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$661a2c3b9861cb0e), JSON.stringify($7f0727dd3bc71455$export$cf0e65b2f6ae17a4("Proportion of blank nodes in the datasets", blankNodesSeries))).then(()=>{
                $8a991e7a11d82128$export$a80b3bd66acc52ff("Blank nodes chart data for", runsetId, " generated");
            });
        } else return Promise.reject("No data to generate the blank nodes chart for " + runsetId);
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during blank nodes data reading", error);
    });
}
function $9826f49ddc647f24$export$a3f65f7dcfb9e7b6(runsetId) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("Dataset description chart data for", runsetId, " generation started");
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $86c4b18dfd9981cd$export$cf5152f6d9df51be), "utf-8").then((datasetDescriptionRawData)=>{
        $9826f49ddc647f24$var$datasetDescriptionData = JSON.parse(datasetDescriptionRawData);
        let whoDataScore = 0;
        let licenseDataScore = 0;
        let timeDataScore = 0;
        let sourceDataScore = 0;
        $9826f49ddc647f24$var$datasetDescriptionData.forEach((dataItem)=>{
            let who = dataItem.who;
            if (who) whoDataScore++;
            let license = dataItem.license;
            if (license) licenseDataScore++;
            let time = dataItem.time;
            if (time) timeDataScore++;
            let source = dataItem.source;
            if (source) sourceDataScore++;
        });
        let whoTrueDataSerie = {
            name: "Description of author",
            type: "bar",
            stack: "who",
            colorBy: "data",
            data: [
                {
                    value: whoDataScore,
                    name: "Presence of the description of creator/owner/contributor"
                }
            ]
        };
        if (whoDataScore > 0) whoTrueDataSerie.label = {
            show: true,
            formatter: "{c} endpoints with author description"
        };
        let whoFalseDataSerie = {
            name: "Description of author",
            type: "bar",
            stack: "who",
            colorBy: "data",
            data: [
                {
                    value: $9826f49ddc647f24$var$datasetDescriptionData.length - whoDataScore,
                    name: "Absence of the description of creator/owner/contributor"
                }
            ]
        };
        if ($9826f49ddc647f24$var$datasetDescriptionData.length - whoDataScore > 0) whoFalseDataSerie.label = {
            show: true,
            formatter: "{c} endpoints without author description"
        };
        let licenseTrueDataSerie = {
            name: "Licensing description",
            type: "bar",
            stack: "license",
            colorBy: "data",
            data: [
                {
                    value: licenseDataScore,
                    name: "Presence of licensing information"
                }
            ]
        };
        if (licenseDataScore > 0) licenseTrueDataSerie.label = {
            show: true,
            formatter: "{c} endpoints with licensing description"
        };
        let licenseFalseDataSerie = {
            name: "Licensing description",
            type: "bar",
            stack: "license",
            colorBy: "data",
            data: [
                {
                    value: $9826f49ddc647f24$var$datasetDescriptionData.length - licenseDataScore,
                    name: "Absence of licensing description"
                }
            ]
        };
        if ($9826f49ddc647f24$var$datasetDescriptionData.length - licenseDataScore > 0) licenseFalseDataSerie.label = {
            show: true,
            formatter: "{c} endpoints without licensing description"
        };
        let timeTrueDataSerie = {
            name: "Time related description of the creation of the dataset",
            type: "bar",
            stack: "time",
            colorBy: "data",
            data: [
                {
                    value: timeDataScore,
                    name: "Presence of time-related information"
                }
            ]
        };
        if (timeDataScore > 0) timeTrueDataSerie.label = {
            show: true,
            formatter: "{c} endpoints with time-related description"
        };
        let timeFalseDataSerie = {
            name: "Time related description of creation of the dataset",
            type: "bar",
            stack: "time",
            colorBy: "data",
            data: [
                {
                    value: $9826f49ddc647f24$var$datasetDescriptionData.length - timeDataScore,
                    name: "Absence of time-related description"
                }
            ]
        };
        if ($9826f49ddc647f24$var$datasetDescriptionData.length - timeDataScore > 0) timeFalseDataSerie.label = {
            show: true,
            formatter: "{c} endpoints without time-related description"
        };
        let sourceTrueDataSerie = {
            name: "Description of the source or the process at the origin of the dataset",
            type: "bar",
            stack: "source",
            colorBy: "data",
            data: [
                {
                    value: sourceDataScore,
                    name: "Presence of description of the origin of the dataset"
                }
            ]
        };
        if (sourceDataScore > 0) sourceTrueDataSerie.label = {
            show: true,
            formatter: "{c} endpoints with source description"
        };
        let sourceFalseDataSerie = {
            name: "Description of the source or the process at the origin of the dataset",
            type: "bar",
            stack: "source",
            colorBy: "data",
            data: [
                {
                    value: $9826f49ddc647f24$var$datasetDescriptionData.length - sourceDataScore,
                    name: "Absence of description of the origin of the dataset"
                }
            ]
        };
        if ($9826f49ddc647f24$var$datasetDescriptionData.length - sourceDataScore > 0) sourceFalseDataSerie.label = {
            show: true,
            formatter: "{c} endpoints without source description"
        };
        let datasetDescriptionEchartOption = {
            title: {
                text: "Dataset description features in all endpoints",
                left: "center"
            },
            tooltip: {
                confine: true
            },
            xAxis: {
                type: "value",
                max: "dataMax"
            },
            yAxis: {
                type: "category",
                axisLabel: {
                    formatter: "Dataset\n description\n elements",
                    overflow: "breakAll"
                }
            },
            legend: {
                left: "left",
                show: false
            },
            series: [
                whoTrueDataSerie,
                whoFalseDataSerie,
                licenseTrueDataSerie,
                licenseFalseDataSerie,
                timeTrueDataSerie,
                timeFalseDataSerie,
                sourceTrueDataSerie,
                sourceFalseDataSerie
            ]
        };
        return datasetDescriptionEchartOption;
    }).then((datasetDescriptionEchartOption)=>{
        let content = JSON.stringify(datasetDescriptionEchartOption);
        return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runsetId, $9826f49ddc647f24$export$18d97433d9d76860), content).then(()=>{
            $8a991e7a11d82128$export$a80b3bd66acc52ff("Dataset description chart option for", runsetId, " generation ended");
            return Promise.resolve();
        });
    });
}
function $9826f49ddc647f24$export$34c698aa9e948d35(runtimeId) {
    $8a991e7a11d82128$export$a80b3bd66acc52ff("Total runtime chart settings generation started");
    return (0, $hgUW1$readFile1)($ffc2274b02472392$export$e74e8de8dd192304(runtimeId, $86c4b18dfd9981cd$export$77c3cb8c70c0e802), "utf-8").then((totalRuntimeRawData)=>{
        let totalRuntimeData = JSON.parse(totalRuntimeRawData);
        let runtimeDataSerie = [];
        totalRuntimeData.forEach((itemResult, i)=>{
            let graph = itemResult.graph;
            let start = $ffc2274b02472392$export$6b862160d295c8e(itemResult.start);
            let end = $ffc2274b02472392$export$6b862160d295c8e(itemResult.end);
            let endpoint = itemResult.endpoint;
            let date = $ffc2274b02472392$export$6b862160d295c8e(itemResult.date);
            let runtime = (0, $hgUW1$dayjs).duration(itemResult.runtime);
            runtimeDataSerie.push([
                date,
                runtime,
                endpoint
            ]);
        });
        let runtimeSerie = {
            name: "Runtime in seconds",
            label: "show",
            symbolSize: 5,
            data: runtimeDataSerie.map((a)=>[
                    a[0].toDate(),
                    a[1].asSeconds()
                ]),
            tooltip: {
                show: true,
                formatter: function(value) {
                    let source = runtimeDataSerie.filter((a)=>a[0].isSame((0, $hgUW1$dayjs)(value.value[0])))[0];
                    let runtime = source[1];
                    let endpoint = source[2];
                    let tooltip = endpoint + " <br/>" + runtime.humanize();
                    return tooltip;
                }
            },
            type: "scatter"
        };
        let totalRuntimeChartOption = $7f0727dd3bc71455$export$cf0e65b2f6ae17a4("Runtime of the framework for each run (in seconds)", [
            runtimeSerie
        ]);
        return (0, $hgUW1$writeFile1)($ffc2274b02472392$export$e74e8de8dd192304(runtimeId, $9826f49ddc647f24$export$a9880d7f91a2a4c8), JSON.stringify(totalRuntimeChartOption)).then(()=>{
            $8a991e7a11d82128$export$a80b3bd66acc52ff("Total runtime chart settings generated");
        });
    }).catch((error)=>{
        $8a991e7a11d82128$export$a3bc9b8ed74fc("Error during total runtime data reading", error);
    });
}


$86c4b18dfd9981cd$export$7e2698228288ee1d.then((runsetObjectList)=>{
    return $86c4b18dfd9981cd$export$d57f956200529ac1().then(()=>{
        return $86c4b18dfd9981cd$export$27e383496ec87203().then(()=>{
            return Promise.allSettled(runsetObjectList.map((runsetObject)=>{
                return Promise.allSettled([
                    $86c4b18dfd9981cd$export$16baa7a4d0ab148f(runsetObject),
                    $86c4b18dfd9981cd$export$78044303c52d154c(runsetObject).then(()=>$9826f49ddc647f24$export$ee72fc4ede93c668(runsetObject.id)),
                    $86c4b18dfd9981cd$export$2dd4008ac1f64a09(runsetObject).then(()=>$9826f49ddc647f24$export$fd98b1913a15077f(runsetObject.id)),
                    $86c4b18dfd9981cd$export$bef24a095c7f4c37(runsetObject).then(()=>$9826f49ddc647f24$export$feac2169b990f705(runsetObject.id)),
                    $86c4b18dfd9981cd$export$8c439a864a3d1cd1(runsetObject).then(()=>$9826f49ddc647f24$export$c50476c152d07291(runsetObject.id)),
                    $86c4b18dfd9981cd$export$171d2a27f8f910f2(runsetObject).then(()=>$9826f49ddc647f24$export$ac77b7438a17c958(runsetObject.id)),
                    $86c4b18dfd9981cd$export$e9e270353a52a8b8(runsetObject).then(()=>$9826f49ddc647f24$export$328b5d2526e5f967(runsetObject.id)),
                    $86c4b18dfd9981cd$export$aa8fab067441ee22(runsetObject).then(()=>$9826f49ddc647f24$export$c369fa4ac53895cc(runsetObject.id)),
                    $86c4b18dfd9981cd$export$c70d9697a8c9e4fd(runsetObject).then(()=>$9826f49ddc647f24$export$6c4170db1877f301(runsetObject.id)),
                    $86c4b18dfd9981cd$export$8489754ba2a1564a(runsetObject).then(()=>Promise.allSettled([
                            $9826f49ddc647f24$export$1c443380fda47baf(runsetObject.id),
                            $9826f49ddc647f24$export$656da41063ce34d0(runsetObject.id),
                            $9826f49ddc647f24$export$d55a4bb131fed90d(runsetObject.id)
                        ])),
                    $86c4b18dfd9981cd$export$58a2aa7eec898f2(runsetObject).then(()=>$9826f49ddc647f24$export$a3f65f7dcfb9e7b6(runsetObject.id))
                ]);
            }));
        });
    });
}).catch((error)=>{
    $8a991e7a11d82128$export$a3bc9b8ed74fc(error);
});


//# sourceMappingURL=index.js.map
