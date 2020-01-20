export enum AppLifeCycleEnum {
  AppRegister = "_KERBEROS_APPREGISTER",
  AppUnRegister = "_KERBEROS_APPUNREGISTER"
}

export function appRegister(callBack: EventListener) {
  window.addEventListener(AppLifeCycleEnum.AppRegister, callBack);
}

export function callAppRegister(arg: any) {
  let event = new CustomEvent(AppLifeCycleEnum.AppRegister, {
    detail:{
      data:arg
    }
  });
  window.dispatchEvent(event);
}
