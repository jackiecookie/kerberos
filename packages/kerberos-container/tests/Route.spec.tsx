import Route from "../components/Route";
import { render } from "@testing-library/react";
import React from "react";
import { getAssetsUrlByCode } from "../api/index";
import { JSDOM } from "jsdom";
import * as utils from "kerberos-utils";

jest.mock("../api/index", () => ({
  getAssetsUrlByCode: jest.fn()
}));

const callAppRegister = jest.spyOn(utils, "callAppRegister");

let jestGlobal = global as any;

jestGlobal.document = new JSDOM("<html><head></head><body></body></html>");

describe("test component Route", () => {
  let expectJsScript = function(url, done) {
    let scriptLink = jestGlobal.document.querySelector(`[src='${url}']`);
    expect(scriptLink).not.toBeNull();
    expect(scriptLink.hasAttributes("kerberos")).toBeTruthy();
    let loadedEvent = jestGlobal.document.createEvent("HTMLEvents");
    loadedEvent.initEvent("load", true, true);
    scriptLink.dispatchEvent(loadedEvent);
    setTimeout(() => {
      expect(callAppRegister).toHaveBeenCalledTimes(1);
      done();
    }, 0);
  };

  afterEach(() => {
    callAppRegister.mockClear();
  });

  test("render Route has urls", async done => {
    let code = "code";
    let url = "http://localhost:8080/test.js";
    render(<Route path="/" code={code} url={[url]} />);
    expect(getAssetsUrlByCode).toBeCalledTimes(0);
    expectJsScript(url, done);
  });

  test("render Route only have code", async done => {
    let code = "code";
    let codeJsUrl = "http://localhost:8080/testcodeJsUrl.js";
    (getAssetsUrlByCode as jest.Mock).mockResolvedValueOnce({
      success: true,
      data: [codeJsUrl]
    });
    render(<Route path="/" code={code} />);
    expect(getAssetsUrlByCode).toBeCalledTimes(1);
    expect(getAssetsUrlByCode).toBeCalledWith(code);
    setTimeout(() => {
      expectJsScript(codeJsUrl, done);
    }, 0);
  });
});
