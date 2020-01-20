import { appRegister as appLifeCycleAppRegister } from "../utils/appLifeCycle";
import React, { Component, ReactElement } from "react";
import ReactDOM from "react-dom";
import { isInContainer } from "../utils/handleAssets";
import handelReduxStore from "../utils/handelReduxStore";


function appRegister(
  app: Component | ReactElement | any,
  rootId: string = "subapp"
) {
  if (isInContainer()) {
    appLifeCycleAppRegister(function(evt: CustomEvent) {
      let appInstance = app();
      let root = evt.detail.data;
      handelReduxStore(appInstance,true);
      ReactDOM.render(appInstance, root);
    });
  } else {
    ReactDOM.render(app(), document.getElementById(rootId));
  }
}

export { appRegister };
