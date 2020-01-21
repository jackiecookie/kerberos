"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var namespace = 'KERBEROS';
exports.setCache = function (key, value) {
    if (!window[namespace]) {
        window[namespace] = {};
    }
    window[namespace][key] = value;
};
exports.getCache = function (key) {
    var cache = window[namespace];
    return cache && cache[key] ? cache[key] : null;
};
