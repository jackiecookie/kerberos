import React, { Component, ReactElement } from "react";
import ReactDOM from "react-dom";
import {
  isInContainer,
  handelReduxStore,
  appRegister as appLifeCycleAppRegister
} from "kerberos-utils";

function appRegister(
  app: Component | ReactElement | any,
  rootId: string = "subapp"
) {
  if (isInContainer()) {
    appLifeCycleAppRegister(function(evt: CustomEvent) {
      let appInstance = app();
      let root = evt.detail.data;
      handelReduxStore(appInstance, true);
      ReactDOM.render(appInstance, root);
    });
  } else {
    ReactDOM.render(app(), document.getElementById(rootId));
  }
}

export { appRegister };
