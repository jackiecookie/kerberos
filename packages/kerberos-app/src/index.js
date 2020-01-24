"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_dom_1 = require("react-dom");
var kerberos_utils_1 = require("kerberos-utils");
function appRegister(app, rootId) {
    if (rootId === void 0) { rootId = "subapp"; }
    if (kerberos_utils_1.isInContainer()) {
        kerberos_utils_1.appRegister(function (evt) {
            var appInstance = app();
            var root = evt.detail.data;
            kerberos_utils_1.handelReduxStore(appInstance, true);
            react_dom_1.default.render(appInstance, root);
        });
    }
    else {
        react_dom_1.default.render(app(), document.getElementById(rootId));
    }
}
exports.appRegister = appRegister;
