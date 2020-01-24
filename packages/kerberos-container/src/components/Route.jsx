var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import React, { Component } from "react";
import { getAssetsUrlByCode } from "../api/index";
import { callAppRegister, appendAssets, emptyAssets } from "kerberos-utils";
export default class Route extends Component {
    componentDidMount() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.renderApp();
        });
    }
    componentWillUnmount() {
        emptyAssets();
    }
    renderApp() {
        return __awaiter(this, void 0, void 0, function* () {
            let { code, url } = this.props;
            let { assetsUrls } = this.state;
            if (url && url.length > 0 && !assetsUrls) {
                assetsUrls = url;
            }
            if (!assetsUrls) {
                let res = yield getAssetsUrlByCode(code);
                assetsUrls = res.success ? res.data : assetsUrls;
            }
            if (assetsUrls) {
                this.setState({ assetsUrls: assetsUrls });
                try {
                    yield appendAssets(assetsUrls);
                    callAppRegister(this.refBase);
                }
                catch (err) {
                    console.error(err);
                }
            }
        });
    }
    render() {
        return (<div ref={(element) => {
            this.refBase = element;
        }}></div>);
    }
}
