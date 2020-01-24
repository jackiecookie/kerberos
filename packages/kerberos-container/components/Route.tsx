import React, { Component } from "react";
import { AppConfig } from "./Container";
import { getAssetsUrlByCode } from "../api/index";
import { callAppRegister,appendAssets, emptyAssets } from "kerberos-utils";

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
    try{
      await appendAssets(assetsUrls);
      callAppRegister(this.refBase);
    }
    catch(err){
      console.error(err)
    }
  
  
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
