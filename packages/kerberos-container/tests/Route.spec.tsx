import Route from "../components/Route";
import { render } from "@testing-library/react";
import React from "react";
import { getAssetsUrlByCode } from "../api/index";
import { JSDOM } from "jsdom";
import * as utils from "kerberos-utils";


import fetchMock, { FetchMock } from "jest-fetch-mock";
(fetchMock as FetchMock).enableMocks();

jest.mock("../api/index", () => ({
  getAssetsUrlByCode: jest.fn()
}));

const callAppRegister = jest.spyOn(utils, "callAppRegister");

const sandboxExecute = jest.spyOn(utils.Sandbox.prototype, "execute");

let jestGlobal = global as any;

jestGlobal.document = new JSDOM("<html><head></head><body></body></html>");

describe("test component Route", () => {
  let scipt = "let s = '1'";
  /**
   * route中的js会在沙箱中执行
   */
  let expectJsScript = function(url, done) {
    let scriptLink = jestGlobal.document.querySelector(`[src='${url}']`);
    expect(scriptLink).toBeNull();
    setTimeout(function(){
      expect(sandboxExecute).toBeCalledTimes(1);
      expect(sandboxExecute).toBeCalledWith(scipt);
      expect(callAppRegister).toHaveBeenCalledTimes(1);
      done();
    },0)
  };

  beforeAll(()=>{
    (fetchMock as FetchMock).mockResponse(scipt);
  })

  afterEach(() => {
    callAppRegister.mockClear();
    sandboxExecute.mockClear();
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
