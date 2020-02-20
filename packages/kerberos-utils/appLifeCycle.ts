import IAdapter from "./types/IAdapter";
import interceptor from "./interceptor";

export enum AppLifeCycleEnum {
  AppRegister = "_KERBEROS_APPREGISTER",
  AppUnRegister = "_KERBEROS_APPUNREGISTER"
}

export function appRegister(
  render: (root: Element)=>void,
  options: { adapter: null | IAdapter } = null
) {
  window.addEventListener(AppLifeCycleEnum.AppRegister, function(
    evt: CustomEvent
  ) {
    render(evt.detail.data.root);
     // set global state management adapter.
    if (options.adapter) {
      interceptor(options.adapter);
    }
  });
}

export function callAppRegister(arg: {root:Element}) {
  let event = new CustomEvent(AppLifeCycleEnum.AppRegister, {
    detail: {
      data: arg
    }
  });
  window.dispatchEvent(event);
}
