
jest.mock("kerberos-utils");
jest.mock("react-dom");

import { appRegister } from "../index";

import {
  appRegister as appLifeCycleAppRegister,
  isInContainer
} from "kerberos-utils";
import ReactDOM from "react-dom";
import React from "react";

function Noop() {
  return <div>Noop</div>;
}

describe("test appRegister", () => {
  document.getElementById = jest.fn(elementId => {
    return elementId as any;
  });
   //@ts-ignore
  ReactDOM.render = jest.fn();
  beforeEach(function(){
    (ReactDOM.render as jest.Mock<any, any>).mockClear()
  })

 

  test("render component in root provide when not in container", () => {
    (isInContainer as jest.Mock).mockReturnValueOnce(false);
    // not in container
    let rootId = "rootId";
    appRegister(Noop, rootId);
    expect(ReactDOM.render).toBeCalledTimes(1);
    expect(ReactDOM.render).toBeCalledWith(Noop(), rootId);
  });

  test("register callback into lifeCycle when in container", () => {
    (isInContainer as jest.Mock).mockReturnValueOnce(true);
    // in container
    appRegister(Noop);
    expect(appLifeCycleAppRegister).toBeCalledTimes(1);
    let callback = (appLifeCycleAppRegister as jest.Mock).mock.calls[0][0];
    let containerRootId = "containerRootId";
    // call callback manually
    callback(containerRootId);
    expect(ReactDOM.render).toBeCalledTimes(1);
    expect(ReactDOM.render).toBeCalledWith(Noop(), containerRootId);
  });
});
