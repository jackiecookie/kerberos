"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var path_to_regexp_1 = require("path-to-regexp");
var cache = {};
var cacheLimit = 10000;
var cacheCount = 0;
function compilePath(path, options) {
    var cacheKey = "" + options.end + options.strict + options.sensitive;
    var pathCache = cache[cacheKey] || (cache[cacheKey] = {});
    if (pathCache[path])
        return pathCache[path];
    var keys = [];
    var regexp = path_to_regexp_1.pathToRegexp(path, keys, options);
    var result = { regexp: regexp, keys: keys };
    if (cacheCount < cacheLimit) {
        pathCache[path] = result;
        cacheCount++;
    }
    return result;
}
function matchPath(pathname, options) {
    if (options === void 0) { options = {}; }
    if (typeof options === 'string')
        options = { path: options };
    var path = options.path, _a = options.exact, exact = _a === void 0 ? false : _a, _b = options.strict, strict = _b === void 0 ? false : _b, _c = options.sensitive, sensitive = _c === void 0 ? false : _c;
    var paths = [].concat(path);
    return paths.reduce(function (matched, path) {
        if (!path)
            return null;
        if (matched)
            return matched;
        var _a = compilePath(path, {
            end: exact,
            strict: strict,
            sensitive: sensitive,
        }), regexp = _a.regexp, keys = _a.keys;
        var match = regexp.exec(pathname);
        if (!match)
            return null;
        var url = match[0], values = match.slice(1);
        var isExact = pathname === url;
        if (exact && !isExact)
            return null;
        return {
            path: path,
            url: path === '/' && url === '' ? '/' : url,
            isExact: isExact,
            params: keys.reduce(function (memo, key, index) {
                memo[key.name] = values[index];
                return memo;
            }, {}),
        };
    }, null);
}
exports.matchPath = matchPath;
