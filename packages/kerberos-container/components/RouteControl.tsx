import React, { Component } from "react";
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

  componentWillUnmount(){
    this.unhijackHistory();
  }

  hijackHistory = (): void => {
    window.history.pushState = (
      state: any,
      title: string,
      url?: string,
      ...rest
    ) => {
      this.originalPush.apply(window.history, [state, title, url, ...rest]);
      this.handleStateChange(state, url, "pushState");
    };

    window.history.replaceState = (
      state: any,
      title: string,
      url?: string,
      ...rest
    ) => {
      this.originalReplace.apply(window.history, [state, title, url, ...rest]);
      this.handleStateChange(state, url, "replaceState");
    };

    window.addEventListener("popstate", this.handlePopState, false);
  };

  unhijackHistory = ():void=>{
    window.history.pushState = this.originalPush;
    window.history.replaceState = this.originalReplace;
    window.removeEventListener("popstate",this.handlePopState, false)
  }

  //后退
  handlePopState = (state): void => {
    const url = location.href;
    this.handleStateChange(state, url, "popstate");
  };

  handleStateChange(state: string, url: string, type: string): void {
    this.setState({
      url
    });
  }

  render() {
    let { children } = this.props;
    let { url } = this.state;
    const { pathname, query } = urlParse(url, true);
    let currentRoute = null;
    let matchRes = null;
    React.Children.forEach(children as Route[], child => {
      if (currentRoute == null && React.isValidElement(child)) {
        let { path } = child.props as RouteProps;
        matchRes = path ? matchPath(pathname, { ...child.props }) : null;
        if (matchRes) currentRoute = child;
      }
    });

    if (currentRoute) {
      return <div>{React.cloneElement(currentRoute)}</div>;
    } else {
      return <div>404</div>;
    }
  }
}
