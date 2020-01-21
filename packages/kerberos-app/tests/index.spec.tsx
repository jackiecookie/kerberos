jest.mock("kerberos-utils/appLifeCycle");
jest.mock("kerberos-utils/handleAssets");
jest.mock("react-dom");

import { appRegister } from "../index";
import { appRegister as appLifeCycleAppRegister } from "kerberos-utils/appLifeCycle";
import { isInContainer } from "kerberos-utils/handleAssets";
import ReactDOM from "react-dom";
import React from "react";

ReactDOM.render = jest.fn();

function Noop() {
  return <div>Noop</div>;
}

(isInContainer as jest.Mock).mockReturnValueOnce(false).mockReturnValueOnce(true);

describe("test appRegister", () => {
  test("render component in root provide when not in container", () => {
    // not in container
    let rootId = "rootId";
    appRegister(Noop, rootId);
    expect(ReactDOM.render).toBeCalledWith(Noop(),rootId)
  });

  test("register callback into lifeCycle when in container", () => {
    // in container
    appRegister(Noop);
    expect(appLifeCycleAppRegister).toBeCalledTimes(1);
    //appLifeCycleAppRegister.mock.calls
  });
});
