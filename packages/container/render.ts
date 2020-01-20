import React, { Component, ReactElement } from "react";
import ReactDOM from "react-dom";
import handelReduxStore from "../utils/handelReduxStore";

function render(
  app: Component | ReactElement | any,
  root: HTMLElement
) {
  let appInstance = app();
  handelReduxStore(appInstance);
  ReactDOM.render(appInstance, root);
}

export default render;
