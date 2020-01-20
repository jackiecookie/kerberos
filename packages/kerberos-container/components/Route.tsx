import React, { Component } from "react";
import { AppConfig } from "./Container";
// import { setCache, getCache } from "../../utils/cache";
import { appendAssets, emptyAssets } from "../../utils/handleAssets";
import { getAssetsUrlByCode } from "../api/index";
import { callAppRegister } from "../../utils/appLifeCycle";

export interface RouteProps extends AppConfig {}
interface RouteState {
  assetsUrls: string[];
}

export default class Route extends Component<RouteProps, RouteState> {
  state = {
    assetsUrls: null
  };

  private refBase: HTMLDivElement = null;

  async componentDidMount() {
    await this.renderApp();
  }

  componentWillUnmount() {
   // this.refBase.innerHTML = ''
    emptyAssets();
  }

  async renderApp() {
    let { code, url } = this.props;
    let { assetsUrls } = this.state;
    if (url && url.length > 0 && !assetsUrls) {
      assetsUrls = url;
    }
    if (!assetsUrls) {
      let res = await getAssetsUrlByCode(code);
      assetsUrls = res.success ? res.data : assetsUrls;
    }
    this.setState({ assetsUrls });
    await appendAssets(assetsUrls);
    callAppRegister(this.refBase);
  }
 
  render() {
    return (
      <div
        ref={element => {
          this.refBase = element;
        }}
      ></div>
    );
  }
}
