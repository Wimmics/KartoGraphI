// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

(function (modules, entry, mainEntry, parcelRequireName, globalName) {
  /* eslint-disable no-undef */
  var globalObject =
    typeof globalThis !== 'undefined'
      ? globalThis
      : typeof self !== 'undefined'
      ? self
      : typeof window !== 'undefined'
      ? window
      : typeof global !== 'undefined'
      ? global
      : {};
  /* eslint-enable no-undef */

  // Save the require from previous bundle to this closure if any
  var previousRequire =
    typeof globalObject[parcelRequireName] === 'function' &&
    globalObject[parcelRequireName];

  var cache = previousRequire.cache || {};
  // Do not use `require` to prevent Webpack from trying to bundle this call
  var nodeRequire =
    typeof module !== 'undefined' &&
    typeof module.require === 'function' &&
    module.require.bind(module);

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire =
          typeof globalObject[parcelRequireName] === 'function' &&
          globalObject[parcelRequireName];
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error("Cannot find module '" + name + "'");
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = (cache[name] = new newRequire.Module(name));

      modules[name][0].call(
        module.exports,
        localRequire,
        module,
        module.exports,
        this
      );
    }

    return cache[name].exports;

    function localRequire(x) {
      var res = localRequire.resolve(x);
      return res === false ? {} : newRequire(res);
    }

    function resolve(x) {
      var id = modules[name][1][x];
      return id != null ? id : x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [
      function (require, module) {
        module.exports = exports;
      },
      {},
    ];
  };

  Object.defineProperty(newRequire, 'root', {
    get: function () {
      return globalObject[parcelRequireName];
    },
  });

  globalObject[parcelRequireName] = newRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (mainEntry) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(mainEntry);

    // CommonJS
    if (typeof exports === 'object' && typeof module !== 'undefined') {
      module.exports = mainExports;

      // RequireJS
    } else if (typeof define === 'function' && define.amd) {
      define(function () {
        return mainExports;
      });

      // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }
})({"haX2K":[function(require,module,exports) {
var global = arguments[3];
var HMR_HOST = null;
var HMR_PORT = null;
var HMR_SECURE = true;
var HMR_ENV_HASH = "d6ea1d42532a7575";
module.bundle.HMR_BUNDLE_ID = "df07a339c194aca8";
"use strict";
/* global HMR_HOST, HMR_PORT, HMR_ENV_HASH, HMR_SECURE, chrome, browser, globalThis, __parcel__import__, __parcel__importScripts__, ServiceWorkerGlobalScope */ /*::
import type {
  HMRAsset,
  HMRMessage,
} from '@parcel/reporter-dev-server/src/HMRServer.js';
interface ParcelRequire {
  (string): mixed;
  cache: {|[string]: ParcelModule|};
  hotData: {|[string]: mixed|};
  Module: any;
  parent: ?ParcelRequire;
  isParcelRequire: true;
  modules: {|[string]: [Function, {|[string]: string|}]|};
  HMR_BUNDLE_ID: string;
  root: ParcelRequire;
}
interface ParcelModule {
  hot: {|
    data: mixed,
    accept(cb: (Function) => void): void,
    dispose(cb: (mixed) => void): void,
    // accept(deps: Array<string> | string, cb: (Function) => void): void,
    // decline(): void,
    _acceptCallbacks: Array<(Function) => void>,
    _disposeCallbacks: Array<(mixed) => void>,
  |};
}
interface ExtensionContext {
  runtime: {|
    reload(): void,
    getURL(url: string): string;
    getManifest(): {manifest_version: number, ...};
  |};
}
declare var module: {bundle: ParcelRequire, ...};
declare var HMR_HOST: string;
declare var HMR_PORT: string;
declare var HMR_ENV_HASH: string;
declare var HMR_SECURE: boolean;
declare var chrome: ExtensionContext;
declare var browser: ExtensionContext;
declare var __parcel__import__: (string) => Promise<void>;
declare var __parcel__importScripts__: (string) => Promise<void>;
declare var globalThis: typeof self;
declare var ServiceWorkerGlobalScope: Object;
*/ var OVERLAY_ID = "__parcel__error__overlay__";
var OldModule = module.bundle.Module;
function Module(moduleName) {
    OldModule.call(this, moduleName);
    this.hot = {
        data: module.bundle.hotData[moduleName],
        _acceptCallbacks: [],
        _disposeCallbacks: [],
        accept: function(fn) {
            this._acceptCallbacks.push(fn || function() {});
        },
        dispose: function(fn) {
            this._disposeCallbacks.push(fn);
        }
    };
    module.bundle.hotData[moduleName] = undefined;
}
module.bundle.Module = Module;
module.bundle.hotData = {};
var checkedAssets, assetsToDispose, assetsToAccept /*: Array<[ParcelRequire, string]> */ ;
function getHostname() {
    return HMR_HOST || (location.protocol.indexOf("http") === 0 ? location.hostname : "localhost");
}
function getPort() {
    return HMR_PORT || location.port;
} // eslint-disable-next-line no-redeclare
var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== "undefined") {
    var hostname = getHostname();
    var port = getPort();
    var protocol = HMR_SECURE || location.protocol == "https:" && !/localhost|127.0.0.1|0.0.0.0/.test(hostname) ? "wss" : "ws";
    var ws = new WebSocket(protocol + "://" + hostname + (port ? ":" + port : "") + "/"); // Web extension context
    var extCtx = typeof chrome === "undefined" ? typeof browser === "undefined" ? null : browser : chrome; // Safari doesn't support sourceURL in error stacks.
    // eval may also be disabled via CSP, so do a quick check.
    var supportsSourceURL = false;
    try {
        (0, eval)('throw new Error("test"); //# sourceURL=test.js');
    } catch (err) {
        supportsSourceURL = err.stack.includes("test.js");
    } // $FlowFixMe
    ws.onmessage = async function(event) {
        checkedAssets = {} /*: {|[string]: boolean|} */ ;
        assetsToAccept = [];
        assetsToDispose = [];
        var data = JSON.parse(event.data);
        if (data.type === "update") {
            // Remove error overlay if there is one
            if (typeof document !== "undefined") removeErrorOverlay();
            let assets = data.assets.filter((asset)=>asset.envHash === HMR_ENV_HASH); // Handle HMR Update
            let handled = assets.every((asset)=>{
                return asset.type === "css" || asset.type === "js" && hmrAcceptCheck(module.bundle.root, asset.id, asset.depsByBundle);
            });
            if (handled) {
                console.clear(); // Dispatch custom event so other runtimes (e.g React Refresh) are aware.
                if (typeof window !== "undefined" && typeof CustomEvent !== "undefined") window.dispatchEvent(new CustomEvent("parcelhmraccept"));
                await hmrApplyUpdates(assets); // Dispose all old assets.
                let processedAssets = {} /*: {|[string]: boolean|} */ ;
                for(let i = 0; i < assetsToDispose.length; i++){
                    let id = assetsToDispose[i][1];
                    if (!processedAssets[id]) {
                        hmrDispose(assetsToDispose[i][0], id);
                        processedAssets[id] = true;
                    }
                } // Run accept callbacks. This will also re-execute other disposed assets in topological order.
                processedAssets = {};
                for(let i = 0; i < assetsToAccept.length; i++){
                    let id = assetsToAccept[i][1];
                    if (!processedAssets[id]) {
                        hmrAccept(assetsToAccept[i][0], id);
                        processedAssets[id] = true;
                    }
                }
            } else fullReload();
        }
        if (data.type === "error") {
            // Log parcel errors to console
            for (let ansiDiagnostic of data.diagnostics.ansi){
                let stack = ansiDiagnostic.codeframe ? ansiDiagnostic.codeframe : ansiDiagnostic.stack;
                console.error("\uD83D\uDEA8 [parcel]: " + ansiDiagnostic.message + "\n" + stack + "\n\n" + ansiDiagnostic.hints.join("\n"));
            }
            if (typeof document !== "undefined") {
                // Render the fancy html overlay
                removeErrorOverlay();
                var overlay = createErrorOverlay(data.diagnostics.html); // $FlowFixMe
                document.body.appendChild(overlay);
            }
        }
    };
    ws.onerror = function(e) {
        console.error(e.message);
    };
    ws.onclose = function() {
        console.warn("[parcel] \uD83D\uDEA8 Connection to the HMR server was lost");
    };
}
function removeErrorOverlay() {
    var overlay = document.getElementById(OVERLAY_ID);
    if (overlay) {
        overlay.remove();
        console.log("[parcel] ✨ Error resolved");
    }
}
function createErrorOverlay(diagnostics) {
    var overlay = document.createElement("div");
    overlay.id = OVERLAY_ID;
    let errorHTML = '<div style="background: black; opacity: 0.85; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; font-family: Menlo, Consolas, monospace; z-index: 9999;">';
    for (let diagnostic of diagnostics){
        let stack = diagnostic.frames.length ? diagnostic.frames.reduce((p, frame)=>{
            return `${p}
<a href="/__parcel_launch_editor?file=${encodeURIComponent(frame.location)}" style="text-decoration: underline; color: #888" onclick="fetch(this.href); return false">${frame.location}</a>
${frame.code}`;
        }, "") : diagnostic.stack;
        errorHTML += `
      <div>
        <div style="font-size: 18px; font-weight: bold; margin-top: 20px;">
          🚨 ${diagnostic.message}
        </div>
        <pre>${stack}</pre>
        <div>
          ${diagnostic.hints.map((hint)=>"<div>\uD83D\uDCA1 " + hint + "</div>").join("")}
        </div>
        ${diagnostic.documentation ? `<div>📝 <a style="color: violet" href="${diagnostic.documentation}" target="_blank">Learn more</a></div>` : ""}
      </div>
    `;
    }
    errorHTML += "</div>";
    overlay.innerHTML = errorHTML;
    return overlay;
}
function fullReload() {
    if ("reload" in location) location.reload();
    else if (extCtx && extCtx.runtime && extCtx.runtime.reload) extCtx.runtime.reload();
}
function getParents(bundle, id) /*: Array<[ParcelRequire, string]> */ {
    var modules = bundle.modules;
    if (!modules) return [];
    var parents = [];
    var k, d, dep;
    for(k in modules)for(d in modules[k][1]){
        dep = modules[k][1][d];
        if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) parents.push([
            bundle,
            k
        ]);
    }
    if (bundle.parent) parents = parents.concat(getParents(bundle.parent, id));
    return parents;
}
function updateLink(link) {
    var newLink = link.cloneNode();
    newLink.onload = function() {
        if (link.parentNode !== null) // $FlowFixMe
        link.parentNode.removeChild(link);
    };
    newLink.setAttribute("href", link.getAttribute("href").split("?")[0] + "?" + Date.now()); // $FlowFixMe
    link.parentNode.insertBefore(newLink, link.nextSibling);
}
var cssTimeout = null;
function reloadCSS() {
    if (cssTimeout) return;
    cssTimeout = setTimeout(function() {
        var links = document.querySelectorAll('link[rel="stylesheet"]');
        for(var i = 0; i < links.length; i++){
            // $FlowFixMe[incompatible-type]
            var href = links[i].getAttribute("href");
            var hostname = getHostname();
            var servedFromHMRServer = hostname === "localhost" ? new RegExp("^(https?:\\/\\/(0.0.0.0|127.0.0.1)|localhost):" + getPort()).test(href) : href.indexOf(hostname + ":" + getPort());
            var absolute = /^https?:\/\//i.test(href) && href.indexOf(location.origin) !== 0 && !servedFromHMRServer;
            if (!absolute) updateLink(links[i]);
        }
        cssTimeout = null;
    }, 50);
}
function hmrDownload(asset) {
    if (asset.type === "js") {
        if (typeof document !== "undefined") {
            let script = document.createElement("script");
            script.src = asset.url + "?t=" + Date.now();
            if (asset.outputFormat === "esmodule") script.type = "module";
            return new Promise((resolve, reject)=>{
                var _document$head;
                script.onload = ()=>resolve(script);
                script.onerror = reject;
                (_document$head = document.head) === null || _document$head === void 0 || _document$head.appendChild(script);
            });
        } else if (typeof importScripts === "function") {
            // Worker scripts
            if (asset.outputFormat === "esmodule") return import(asset.url + "?t=" + Date.now());
            else return new Promise((resolve, reject)=>{
                try {
                    importScripts(asset.url + "?t=" + Date.now());
                    resolve();
                } catch (err) {
                    reject(err);
                }
            });
        }
    }
}
async function hmrApplyUpdates(assets) {
    global.parcelHotUpdate = Object.create(null);
    let scriptsToRemove;
    try {
        // If sourceURL comments aren't supported in eval, we need to load
        // the update from the dev server over HTTP so that stack traces
        // are correct in errors/logs. This is much slower than eval, so
        // we only do it if needed (currently just Safari).
        // https://bugs.webkit.org/show_bug.cgi?id=137297
        // This path is also taken if a CSP disallows eval.
        if (!supportsSourceURL) {
            let promises = assets.map((asset)=>{
                var _hmrDownload;
                return (_hmrDownload = hmrDownload(asset)) === null || _hmrDownload === void 0 ? void 0 : _hmrDownload.catch((err)=>{
                    // Web extension bugfix for Chromium
                    // https://bugs.chromium.org/p/chromium/issues/detail?id=1255412#c12
                    if (extCtx && extCtx.runtime && extCtx.runtime.getManifest().manifest_version == 3) {
                        if (typeof ServiceWorkerGlobalScope != "undefined" && global instanceof ServiceWorkerGlobalScope) {
                            extCtx.runtime.reload();
                            return;
                        }
                        asset.url = extCtx.runtime.getURL("/__parcel_hmr_proxy__?url=" + encodeURIComponent(asset.url + "?t=" + Date.now()));
                        return hmrDownload(asset);
                    }
                    throw err;
                });
            });
            scriptsToRemove = await Promise.all(promises);
        }
        assets.forEach(function(asset) {
            hmrApply(module.bundle.root, asset);
        });
    } finally{
        delete global.parcelHotUpdate;
        if (scriptsToRemove) scriptsToRemove.forEach((script)=>{
            if (script) {
                var _document$head2;
                (_document$head2 = document.head) === null || _document$head2 === void 0 || _document$head2.removeChild(script);
            }
        });
    }
}
function hmrApply(bundle, asset) {
    var modules = bundle.modules;
    if (!modules) return;
    if (asset.type === "css") reloadCSS();
    else if (asset.type === "js") {
        let deps = asset.depsByBundle[bundle.HMR_BUNDLE_ID];
        if (deps) {
            if (modules[asset.id]) {
                // Remove dependencies that are removed and will become orphaned.
                // This is necessary so that if the asset is added back again, the cache is gone, and we prevent a full page reload.
                let oldDeps = modules[asset.id][1];
                for(let dep in oldDeps)if (!deps[dep] || deps[dep] !== oldDeps[dep]) {
                    let id = oldDeps[dep];
                    let parents = getParents(module.bundle.root, id);
                    if (parents.length === 1) hmrDelete(module.bundle.root, id);
                }
            }
            if (supportsSourceURL) // Global eval. We would use `new Function` here but browser
            // support for source maps is better with eval.
            (0, eval)(asset.output);
             // $FlowFixMe
            let fn = global.parcelHotUpdate[asset.id];
            modules[asset.id] = [
                fn,
                deps
            ];
        } else if (bundle.parent) hmrApply(bundle.parent, asset);
    }
}
function hmrDelete(bundle, id) {
    let modules = bundle.modules;
    if (!modules) return;
    if (modules[id]) {
        // Collect dependencies that will become orphaned when this module is deleted.
        let deps = modules[id][1];
        let orphans = [];
        for(let dep in deps){
            let parents = getParents(module.bundle.root, deps[dep]);
            if (parents.length === 1) orphans.push(deps[dep]);
        } // Delete the module. This must be done before deleting dependencies in case of circular dependencies.
        delete modules[id];
        delete bundle.cache[id]; // Now delete the orphans.
        orphans.forEach((id)=>{
            hmrDelete(module.bundle.root, id);
        });
    } else if (bundle.parent) hmrDelete(bundle.parent, id);
}
function hmrAcceptCheck(bundle, id, depsByBundle) {
    if (hmrAcceptCheckOne(bundle, id, depsByBundle)) return true;
     // Traverse parents breadth first. All possible ancestries must accept the HMR update, or we'll reload.
    let parents = getParents(module.bundle.root, id);
    let accepted = false;
    while(parents.length > 0){
        let v = parents.shift();
        let a = hmrAcceptCheckOne(v[0], v[1], null);
        if (a) // If this parent accepts, stop traversing upward, but still consider siblings.
        accepted = true;
        else {
            // Otherwise, queue the parents in the next level upward.
            let p = getParents(module.bundle.root, v[1]);
            if (p.length === 0) {
                // If there are no parents, then we've reached an entry without accepting. Reload.
                accepted = false;
                break;
            }
            parents.push(...p);
        }
    }
    return accepted;
}
function hmrAcceptCheckOne(bundle, id, depsByBundle) {
    var modules = bundle.modules;
    if (!modules) return;
    if (depsByBundle && !depsByBundle[bundle.HMR_BUNDLE_ID]) {
        // If we reached the root bundle without finding where the asset should go,
        // there's nothing to do. Mark as "accepted" so we don't reload the page.
        if (!bundle.parent) return true;
        return hmrAcceptCheck(bundle.parent, id, depsByBundle);
    }
    if (checkedAssets[id]) return true;
    checkedAssets[id] = true;
    var cached = bundle.cache[id];
    assetsToDispose.push([
        bundle,
        id
    ]);
    if (!cached || cached.hot && cached.hot._acceptCallbacks.length) {
        assetsToAccept.push([
            bundle,
            id
        ]);
        return true;
    }
}
function hmrDispose(bundle, id) {
    var cached = bundle.cache[id];
    bundle.hotData[id] = {};
    if (cached && cached.hot) cached.hot.data = bundle.hotData[id];
    if (cached && cached.hot && cached.hot._disposeCallbacks.length) cached.hot._disposeCallbacks.forEach(function(cb) {
        cb(bundle.hotData[id]);
    });
    delete bundle.cache[id];
}
function hmrAccept(bundle, id) {
    // Execute the module.
    bundle(id); // Run the accept callbacks in the new version of the module.
    var cached = bundle.cache[id];
    if (cached && cached.hot && cached.hot._acceptCallbacks.length) cached.hot._acceptCallbacks.forEach(function(cb) {
        var assetsToAlsoAccept = cb(function() {
            return getParents(module.bundle.root, id);
        });
        if (assetsToAlsoAccept && assetsToAccept.length) {
            assetsToAlsoAccept.forEach(function(a) {
                hmrDispose(a[0], a[1]);
            }); // $FlowFixMe[method-unbinding]
            assetsToAccept.push.apply(assetsToAccept, assetsToAlsoAccept);
        }
    });
}

},{}],"2Xa5n":[function(require,module,exports) {
(function(root, factory) {
    if (typeof define === "function" && define.amd) // AMD. Register as an anonymous module.
    define([
        "leaflet"
    ], factory);
    else if (typeof modules === "object" && module.exports) // define a Common JS module that relies on 'leaflet'
    module.exports = factory(require("66dd50ad9a453a5e"));
    else // Assume Leaflet is loaded into global object L already
    factory(L);
})(this, function(L1) {
    "use strict";
    L1.TileLayer.Provider = L1.TileLayer.extend({
        initialize: function(arg, options) {
            var providers = L1.TileLayer.Provider.providers;
            var parts = arg.split(".");
            var providerName = parts[0];
            var variantName = parts[1];
            if (!providers[providerName]) throw "No such provider (" + providerName + ")";
            var provider = {
                url: providers[providerName].url,
                options: providers[providerName].options
            };
            // overwrite values in provider from variant.
            if (variantName && "variants" in providers[providerName]) {
                if (!(variantName in providers[providerName].variants)) throw "No such variant of " + providerName + " (" + variantName + ")";
                var variant = providers[providerName].variants[variantName];
                var variantOptions;
                if (typeof variant === "string") variantOptions = {
                    variant: variant
                };
                else variantOptions = variant.options;
                provider = {
                    url: variant.url || provider.url,
                    options: L1.Util.extend({}, provider.options, variantOptions)
                };
            }
            // replace attribution placeholders with their values from toplevel provider attribution,
            // recursively
            var attributionReplacer = function(attr) {
                if (attr.indexOf("{attribution.") === -1) return attr;
                return attr.replace(/\{attribution.(\w*)\}/g, function(match, attributionName) {
                    return attributionReplacer(providers[attributionName].options.attribution);
                });
            };
            provider.options.attribution = attributionReplacer(provider.options.attribution);
            // Compute final options combining provider options with any user overrides
            var layerOpts = L1.Util.extend({}, provider.options, options);
            L1.TileLayer.prototype.initialize.call(this, provider.url, layerOpts);
        }
    });
    /**
	 * Definition of providers.
	 * see http://leafletjs.com/reference.html#tilelayer for options in the options map.
	 */ L1.TileLayer.Provider.providers = {
        OpenStreetMap: {
            url: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
            options: {
                maxZoom: 19,
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            },
            variants: {
                Mapnik: {},
                DE: {
                    url: "https://{s}.tile.openstreetmap.de/{z}/{x}/{y}.png",
                    options: {
                        maxZoom: 18
                    }
                },
                CH: {
                    url: "https://tile.osm.ch/switzerland/{z}/{x}/{y}.png",
                    options: {
                        maxZoom: 18,
                        bounds: [
                            [
                                45,
                                5
                            ],
                            [
                                48,
                                11
                            ]
                        ]
                    }
                },
                France: {
                    url: "https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png",
                    options: {
                        maxZoom: 20,
                        attribution: "&copy; OpenStreetMap France | {attribution.OpenStreetMap}"
                    }
                },
                HOT: {
                    url: "https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png",
                    options: {
                        attribution: '{attribution.OpenStreetMap}, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
                    }
                },
                BZH: {
                    url: "https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png",
                    options: {
                        attribution: '{attribution.OpenStreetMap}, Tiles courtesy of <a href="http://www.openstreetmap.bzh/" target="_blank">Breton OpenStreetMap Team</a>',
                        bounds: [
                            [
                                46.2,
                                -5.5
                            ],
                            [
                                50,
                                0.7
                            ]
                        ]
                    }
                }
            }
        },
        MapTilesAPI: {
            url: "https://maptiles.p.rapidapi.com/{variant}/{z}/{x}/{y}.png?rapidapi-key={apikey}",
            options: {
                attribution: '&copy; <a href="http://www.maptilesapi.com/">MapTiles API</a>, {attribution.OpenStreetMap}',
                variant: "en/map/v1",
                // Get your own MapTiles API access token here : https://www.maptilesapi.com/
                // NB : this is a demonstration key that comes with no guarantee and not to be used in production
                apikey: "<insert your api key here>",
                maxZoom: 19
            },
            variants: {
                OSMEnglish: {
                    options: {
                        variant: "en/map/v1"
                    }
                },
                OSMFrancais: {
                    options: {
                        variant: "fr/map/v1"
                    }
                },
                OSMEspagnol: {
                    options: {
                        variant: "es/map/v1"
                    }
                }
            }
        },
        OpenSeaMap: {
            url: "https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png",
            options: {
                attribution: 'Map data: &copy; <a href="http://www.openseamap.org">OpenSeaMap</a> contributors'
            }
        },
        OPNVKarte: {
            url: "https://tileserver.memomaps.de/tilegen/{z}/{x}/{y}.png",
            options: {
                maxZoom: 18,
                attribution: 'Map <a href="https://memomaps.de/">memomaps.de</a> <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, map data {attribution.OpenStreetMap}'
            }
        },
        OpenTopoMap: {
            url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
            options: {
                maxZoom: 17,
                attribution: 'Map data: {attribution.OpenStreetMap}, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            }
        },
        OpenRailwayMap: {
            url: "https://{s}.tiles.openrailwaymap.org/standard/{z}/{x}/{y}.png",
            options: {
                maxZoom: 19,
                attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="https://www.OpenRailwayMap.org">OpenRailwayMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            }
        },
        OpenFireMap: {
            url: "http://openfiremap.org/hytiles/{z}/{x}/{y}.png",
            options: {
                maxZoom: 19,
                attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="http://www.openfiremap.org">OpenFireMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            }
        },
        SafeCast: {
            url: "https://s3.amazonaws.com/te512.safecast.org/{z}/{x}/{y}.png",
            options: {
                maxZoom: 16,
                attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="https://blog.safecast.org/about/">SafeCast</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            }
        },
        Stadia: {
            url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png",
            options: {
                maxZoom: 20,
                attribution: '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a> &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors'
            },
            variants: {
                AlidadeSmooth: {
                    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                },
                AlidadeSmoothDark: {
                    url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
                },
                OSMBright: {
                    url: "https://tiles.stadiamaps.com/tiles/osm_bright/{z}/{x}/{y}{r}.png"
                },
                Outdoors: {
                    url: "https://tiles.stadiamaps.com/tiles/outdoors/{z}/{x}/{y}{r}.png"
                }
            }
        },
        Thunderforest: {
            url: "https://{s}.tile.thunderforest.com/{variant}/{z}/{x}/{y}.png?apikey={apikey}",
            options: {
                attribution: '&copy; <a href="http://www.thunderforest.com/">Thunderforest</a>, {attribution.OpenStreetMap}',
                variant: "cycle",
                apikey: "<insert your api key here>",
                maxZoom: 22
            },
            variants: {
                OpenCycleMap: "cycle",
                Transport: {
                    options: {
                        variant: "transport"
                    }
                },
                TransportDark: {
                    options: {
                        variant: "transport-dark"
                    }
                },
                SpinalMap: {
                    options: {
                        variant: "spinal-map"
                    }
                },
                Landscape: "landscape",
                Outdoors: "outdoors",
                Pioneer: "pioneer",
                MobileAtlas: "mobile-atlas",
                Neighbourhood: "neighbourhood"
            }
        },
        CyclOSM: {
            url: "https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png",
            options: {
                maxZoom: 20,
                attribution: '<a href="https://github.com/cyclosm/cyclosm-cartocss-style/releases" title="CyclOSM - Open Bicycle render">CyclOSM</a> | Map data: {attribution.OpenStreetMap}'
            }
        },
        Jawg: {
            url: "https://{s}.tile.jawg.io/{variant}/{z}/{x}/{y}{r}.png?access-token={accessToken}",
            options: {
                attribution: '<a href="http://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> {attribution.OpenStreetMap}',
                minZoom: 0,
                maxZoom: 22,
                subdomains: "abcd",
                variant: "jawg-terrain",
                // Get your own Jawg access token here : https://www.jawg.io/lab/
                // NB : this is a demonstration key that comes with no guarantee
                accessToken: "<insert your access token here>"
            },
            variants: {
                Streets: "jawg-streets",
                Terrain: "jawg-terrain",
                Sunny: "jawg-sunny",
                Dark: "jawg-dark",
                Light: "jawg-light",
                Matrix: "jawg-matrix"
            }
        },
        MapBox: {
            url: "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?access_token={accessToken}",
            options: {
                attribution: '&copy; <a href="https://www.mapbox.com/about/maps/" target="_blank">Mapbox</a> {attribution.OpenStreetMap} <a href="https://www.mapbox.com/map-feedback/" target="_blank">Improve this map</a>',
                tileSize: 512,
                maxZoom: 18,
                zoomOffset: -1,
                id: "mapbox/streets-v11",
                accessToken: "<insert your access token here>"
            }
        },
        MapTiler: {
            url: "https://api.maptiler.com/maps/{variant}/{z}/{x}/{y}{r}.{ext}?key={key}",
            options: {
                attribution: '<a href="https://www.maptiler.com/copyright/" target="_blank">&copy; MapTiler</a> <a href="https://www.openstreetmap.org/copyright" target="_blank">&copy; OpenStreetMap contributors</a>',
                variant: "streets",
                ext: "png",
                key: "<insert your MapTiler Cloud API key here>",
                tileSize: 512,
                zoomOffset: -1,
                minZoom: 0,
                maxZoom: 21
            },
            variants: {
                Streets: "streets",
                Basic: "basic",
                Bright: "bright",
                Pastel: "pastel",
                Positron: "positron",
                Hybrid: {
                    options: {
                        variant: "hybrid",
                        ext: "jpg"
                    }
                },
                Toner: "toner",
                Topo: "topo",
                Voyager: "voyager"
            }
        },
        Stamen: {
            url: "https://stamen-tiles-{s}.a.ssl.fastly.net/{variant}/{z}/{x}/{y}{r}.{ext}",
            options: {
                attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data {attribution.OpenStreetMap}',
                subdomains: "abcd",
                minZoom: 0,
                maxZoom: 20,
                variant: "toner",
                ext: "png"
            },
            variants: {
                Toner: "toner",
                TonerBackground: "toner-background",
                TonerHybrid: "toner-hybrid",
                TonerLines: "toner-lines",
                TonerLabels: "toner-labels",
                TonerLite: "toner-lite",
                Watercolor: {
                    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/{variant}/{z}/{x}/{y}.{ext}",
                    options: {
                        variant: "watercolor",
                        ext: "jpg",
                        minZoom: 1,
                        maxZoom: 16
                    }
                },
                Terrain: {
                    options: {
                        variant: "terrain",
                        minZoom: 0,
                        maxZoom: 18
                    }
                },
                TerrainBackground: {
                    options: {
                        variant: "terrain-background",
                        minZoom: 0,
                        maxZoom: 18
                    }
                },
                TerrainLabels: {
                    options: {
                        variant: "terrain-labels",
                        minZoom: 0,
                        maxZoom: 18
                    }
                },
                TopOSMRelief: {
                    url: "https://stamen-tiles-{s}.a.ssl.fastly.net/{variant}/{z}/{x}/{y}.{ext}",
                    options: {
                        variant: "toposm-color-relief",
                        ext: "jpg",
                        bounds: [
                            [
                                22,
                                -132
                            ],
                            [
                                51,
                                -56
                            ]
                        ]
                    }
                },
                TopOSMFeatures: {
                    options: {
                        variant: "toposm-features",
                        bounds: [
                            [
                                22,
                                -132
                            ],
                            [
                                51,
                                -56
                            ]
                        ],
                        opacity: 0.9
                    }
                }
            }
        },
        TomTom: {
            url: "https://{s}.api.tomtom.com/map/1/tile/{variant}/{style}/{z}/{x}/{y}.{ext}?key={apikey}",
            options: {
                variant: "basic",
                maxZoom: 22,
                attribution: '<a href="https://tomtom.com" target="_blank">&copy;  1992 - ' + new Date().getFullYear() + " TomTom.</a> ",
                subdomains: "abcd",
                style: "main",
                ext: "png",
                apikey: "<insert your API key here>"
            },
            variants: {
                Basic: "basic",
                Hybrid: "hybrid",
                Labels: "labels"
            }
        },
        Esri: {
            url: "https://server.arcgisonline.com/ArcGIS/rest/services/{variant}/MapServer/tile/{z}/{y}/{x}",
            options: {
                variant: "World_Street_Map",
                attribution: "Tiles &copy; Esri"
            },
            variants: {
                WorldStreetMap: {
                    options: {
                        attribution: "{attribution.Esri} &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, Esri Japan, METI, Esri China (Hong Kong), Esri (Thailand), TomTom, 2012"
                    }
                },
                DeLorme: {
                    options: {
                        variant: "Specialty/DeLorme_World_Base_Map",
                        minZoom: 1,
                        maxZoom: 11,
                        attribution: "{attribution.Esri} &mdash; Copyright: &copy;2012 DeLorme"
                    }
                },
                WorldTopoMap: {
                    options: {
                        variant: "World_Topo_Map",
                        attribution: "{attribution.Esri} &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community"
                    }
                },
                WorldImagery: {
                    options: {
                        variant: "World_Imagery",
                        attribution: "{attribution.Esri} &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                    }
                },
                WorldTerrain: {
                    options: {
                        variant: "World_Terrain_Base",
                        maxZoom: 13,
                        attribution: "{attribution.Esri} &mdash; Source: USGS, Esri, TANA, DeLorme, and NPS"
                    }
                },
                WorldShadedRelief: {
                    options: {
                        variant: "World_Shaded_Relief",
                        maxZoom: 13,
                        attribution: "{attribution.Esri} &mdash; Source: Esri"
                    }
                },
                WorldPhysical: {
                    options: {
                        variant: "World_Physical_Map",
                        maxZoom: 8,
                        attribution: "{attribution.Esri} &mdash; Source: US National Park Service"
                    }
                },
                OceanBasemap: {
                    options: {
                        variant: "Ocean/World_Ocean_Base",
                        maxZoom: 13,
                        attribution: "{attribution.Esri} &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and Esri"
                    }
                },
                NatGeoWorldMap: {
                    options: {
                        variant: "NatGeo_World_Map",
                        maxZoom: 16,
                        attribution: "{attribution.Esri} &mdash; National Geographic, Esri, DeLorme, NAVTEQ, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, iPC"
                    }
                },
                WorldGrayCanvas: {
                    options: {
                        variant: "Canvas/World_Light_Gray_Base",
                        maxZoom: 16,
                        attribution: "{attribution.Esri} &mdash; Esri, DeLorme, NAVTEQ"
                    }
                }
            }
        },
        OpenWeatherMap: {
            url: "http://{s}.tile.openweathermap.org/map/{variant}/{z}/{x}/{y}.png?appid={apiKey}",
            options: {
                maxZoom: 19,
                attribution: 'Map data &copy; <a href="http://openweathermap.org">OpenWeatherMap</a>',
                apiKey: "<insert your api key here>",
                opacity: 0.5
            },
            variants: {
                Clouds: "clouds",
                CloudsClassic: "clouds_cls",
                Precipitation: "precipitation",
                PrecipitationClassic: "precipitation_cls",
                Rain: "rain",
                RainClassic: "rain_cls",
                Pressure: "pressure",
                PressureContour: "pressure_cntr",
                Wind: "wind",
                Temperature: "temp",
                Snow: "snow"
            }
        },
        HERE: {
            /*
			 * HERE maps, formerly Nokia maps.
			 * These basemaps are free, but you need an api id and app key. Please sign up at
			 * https://developer.here.com/plans
			 */ url: "https://{s}.{base}.maps.api.here.com/maptile/2.1/{type}/{mapID}/{variant}/{z}/{x}/{y}/{size}/{format}?app_id={app_id}&app_code={app_code}&lg={language}",
            options: {
                attribution: "Map &copy; 1987-" + new Date().getFullYear() + ' <a href="http://developer.here.com">HERE</a>',
                subdomains: "1234",
                mapID: "newest",
                "app_id": "<insert your app_id here>",
                "app_code": "<insert your app_code here>",
                base: "base",
                variant: "normal.day",
                maxZoom: 20,
                type: "maptile",
                language: "eng",
                format: "png8",
                size: "256"
            },
            variants: {
                normalDay: "normal.day",
                normalDayCustom: "normal.day.custom",
                normalDayGrey: "normal.day.grey",
                normalDayMobile: "normal.day.mobile",
                normalDayGreyMobile: "normal.day.grey.mobile",
                normalDayTransit: "normal.day.transit",
                normalDayTransitMobile: "normal.day.transit.mobile",
                normalDayTraffic: {
                    options: {
                        variant: "normal.traffic.day",
                        base: "traffic",
                        type: "traffictile"
                    }
                },
                normalNight: "normal.night",
                normalNightMobile: "normal.night.mobile",
                normalNightGrey: "normal.night.grey",
                normalNightGreyMobile: "normal.night.grey.mobile",
                normalNightTransit: "normal.night.transit",
                normalNightTransitMobile: "normal.night.transit.mobile",
                reducedDay: "reduced.day",
                reducedNight: "reduced.night",
                basicMap: {
                    options: {
                        type: "basetile"
                    }
                },
                mapLabels: {
                    options: {
                        type: "labeltile",
                        format: "png"
                    }
                },
                trafficFlow: {
                    options: {
                        base: "traffic",
                        type: "flowtile"
                    }
                },
                carnavDayGrey: "carnav.day.grey",
                hybridDay: {
                    options: {
                        base: "aerial",
                        variant: "hybrid.day"
                    }
                },
                hybridDayMobile: {
                    options: {
                        base: "aerial",
                        variant: "hybrid.day.mobile"
                    }
                },
                hybridDayTransit: {
                    options: {
                        base: "aerial",
                        variant: "hybrid.day.transit"
                    }
                },
                hybridDayGrey: {
                    options: {
                        base: "aerial",
                        variant: "hybrid.grey.day"
                    }
                },
                hybridDayTraffic: {
                    options: {
                        variant: "hybrid.traffic.day",
                        base: "traffic",
                        type: "traffictile"
                    }
                },
                pedestrianDay: "pedestrian.day",
                pedestrianNight: "pedestrian.night",
                satelliteDay: {
                    options: {
                        base: "aerial",
                        variant: "satellite.day"
                    }
                },
                terrainDay: {
                    options: {
                        base: "aerial",
                        variant: "terrain.day"
                    }
                },
                terrainDayMobile: {
                    options: {
                        base: "aerial",
                        variant: "terrain.day.mobile"
                    }
                }
            }
        },
        HEREv3: {
            /*
			 * HERE maps API Version 3.
			 * These basemaps are free, but you need an API key. Please sign up at
			 * https://developer.here.com/plans
			 * Version 3 deprecates the app_id and app_code access in favor of apiKey
			 *
			 * Supported access methods as of 2019/12/21:
			 * @see https://developer.here.com/faqs#access-control-1--how-do-you-control-access-to-here-location-services
			 */ url: "https://{s}.{base}.maps.ls.hereapi.com/maptile/2.1/{type}/{mapID}/{variant}/{z}/{x}/{y}/{size}/{format}?apiKey={apiKey}&lg={language}",
            options: {
                attribution: "Map &copy; 1987-" + new Date().getFullYear() + ' <a href="http://developer.here.com">HERE</a>',
                subdomains: "1234",
                mapID: "newest",
                apiKey: "<insert your apiKey here>",
                base: "base",
                variant: "normal.day",
                maxZoom: 20,
                type: "maptile",
                language: "eng",
                format: "png8",
                size: "256"
            },
            variants: {
                normalDay: "normal.day",
                normalDayCustom: "normal.day.custom",
                normalDayGrey: "normal.day.grey",
                normalDayMobile: "normal.day.mobile",
                normalDayGreyMobile: "normal.day.grey.mobile",
                normalDayTransit: "normal.day.transit",
                normalDayTransitMobile: "normal.day.transit.mobile",
                normalNight: "normal.night",
                normalNightMobile: "normal.night.mobile",
                normalNightGrey: "normal.night.grey",
                normalNightGreyMobile: "normal.night.grey.mobile",
                normalNightTransit: "normal.night.transit",
                normalNightTransitMobile: "normal.night.transit.mobile",
                reducedDay: "reduced.day",
                reducedNight: "reduced.night",
                basicMap: {
                    options: {
                        type: "basetile"
                    }
                },
                mapLabels: {
                    options: {
                        type: "labeltile",
                        format: "png"
                    }
                },
                trafficFlow: {
                    options: {
                        base: "traffic",
                        type: "flowtile"
                    }
                },
                carnavDayGrey: "carnav.day.grey",
                hybridDay: {
                    options: {
                        base: "aerial",
                        variant: "hybrid.day"
                    }
                },
                hybridDayMobile: {
                    options: {
                        base: "aerial",
                        variant: "hybrid.day.mobile"
                    }
                },
                hybridDayTransit: {
                    options: {
                        base: "aerial",
                        variant: "hybrid.day.transit"
                    }
                },
                hybridDayGrey: {
                    options: {
                        base: "aerial",
                        variant: "hybrid.grey.day"
                    }
                },
                pedestrianDay: "pedestrian.day",
                pedestrianNight: "pedestrian.night",
                satelliteDay: {
                    options: {
                        base: "aerial",
                        variant: "satellite.day"
                    }
                },
                terrainDay: {
                    options: {
                        base: "aerial",
                        variant: "terrain.day"
                    }
                },
                terrainDayMobile: {
                    options: {
                        base: "aerial",
                        variant: "terrain.day.mobile"
                    }
                }
            }
        },
        FreeMapSK: {
            url: "https://{s}.freemap.sk/T/{z}/{x}/{y}.jpeg",
            options: {
                minZoom: 8,
                maxZoom: 16,
                subdomains: "abcd",
                bounds: [
                    [
                        47.204642,
                        15.996093
                    ],
                    [
                        49.830896,
                        22.576904
                    ]
                ],
                attribution: '{attribution.OpenStreetMap}, visualization CC-By-SA 2.0 <a href="http://freemap.sk">Freemap.sk</a>'
            }
        },
        MtbMap: {
            url: "http://tile.mtbmap.cz/mtbmap_tiles/{z}/{x}/{y}.png",
            options: {
                attribution: "{attribution.OpenStreetMap} &amp; USGS"
            }
        },
        CartoDB: {
            url: "https://{s}.basemaps.cartocdn.com/{variant}/{z}/{x}/{y}{r}.png",
            options: {
                attribution: '{attribution.OpenStreetMap} &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: "abcd",
                maxZoom: 20,
                variant: "light_all"
            },
            variants: {
                Positron: "light_all",
                PositronNoLabels: "light_nolabels",
                PositronOnlyLabels: "light_only_labels",
                DarkMatter: "dark_all",
                DarkMatterNoLabels: "dark_nolabels",
                DarkMatterOnlyLabels: "dark_only_labels",
                Voyager: "rastertiles/voyager",
                VoyagerNoLabels: "rastertiles/voyager_nolabels",
                VoyagerOnlyLabels: "rastertiles/voyager_only_labels",
                VoyagerLabelsUnder: "rastertiles/voyager_labels_under"
            }
        },
        HikeBike: {
            url: "https://tiles.wmflabs.org/{variant}/{z}/{x}/{y}.png",
            options: {
                maxZoom: 19,
                attribution: "{attribution.OpenStreetMap}",
                variant: "hikebike"
            },
            variants: {
                HikeBike: {},
                HillShading: {
                    options: {
                        maxZoom: 15,
                        variant: "hillshading"
                    }
                }
            }
        },
        BasemapAT: {
            url: "https://maps{s}.wien.gv.at/basemap/{variant}/{type}/google3857/{z}/{y}/{x}.{format}",
            options: {
                maxZoom: 19,
                attribution: 'Datenquelle: <a href="https://www.basemap.at">basemap.at</a>',
                subdomains: [
                    "",
                    "1",
                    "2",
                    "3",
                    "4"
                ],
                type: "normal",
                format: "png",
                bounds: [
                    [
                        46.358770,
                        8.782379
                    ],
                    [
                        49.037872,
                        17.189532
                    ]
                ],
                variant: "geolandbasemap"
            },
            variants: {
                basemap: {
                    options: {
                        maxZoom: 20,
                        variant: "geolandbasemap"
                    }
                },
                grau: "bmapgrau",
                overlay: "bmapoverlay",
                terrain: {
                    options: {
                        variant: "bmapgelaende",
                        type: "grau",
                        format: "jpeg"
                    }
                },
                surface: {
                    options: {
                        variant: "bmapoberflaeche",
                        type: "grau",
                        format: "jpeg"
                    }
                },
                highdpi: {
                    options: {
                        variant: "bmaphidpi",
                        format: "jpeg"
                    }
                },
                orthofoto: {
                    options: {
                        maxZoom: 20,
                        variant: "bmaporthofoto30cm",
                        format: "jpeg"
                    }
                }
            }
        },
        nlmaps: {
            url: "https://service.pdok.nl/brt/achtergrondkaart/wmts/v2_0/{variant}/EPSG:3857/{z}/{x}/{y}.png",
            options: {
                minZoom: 6,
                maxZoom: 19,
                bounds: [
                    [
                        50.5,
                        3.25
                    ],
                    [
                        54,
                        7.6
                    ]
                ],
                attribution: 'Kaartgegevens &copy; <a href="https://www.kadaster.nl">Kadaster</a>'
            },
            variants: {
                "standaard": "standaard",
                "pastel": "pastel",
                "grijs": "grijs",
                "water": "water",
                "luchtfoto": {
                    "url": "https://service.pdok.nl/hwh/luchtfotorgb/wmts/v1_0/Actueel_ortho25/EPSG:3857/{z}/{x}/{y}.jpeg"
                }
            }
        },
        NASAGIBS: {
            url: "https://map1.vis.earthdata.nasa.gov/wmts-webmerc/{variant}/default/{time}/{tilematrixset}{maxZoom}/{z}/{y}/{x}.{format}",
            options: {
                attribution: 'Imagery provided by services from the Global Imagery Browse Services (GIBS), operated by the NASA/GSFC/Earth Science Data and Information System (<a href="https://earthdata.nasa.gov">ESDIS</a>) with funding provided by NASA/HQ.',
                bounds: [
                    [
                        -85.0511287776,
                        -179.999999975
                    ],
                    [
                        85.0511287776,
                        179.999999975
                    ]
                ],
                minZoom: 1,
                maxZoom: 9,
                format: "jpg",
                time: "",
                tilematrixset: "GoogleMapsCompatible_Level"
            },
            variants: {
                ModisTerraTrueColorCR: "MODIS_Terra_CorrectedReflectance_TrueColor",
                ModisTerraBands367CR: "MODIS_Terra_CorrectedReflectance_Bands367",
                ViirsEarthAtNight2012: {
                    options: {
                        variant: "VIIRS_CityLights_2012",
                        maxZoom: 8
                    }
                },
                ModisTerraLSTDay: {
                    options: {
                        variant: "MODIS_Terra_Land_Surface_Temp_Day",
                        format: "png",
                        maxZoom: 7,
                        opacity: 0.75
                    }
                },
                ModisTerraSnowCover: {
                    options: {
                        variant: "MODIS_Terra_NDSI_Snow_Cover",
                        format: "png",
                        maxZoom: 8,
                        opacity: 0.75
                    }
                },
                ModisTerraAOD: {
                    options: {
                        variant: "MODIS_Terra_Aerosol",
                        format: "png",
                        maxZoom: 6,
                        opacity: 0.75
                    }
                },
                ModisTerraChlorophyll: {
                    options: {
                        variant: "MODIS_Terra_Chlorophyll_A",
                        format: "png",
                        maxZoom: 7,
                        opacity: 0.75
                    }
                }
            }
        },
        NLS: {
            // NLS maps are copyright National library of Scotland.
            // http://maps.nls.uk/projects/api/index.html
            // Please contact NLS for anything other than non-commercial low volume usage
            //
            // Map sources: Ordnance Survey 1:1m to 1:63K, 1920s-1940s
            //   z0-9  - 1:1m
            //  z10-11 - quarter inch (1:253440)
            //  z12-18 - one inch (1:63360)
            url: "https://nls-{s}.tileserver.com/nls/{z}/{x}/{y}.jpg",
            options: {
                attribution: '<a href="http://geo.nls.uk/maps/">National Library of Scotland Historic Maps</a>',
                bounds: [
                    [
                        49.6,
                        -12
                    ],
                    [
                        61.7,
                        3
                    ]
                ],
                minZoom: 1,
                maxZoom: 18,
                subdomains: "0123"
            }
        },
        JusticeMap: {
            // Justice Map (http://www.justicemap.org/)
            // Visualize race and income data for your community, county and country.
            // Includes tools for data journalists, bloggers and community activists.
            url: "https://www.justicemap.org/tile/{size}/{variant}/{z}/{x}/{y}.png",
            options: {
                attribution: '<a href="http://www.justicemap.org/terms.php">Justice Map</a>',
                // one of 'county', 'tract', 'block'
                size: "county",
                // Bounds for USA, including Alaska and Hawaii
                bounds: [
                    [
                        14,
                        -180
                    ],
                    [
                        72,
                        -56
                    ]
                ]
            },
            variants: {
                income: "income",
                americanIndian: "indian",
                asian: "asian",
                black: "black",
                hispanic: "hispanic",
                multi: "multi",
                nonWhite: "nonwhite",
                white: "white",
                plurality: "plural"
            }
        },
        GeoportailFrance: {
            url: "https://wxs.ign.fr/{apikey}/geoportail/wmts?REQUEST=GetTile&SERVICE=WMTS&VERSION=1.0.0&STYLE={style}&TILEMATRIXSET=PM&FORMAT={format}&LAYER={variant}&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}",
            options: {
                attribution: '<a target="_blank" href="https://www.geoportail.gouv.fr/">Geoportail France</a>',
                bounds: [
                    [
                        -75,
                        -180
                    ],
                    [
                        81,
                        180
                    ]
                ],
                minZoom: 2,
                maxZoom: 18,
                // Get your own geoportail apikey here : http://professionnels.ign.fr/ign/contrats/
                // NB : 'choisirgeoportail' is a demonstration key that comes with no guarantee
                apikey: "choisirgeoportail",
                format: "image/png",
                style: "normal",
                variant: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2"
            },
            variants: {
                plan: "GEOGRAPHICALGRIDSYSTEMS.PLANIGNV2",
                parcels: {
                    options: {
                        variant: "CADASTRALPARCELS.PARCELLAIRE_EXPRESS",
                        style: "PCI vecteur",
                        maxZoom: 20
                    }
                },
                orthos: {
                    options: {
                        maxZoom: 19,
                        format: "image/jpeg",
                        variant: "ORTHOIMAGERY.ORTHOPHOTOS"
                    }
                }
            }
        },
        OneMapSG: {
            url: "https://maps-{s}.onemap.sg/v3/{variant}/{z}/{x}/{y}.png",
            options: {
                variant: "Default",
                minZoom: 11,
                maxZoom: 18,
                bounds: [
                    [
                        1.56073,
                        104.11475
                    ],
                    [
                        1.16,
                        103.502
                    ]
                ],
                attribution: '<img src="https://docs.onemap.sg/maps/images/oneMap64-01.png" style="height:20px;width:20px;"/> New OneMap | Map data &copy; contributors, <a href="http://SLA.gov.sg">Singapore Land Authority</a>'
            },
            variants: {
                Default: "Default",
                Night: "Night",
                Original: "Original",
                Grey: "Grey",
                LandLot: "LandLot"
            }
        },
        USGS: {
            url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSTopo/MapServer/tile/{z}/{y}/{x}",
            options: {
                maxZoom: 20,
                attribution: 'Tiles courtesy of the <a href="https://usgs.gov/">U.S. Geological Survey</a>'
            },
            variants: {
                USTopo: {},
                USImagery: {
                    url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryOnly/MapServer/tile/{z}/{y}/{x}"
                },
                USImageryTopo: {
                    url: "https://basemap.nationalmap.gov/arcgis/rest/services/USGSImageryTopo/MapServer/tile/{z}/{y}/{x}"
                }
            }
        },
        WaymarkedTrails: {
            url: "https://tile.waymarkedtrails.org/{variant}/{z}/{x}/{y}.png",
            options: {
                maxZoom: 18,
                attribution: 'Map data: {attribution.OpenStreetMap} | Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
            },
            variants: {
                hiking: "hiking",
                cycling: "cycling",
                mtb: "mtb",
                slopes: "slopes",
                riding: "riding",
                skating: "skating"
            }
        },
        OpenAIP: {
            url: "https://{s}.tile.maps.openaip.net/geowebcache/service/tms/1.0.0/openaip_basemap@EPSG%3A900913@png/{z}/{x}/{y}.{ext}",
            options: {
                attribution: '<a href="https://www.openaip.net/">openAIP Data</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-NC-SA</a>)',
                ext: "png",
                minZoom: 4,
                maxZoom: 14,
                tms: true,
                detectRetina: true,
                subdomains: "12"
            }
        },
        OpenSnowMap: {
            url: "https://tiles.opensnowmap.org/{variant}/{z}/{x}/{y}.png",
            options: {
                minZoom: 9,
                maxZoom: 18,
                attribution: 'Map data: {attribution.OpenStreetMap} & ODbL, &copy; <a href="https://www.opensnowmap.org/iframes/data.html">www.opensnowmap.org</a> <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>'
            },
            variants: {
                pistes: "pistes"
            }
        },
        AzureMaps: {
            url: "https://atlas.microsoft.com/map/tile?api-version={apiVersion}&tilesetId={variant}&x={x}&y={y}&zoom={z}&language={language}&subscription-key={subscriptionKey}",
            options: {
                attribution: "See https://docs.microsoft.com/en-us/rest/api/maps/render-v2/get-map-tile for details.",
                apiVersion: "2.0",
                variant: "microsoft.imagery",
                subscriptionKey: "<insert your subscription key here>",
                language: "en-US"
            },
            variants: {
                MicrosoftImagery: "microsoft.imagery",
                MicrosoftBaseDarkGrey: "microsoft.base.darkgrey",
                MicrosoftBaseRoad: "microsoft.base.road",
                MicrosoftBaseHybridRoad: "microsoft.base.hybrid.road",
                MicrosoftTerraMain: "microsoft.terra.main",
                MicrosoftWeatherInfraredMain: {
                    url: "https://atlas.microsoft.com/map/tile?api-version={apiVersion}&tilesetId={variant}&x={x}&y={y}&zoom={z}&timeStamp={timeStamp}&language={language}&subscription-key={subscriptionKey}",
                    options: {
                        timeStamp: "2021-05-08T09:03:00Z",
                        attribution: "See https://docs.microsoft.com/en-us/rest/api/maps/render-v2/get-map-tile#uri-parameters for details.",
                        variant: "microsoft.weather.infrared.main"
                    }
                },
                MicrosoftWeatherRadarMain: {
                    url: "https://atlas.microsoft.com/map/tile?api-version={apiVersion}&tilesetId={variant}&x={x}&y={y}&zoom={z}&timeStamp={timeStamp}&language={language}&subscription-key={subscriptionKey}",
                    options: {
                        timeStamp: "2021-05-08T09:03:00Z",
                        attribution: "See https://docs.microsoft.com/en-us/rest/api/maps/render-v2/get-map-tile#uri-parameters for details.",
                        variant: "microsoft.weather.radar.main"
                    }
                }
            }
        },
        SwissFederalGeoportal: {
            url: "https://wmts.geo.admin.ch/1.0.0/{variant}/default/current/3857/{z}/{x}/{y}.jpeg",
            options: {
                attribution: '&copy; <a href="https://www.swisstopo.admin.ch/">swisstopo</a>',
                minZoom: 2,
                maxZoom: 18,
                bounds: [
                    [
                        45.398181,
                        5.140242
                    ],
                    [
                        48.230651,
                        11.47757
                    ]
                ]
            },
            variants: {
                NationalMapColor: "ch.swisstopo.pixelkarte-farbe",
                NationalMapGrey: "ch.swisstopo.pixelkarte-grau",
                SWISSIMAGE: {
                    options: {
                        variant: "ch.swisstopo.swissimage",
                        maxZoom: 19
                    }
                }
            }
        }
    };
    L1.tileLayer.provider = function(provider, options) {
        return new L1.TileLayer.Provider(provider, options);
    };
    return L1;
});

},{"66dd50ad9a453a5e":"iFbO2"}]},["haX2K","2Xa5n"], "2Xa5n", "parcelRequire76d2")

//# sourceMappingURL=index.c194aca8.js.map
