import React, { Component, ReactElement } from "react";
import Route, { RouteProps } from "./Route";
import urlParse from "url-parse";

import { matchPath } from "kerberos-utils";

export interface RouteChangeHocksProps {
  onAppLeave?: () => void;
  onAppEnter?: () => void;
}

interface OriginalStateFunction {
  (state: any, title: string, url?: string): void;
}

interface RouteControlProps extends RouteChangeHocksProps {}

interface State {
  url: String;
}

export default class RouteControl extends Component<RouteControlProps, State> {
  state = {
    url: window.location.href
  };

  private originalPush: OriginalStateFunction = window.history.pushState;

  private originalReplace: OriginalStateFunction = window.history.replaceState;

  componentDidMount() {
    this.hijackHistory();
  }

  componentWillUnmount() {
    this.unhijackHistory();
  }

  hijackHistory = (): void => {
    window.history.pushState = (
      state: any,
      title: string,
      url: string,
      ...rest
    ) => {
      this.originalPush.apply(window.history, [state, title, url, ...rest]);
      this.handleStateChange(url);
    };

    window.history.replaceState = (
      state: any,
      title: string,
      url: string,
      ...rest
    ) => {
      this.originalReplace.apply(window.history, [state, title, url, ...rest]);
      this.handleStateChange(url);
    };

    window.addEventListener("popstate", this.handlePopState, false);
  };

  unhijackHistory = (): void => {
    window.history.pushState = this.originalPush;
    window.history.replaceState = this.originalReplace;
    window.removeEventListener("popstate", this.handlePopState, false);
  };

  //后退
  handlePopState = (): void => {
    const url = location.href;
    this.handleStateChange(url);
  };

  handleStateChange(url: string): void {
    this.setState({
      url
    });
  }

  render() {
    let { children } = this.props;
    let { url } = this.state;
    const { pathname } = urlParse(url, true);
    let currentRoute = undefined as unknown;
    let matchRes = null as unknown;
    React.Children.forEach(children as Route[], child => {
      if (currentRoute == null && React.isValidElement(child)) {
        let { path } = child.props as RouteProps;
        if(path){
          matchRes = matchPath(pathname, { ...child.props })
        }
        if (matchRes) currentRoute = child;
      }
    });

    if (currentRoute) {
      return <div>{React.cloneElement(currentRoute as ReactElement)}</div>;
    } else {
      return <div>404</div>;
    }
  }
}
