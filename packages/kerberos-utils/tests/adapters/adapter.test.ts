import ReduxAdapter from "../../adapters/reduxAdapter";
import VuexAdapter from "../../adapters/vuexAdapter";
import { createStore, applyMiddleware } from "redux";
import Vuex from "vuex";
import Vue from "vue";
import interceptor from "../../interceptor";

let reducer = function(state, action) {
  return action.number;
};

describe("vuexAdapter work with reduxAdapter", () => {
  let reduxStore = createStore(
    reducer,
    applyMiddleware(ReduxAdapter.middleware)
  );

  Vue.use(Vuex);
  const vuexStore = new Vuex.Store({
    state: {
      number: 0
    },
    mutations: {
      test(state, data) {
        state.number = data.number;
      },
      vuex(state, data) {
        state.number = data.number;
      }
    }
  });

  let reduxAdapterInstance = new ReduxAdapter(reduxStore, ["test", "redux"]);
  let vueAdapterInstance = new VuexAdapter(vuexStore, ["test", "vuex"]);
  interceptor(reduxAdapterInstance);
  interceptor(vueAdapterInstance);
  test("should redux dispatch notify vuex", () => {
    reduxStore.dispatch({ type: "test", number: 100 });
    expect(vuexStore.state.number).toEqual(100);
    reduxStore.dispatch({ type: "redux", number: 110 });
    expect(vuexStore.state.number).toEqual(100);
  });

  test("should vuex dispatch notify redux", () => {
    vuexStore.commit("test", { number: 200 });
    expect(reduxStore.getState()).toEqual(200);
    vuexStore.commit({ type: "vuex", number: 210 });
    expect(reduxStore.getState()).toEqual(200);
  });
});
