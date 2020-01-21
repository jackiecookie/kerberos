import {
  appRegister,
  callAppRegister,
  AppLifeCycleEnum
} from "../appLifeCycle";

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
      callBack
    );
  });

  test("when callAppRegister callback need called", () => {
    let arg = 1;
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
