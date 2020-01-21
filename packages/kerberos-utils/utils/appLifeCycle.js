"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var AppLifeCycleEnum;
(function (AppLifeCycleEnum) {
    AppLifeCycleEnum["AppRegister"] = "_KERBEROS_APPREGISTER";
    AppLifeCycleEnum["AppUnRegister"] = "_KERBEROS_APPUNREGISTER";
})(AppLifeCycleEnum = exports.AppLifeCycleEnum || (exports.AppLifeCycleEnum = {}));
function appRegister(callBack) {
    window.addEventListener(AppLifeCycleEnum.AppRegister, callBack);
}
exports.appRegister = appRegister;
function callAppRegister(arg) {
    var event = new CustomEvent(AppLifeCycleEnum.AppRegister, {
        detail: {
            data: arg
        }
    });
    window.dispatchEvent(event);
}
exports.callAppRegister = callAppRegister;
