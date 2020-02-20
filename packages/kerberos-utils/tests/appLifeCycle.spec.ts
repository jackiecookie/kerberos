import {
  appRegister,
  callAppRegister,
  AppLifeCycleEnum
} from "../appLifeCycle";

import IAdapter from "../types/IAdapter";

class AdapterForTest implements IAdapter {
  query(): void {}
  commander(event: string, payload: object): void {}
  eventFilter(event: string): boolean {
    return true;
  }
  interceptor(interceptor: (event: string, payload: object) => void): void {}
}

describe("appLifeCycle", () => {
  let callBack = jest.fn();
  beforeAll(() => {
    window.addEventListener = jest.fn();
    window.dispatchEvent = jest.fn();
  });

  afterAll(() => {
    (window.addEventListener as jest.Mock).mockReset();
    (window.dispatchEvent as jest.Mock).mockReset();
  });

  test("appRegister need addEventListener", () => {
    appRegister(callBack);
    expect(window.addEventListener).toBeCalledTimes(1);
    expect(window.addEventListener).toBeCalledWith(
      AppLifeCycleEnum.AppRegister,
      expect.any(Function)
    );

    (window.addEventListener as jest.Mock).mockClear();
  });

  test("appRegister call with options then callAppRegister", () => {
    let adapter = new AdapterForTest();
    let interceptor = jest.spyOn(adapter, "interceptor");
    let root = document.createElement("div");
    let event = new CustomEvent(AppLifeCycleEnum.AppRegister, {
      detail: {
        data: { root }
      }
    });
    appRegister(callBack, { adapter });
    let callback = (window.addEventListener as jest.Mock).mock.calls[0][1];
    callback(event);
    expect(interceptor).toHaveBeenCalledTimes(1);
    expect(interceptor).toBeCalledWith(expect.any(Function));
  });

  test("when callAppRegister callback need called", () => {
    let root = document.createElement("div");
    let arg = { root, interceptor: null };
    callAppRegister(arg);
    expect(window.dispatchEvent).toBeCalledTimes(1);
    let event = new CustomEvent(AppLifeCycleEnum.AppRegister, {
      detail: {
        data: arg
      }
    });
    expect(window.dispatchEvent).toBeCalledWith(event);
  });
});
