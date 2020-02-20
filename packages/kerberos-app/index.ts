import { Component, ReactElement } from "react";
import ReactDOM from "react-dom";
import IAdapter from "kerberos-utils/types/IAdapter";
import {
  isInContainer,
  handelReduxStore,
  appRegister as appLifeCycleAppRegister
} from "kerberos-utils";

function appRegister(
  app: Component | ReactElement | any,
  rootId: string = "subapp",
  options:{ adapter: null | IAdapter } = null
) {
  if (isInContainer()) {
    appLifeCycleAppRegister(function(root: Element) {
      let appInstance = app();
      handelReduxStore(appInstance, true);
      ReactDOM.render(appInstance, root);
    },options);
  } else {
    ReactDOM.render(app(), document.getElementById(rootId));
  }
}

export { appRegister };
