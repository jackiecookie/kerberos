import IAdapter from "../types/IAdapter";
import { Store } from "redux";
import BaseAdapter from "./baseAdapter";
let interceptorSymbol = Symbol("__interceptor__");
export default class ReduxAdapter extends BaseAdapter implements IAdapter {
  private store: Store;

  constructor(reduxStore: Store, events: string[]) {
    super(events);
    this.store = reduxStore;
  }

  query(name:string): any {
    return this.store.getState()[name];
  }
  commander(event: string, payload: object) {
    this.store.dispatch({
      type: event,
      ...payload
    });
  }

  interceptor(interceptor: (event: string, payload: object) => void): void {
    this.store[interceptorSymbol] = interceptor;
  }

  static middleware = store => {
    return function(next) {
      return function(action) {
        let storeIntercep =
          this &&
          typeof this[interceptorSymbol] === "function" &&
          this[interceptorSymbol];
        if (storeIntercep) {
          let event = action.type;
          let payload = { ...action };
          delete payload.type;
          storeIntercep(event, payload);
        }
        return next(action);
      };
    };
  };
}
