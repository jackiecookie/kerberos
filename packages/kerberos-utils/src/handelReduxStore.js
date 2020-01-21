"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var const_1 = require("./const");
var cache_1 = require("./cache");
var storeKey = "_KERBEROS_STORES";
var dispatching = false;
function _findStore(appInstance) {
    if (!appInstance || typeof appInstance.props !== "object") {
        return null;
    }
    var _a = appInstance.props, children = _a.children, store = _a.store;
    if (store && store.getState && store.dispatch && store.subscribe) {
        return store;
    }
    if (children && typeof children === "object") {
        return _findStore(children);
    }
    else {
        return null;
    }
}
exports._findStore = _findStore;
function setStoreIntoCache(store) {
    var stores = _getStoreFromCache();
    stores.push(store);
    cache_1.setCache(storeKey, stores);
}
function _getStoreFromCache() {
    return cache_1.getCache(storeKey) || [];
}
exports._getStoreFromCache = _getStoreFromCache;
function dispatchStore(user, store) {
    if (dispatching) {
        return;
    }
    dispatching = true;
    var stores = _getStoreFromCache();
    stores.forEach(function (targeStore) {
        if (targeStore != store) {
            storeDispatch(targeStore, user);
        }
    });
    dispatching = false;
}
function storeDispatch(store, user) {
    var _a;
    if (user) {
        store.dispatch((_a = {
                type: const_1.USERMAYCHANGED
            },
            _a[const_1.USER] = user,
            _a));
    }
}
function initUserState(store) {
    var stores = _getStoreFromCache();
    var user = null;
    if (stores) {
        user = stores[0].getState()[const_1.USER];
    }
    storeDispatch(store, user);
}
function handelReduxStore(appInstance, init) {
    if (init === void 0) { init = false; }
    var store = _findStore(appInstance);
    if (store) {
        var state = store.getState();
        if (state && state[const_1.USER]) {
            if (init) {
                initUserState(store);
            }
            store.subscribe(function () {
                dispatchStore(store.getState()[const_1.USER], store);
            });
            setStoreIntoCache(store);
        }
    }
}
exports.handelReduxStore = handelReduxStore;
