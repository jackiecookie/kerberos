import React, { Component } from "react";
import urlParse from "url-parse";
import { matchPath } from "kerberos-utils";
export default class RouteControl extends Component {
    constructor() {
        super(...arguments);
        this.state = {
            url: window.location.href
        };
        this.originalPush = window.history.pushState;
        this.originalReplace = window.history.replaceState;
        this.hijackHistory = () => {
            window.history.pushState = (state, title, url, ...rest) => {
                this.originalPush.apply(window.history, [state, title, url, ...rest]);
                this.handleStateChange(url);
            };
            window.history.replaceState = (state, title, url, ...rest) => {
                this.originalReplace.apply(window.history, [state, title, url, ...rest]);
                this.handleStateChange(url);
            };
            window.addEventListener("popstate", this.handlePopState, false);
        };
        this.unhijackHistory = () => {
            window.history.pushState = this.originalPush;
            window.history.replaceState = this.originalReplace;
            window.removeEventListener("popstate", this.handlePopState, false);
        };
        //后退
        this.handlePopState = () => {
            const url = location.href;
            this.handleStateChange(url);
        };
    }
    componentDidMount() {
        this.hijackHistory();
    }
    componentWillUnmount() {
        this.unhijackHistory();
    }
    handleStateChange(url) {
        this.setState({
            url
        });
    }
    render() {
        let { children } = this.props;
        let { url } = this.state;
        const { pathname } = urlParse(url, true);
        let currentRoute = undefined;
        let matchRes = null;
        React.Children.forEach(children, child => {
            if (currentRoute == null && React.isValidElement(child)) {
                let { path } = child.props;
                matchRes = path ? matchPath(pathname, Object.assign({}, child.props)) : null;
                if (matchRes)
                    currentRoute = child;
            }
        });
        if (currentRoute) {
            return <div>{React.cloneElement(currentRoute)}</div>;
        }
        else {
            return <div>404</div>;
        }
    }
}
