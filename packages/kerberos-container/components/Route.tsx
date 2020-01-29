import React, { Component } from "react";
import { AppConfig } from "./Container";
import { getAssetsUrlByCode } from "../api/index";
import { callAppRegister, appendAssets, emptyAssets } from "kerberos-utils";

export interface RouteProps extends AppConfig {
  strict?:boolean,
  sensitive?:boolean,
  exact?:boolean
}
interface RouteState {
  assetsUrls: string[];
}

export default class Route extends Component<RouteProps, RouteState> {
  state: RouteState = {
    assetsUrls: []
  };
  private refBase: HTMLDivElement;

  async componentDidMount() {
    await this.renderApp();
  }

  componentWillUnmount() {
    emptyAssets();
  }

  async renderApp() {
    let { code, url } = this.props;
    let { assetsUrls } = this.state;
    if (url && url.length > 0 && assetsUrls.length === 0) {
      assetsUrls = url as string[];
    }
    if (assetsUrls.length === 0) {
      let res = await getAssetsUrlByCode(code);
      assetsUrls = res.success ? (res.data as string[]) : assetsUrls;
    }
    if (assetsUrls.length > 0) {
      this.setState({ assetsUrls: assetsUrls as string[] });
      try {
        await appendAssets(assetsUrls as string[]);
        callAppRegister(this.refBase);
      } catch (err) {
        console.error(err);
      }
    }
  }

  render() {
    return (
      <div
        ref={(element: HTMLDivElement) => {
          this.refBase = element;
        }}
      ></div>
    );
  }
}
