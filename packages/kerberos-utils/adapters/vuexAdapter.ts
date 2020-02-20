import IAdapter from "../types/IAdapter";
import { Store } from "vuex";
import BaseAdapter from "./baseAdapter";

export default class VuexAdapter extends BaseAdapter implements IAdapter {
  private store: Store<any>;

  constructor(vuexStore: Store<any>, events: string[]) {
    super(events);
    this.store = vuexStore;
  }
  query(name:string): any {
    return this.store.state[name];
  }
  commander(event: string, payload: object): void {
    this.store.commit(event, payload);
  }
  interceptor(interceptor: (event: string, payload: object) => void): void {
    this.store.subscribe(function(mutations){
      debugger
      interceptor(mutations.type, mutations.payload);
    });
  }
}
