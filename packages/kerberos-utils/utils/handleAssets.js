"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var cache_1 = require("./cache");
var message_1 = require("./message");
var PREFIX = "kerberos";
var DYNAMIC = "dynamic";
var STATIC = "static";
var IS_CSS_REGEX = /\.css(\?((?!\.js$).)+)?$/;
var getCacheRoot = function () { return cache_1.getCache("root"); };
var COMMENT_REGEX = /<!--.*?-->/g;
var SCRIPT_REGEX = /<script\b[^>]*>([^<]*)<\/script>/gi;
var SCRIPT_SRC_REGEX = /<script\b[^>]*src=['"]?([^'"]*)['"]?\b[^>]*>/gi;
var LINK_HREF_REGEX = /<link\b[^>]*href=['"]?([^'"]*)['"]?\b[^>]*>/gi;
var STYLE_SHEET_REGEX = /rel=['"]stylesheet['"]/gi;
var AssetTypeEnum;
(function (AssetTypeEnum) {
    AssetTypeEnum["INLINE"] = "inline";
    AssetTypeEnum["EXTERNAL"] = "external";
})(AssetTypeEnum = exports.AssetTypeEnum || (exports.AssetTypeEnum = {}));
var AssetCommentEnum;
(function (AssetCommentEnum) {
    AssetCommentEnum["REPLACED"] = "replaced";
    AssetCommentEnum["PROCESSED"] = "processed";
})(AssetCommentEnum = exports.AssetCommentEnum || (exports.AssetCommentEnum = {}));
/**
 * Create link element and append to root
 */
function appendLink(root, asset, id) {
    return new Promise(function (resolve, reject) {
        if (!root)
            reject(new Error("no root element for css assert: " + asset));
        var element = document.createElement("link");
        element.setAttribute(PREFIX, DYNAMIC);
        element.id = id;
        element.rel = "stylesheet";
        element.href = asset;
        element.addEventListener("error", function () {
            message_1.error("css asset loaded error: " + asset);
            return resolve();
        }, false);
        element.addEventListener("load", function () { return resolve(); }, false);
        root.appendChild(element);
    });
}
exports.appendLink = appendLink;
/**
 * Create script element (without inline) and append to root
 */
function appendExternalScript(root, asset, id) {
    return new Promise(function (resolve, reject) {
        if (!root)
            reject(new Error("no root element for js assert: " + asset));
        var element = document.createElement("script");
        element.setAttribute(PREFIX, DYNAMIC);
        element.id = id;
        element.type = "text/javascript";
        element.src = asset;
        element.async = false;
        element.addEventListener("error", function () { return reject(new Error("js asset loaded error: " + asset)); }, false);
        element.addEventListener("load", function () { return resolve(); }, false);
        root.appendChild(element);
    });
}
exports.appendExternalScript = appendExternalScript;
function appendAllLink(root, urlList) {
    return Promise.all(urlList.map(function (cssUrl, index) {
        return appendLink(root, cssUrl, PREFIX + "-css-" + index);
    }));
}
exports.appendAllLink = appendAllLink;
function appendAllScriptWithOutInline(root, urlList) {
    return Promise.all(urlList.map(function (jsUrl, index) {
        return appendExternalScript(root, jsUrl, PREFIX + "-js-" + index);
    }));
}
exports.appendAllScriptWithOutInline = appendAllScriptWithOutInline;
function appendAssets(assetsList, useShadow) {
    if (useShadow === void 0) { useShadow = true; }
    return __awaiter(this, void 0, void 0, function () {
        var jsRoot, cssRoot, jsList, cssList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    jsRoot = document.getElementsByTagName("head")[0];
                    cssRoot = useShadow
                        ? getCacheRoot()
                        : document.getElementsByTagName("head")[0];
                    jsList = [];
                    cssList = [];
                    assetsList.forEach(function (url) {
                        var isCss = IS_CSS_REGEX.test(url);
                        if (isCss) {
                            cssList.push(url);
                        }
                        else {
                            jsList.push(url);
                        }
                    });
                    if (!useShadow) return [3 /*break*/, 3];
                    // make sure css loads after all js have been loaded under shadowRoot
                    return [4 /*yield*/, appendAllScriptWithOutInline(jsRoot, jsList)];
                case 1:
                    // make sure css loads after all js have been loaded under shadowRoot
                    _a.sent();
                    return [4 /*yield*/, appendAllLink(cssRoot, cssList)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 3: return [4 /*yield*/, appendAllLink(cssRoot, cssList)];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, appendAllScriptWithOutInline(jsRoot, jsList)];
                case 5:
                    _a.sent();
                    _a.label = 6;
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.appendAssets = appendAssets;
function parseUrl(entry) {
    var a = document.createElement("a");
    a.href = entry;
    return {
        origin: a.origin,
        pathname: a.pathname
    };
}
exports.parseUrl = parseUrl;
function startWith(url, prefix) {
    return url.slice(0, prefix.length) === prefix;
}
exports.startWith = startWith;
function getUrl(entry, relativePath) {
    var _a = parseUrl(entry), origin = _a.origin, pathname = _a.pathname;
    if (startWith(relativePath, "./")) {
        var rPath = relativePath.slice(1);
        if (!pathname || pathname === "/") {
            return "" + origin + rPath;
        }
        var pathArr = pathname.split("/");
        pathArr.splice(-1);
        return "" + origin + pathArr.join("/") + rPath;
    }
    else if (startWith(relativePath, "/")) {
        return "" + origin + relativePath;
    }
    else {
        return origin + "/" + relativePath;
    }
}
exports.getUrl = getUrl;
/**
 * If script/link processed by @ice/stark, add comment for it
 */
function getComment(tag, from, type) {
    return "<!--" + tag + " " + from + " " + type + " by @ice/stark-->";
}
exports.getComment = getComment;
/**
 * html -> { html: processedHtml, assets: processedAssets }
 */
function processHtml(html, entry) {
    if (!html)
        return { html: "", assets: [] };
    var processedAssets = [];
    var processedHtml = html
        .replace(COMMENT_REGEX, "")
        .replace(SCRIPT_REGEX, function (arg1, arg2) {
        if (!arg1.match(SCRIPT_SRC_REGEX)) {
            processedAssets.push({
                type: AssetTypeEnum.INLINE,
                content: arg2
            });
            return getComment("script", "inline", AssetCommentEnum.REPLACED);
        }
        else {
            return arg1.replace(SCRIPT_SRC_REGEX, function (_, argSrc2) {
                var url = argSrc2.indexOf("//") >= 0 ? argSrc2 : getUrl(entry, argSrc2);
                processedAssets.push({
                    type: AssetTypeEnum.EXTERNAL,
                    content: url
                });
                return getComment("script", argSrc2, AssetCommentEnum.REPLACED);
            });
        }
    })
        .replace(LINK_HREF_REGEX, function (arg1, arg2) {
        // not stylesheet, return as it is
        if (!arg1.match(STYLE_SHEET_REGEX)) {
            return arg1;
        }
        var url = arg2.indexOf("//") >= 0 ? arg2 : getUrl(entry, arg2);
        return getComment("link", arg2, AssetCommentEnum.PROCESSED) + "   " + arg1.replace(arg2, url);
    });
    return {
        html: processedHtml,
        assets: processedAssets
    };
}
exports.processHtml = processHtml;
/**
 * Append external/inline script to root, need to be appended in order
 */
function appendScript(root, asset) {
    var type = asset.type, content = asset.content;
    return new Promise(function (resolve, reject) {
        var script = document.createElement("script");
        // inline script
        if (type === AssetTypeEnum.INLINE) {
            script.innerHTML = content;
            root.appendChild(script);
            resolve();
            return;
        }
        // external script
        script.setAttribute("src", content);
        script.addEventListener("load", function () { return resolve(); }, false);
        script.addEventListener("error", function () {
            return reject(new Error("js asset loaded error: " + content));
        });
        root.appendChild(script);
    });
}
exports.appendScript = appendScript;
function appendProcessedContent(root, processedContent) {
    return __awaiter(this, void 0, void 0, function () {
        var processedHtml, assets;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    processedHtml = processedContent.html, assets = processedContent.assets;
                    root.innerHTML = processedHtml;
                    // make sure assets loaded in order
                    return [4 /*yield*/, Array.prototype.slice.apply(assets).reduce(function (chain, asset) {
                            return chain.then(function () { return appendScript(root, asset); });
                        }, Promise.resolve())];
                case 1:
                    // make sure assets loaded in order
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.appendProcessedContent = appendProcessedContent;
function recordAssets() {
    // getElementsByTagName is faster than querySelectorAll
    var styleList = document.getElementsByTagName("style");
    var linkList = document.getElementsByTagName("link");
    var jsList = document.getElementsByTagName("script");
    for (var i = 0; i < styleList.length; i++) {
        setStaticAttribute(styleList[i]);
    }
    for (var i = 0; i < linkList.length; i++) {
        setStaticAttribute(linkList[i]);
    }
    for (var i = 0; i < jsList.length; i++) {
        setStaticAttribute(jsList[i]);
    }
}
exports.recordAssets = recordAssets;
function setStaticAttribute(tag) {
    if (tag.getAttribute(PREFIX) !== DYNAMIC) {
        tag.setAttribute(PREFIX, STATIC);
    }
    tag = null;
}
exports.setStaticAttribute = setStaticAttribute;
function emptyAssets() {
    // remove extra assets
    var styleList = document.querySelectorAll("style:not([" + PREFIX + "=" + STATIC + "])");
    styleList.forEach(function (style) {
        style.parentNode.removeChild(style);
    });
    var linkList = document.querySelectorAll("link:not([" + PREFIX + "=" + STATIC + "])");
    linkList.forEach(function (link) {
        link.parentNode.removeChild(link);
    });
    var jsExtraList = document.querySelectorAll("script:not([" + PREFIX + "=" + STATIC + "])");
    jsExtraList.forEach(function (js) {
        js.parentNode.removeChild(js);
    });
}
exports.emptyAssets = emptyAssets;
function setContainerFlag() {
    var bodyElm = document.getElementsByTagName("body")[0];
    setStaticAttribute(bodyElm);
}
exports.setContainerFlag = setContainerFlag;
function isInContainer() {
    var bodyElm = document.getElementsByTagName("body")[0];
    return bodyElm.getAttribute(PREFIX) === STATIC;
}
exports.isInContainer = isInContainer;
