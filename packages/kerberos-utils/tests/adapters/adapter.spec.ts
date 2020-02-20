import ReduxAdapter from "../../adapters/reduxAdapter";
import { createStore, applyMiddleware } from "redux";

let reducer = function(state, action) {
  return { payload: action.payload };
};

describe("test ReduxAdapter", () => {
  let store = createStore(reducer, applyMiddleware(ReduxAdapter.middleware));
  test("should `new ReduxAdapter()` get IAapter instance", () => {
    let reduxAdapterInstance = new ReduxAdapter(store, []);
    expect(reduxAdapterInstance.commander).toEqual(expect.any(Function));
    expect(reduxAdapterInstance.interceptor).toEqual(expect.any(Function));
    expect(reduxAdapterInstance.query).toEqual(expect.any(Function));
  });

  test("should reduxAdapter word correctly", () => {
    let reduxAdapterInstance = new ReduxAdapter(store, ["true"]);
    reduxAdapterInstance.commander("test", { payload: 1 });
    expect(store.getState().payload).toEqual(1);
    expect(reduxAdapterInstance.query("payload")).toEqual(1);
    expect(reduxAdapterInstance.eventFilter("true")).toBeTruthy();
    expect(reduxAdapterInstance.eventFilter("false")).toBeFalsy();
  });
});

import VuexAdapter from "../../adapters/vuexAdapter";
import Vuex from "vuex";
import Vue from "vue";

describe("test VuexAdapter", () => {
  Vue.use(Vuex);
  const store = new Vuex.Store({
    state: {
      payload: 0
    },
    mutations: {
      test(state, data) {
        state.payload = data.payload;
      }
    }
  });
  test("should `new VuexAdapter()` get IAapter instance", () => {
    let vueAdapterInstance = new VuexAdapter(store, []);
    expect(vueAdapterInstance.commander).toEqual(expect.any(Function));
    expect(vueAdapterInstance.interceptor).toEqual(expect.any(Function));
    expect(vueAdapterInstance.query).toEqual(expect.any(Function));
  });

  test("should vuexAdapter word correctly", () => {
    let vueAdapterInstance = new VuexAdapter(store, ["true"]);
    vueAdapterInstance.commander("test", { payload: 1 });
    expect(store.state.payload).toEqual(1);
    expect(vueAdapterInstance.query("payload")).toEqual(1);
    expect(vueAdapterInstance.eventFilter("true")).toBeTruthy();
    expect(vueAdapterInstance.eventFilter("false")).toBeFalsy();
  });
});
