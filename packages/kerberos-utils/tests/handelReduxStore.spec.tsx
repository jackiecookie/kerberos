import {
  handelReduxStore,
  _findStore as findStore,
  _getStoreFromCache as getStoreFromCache
} from "../handelReduxStore";
import { USER, USERMAYCHANGED } from "../const";
import React from "react";
import { Store, createStore } from "redux";

let userReduce = jest.fn(function(
  state = {
    [USER]: { login: false, info: "test" }
  },
  action
) {
  switch (action.type) {
    case USERMAYCHANGED:
      state[USER] = action[USER];
      return state;
    default:
      return state;
  }
});

interface StoreProp {
  store: Store;
}

interface FakeStoreProp {
  store: {};
}

class Provide extends React.Component<StoreProp> {
  render() {
    return <div>Provide</div>;
  }
}

class Noop extends React.Component<FakeStoreProp> {
  render() {
    return <div>Noop</div>;
  }
}

function AppWithStore(store) {
  return (
    <div>
      <div>
        <span>
          <Provide store={store}></Provide>
        </span>
      </div>
    </div>
  );
}

function AppWithStoreInsideSiblingElment() {
  let store = createStore(userReduce);
  return (
    <div>
      <div>
        <span></span>
        <span>
          <Provide store={store}></Provide>
        </span>
      </div>
    </div>
  );
}

function AppWithFakeStore() {
  return (
    <Noop store={{}}>
      <div>Provide</div>
    </Noop>
  );
}

describe("handelReduxStore findStore", () => {
  test("return null with fake store", () => {
    let store = findStore(AppWithFakeStore());
    expect(store).toBeNull();
  });

  test("return null when store inside sibling elm", () => {
    let store = findStore(AppWithStoreInsideSiblingElment());
    expect(store).toBeNull();
  });

  test("find store with component has true store props", () => {
    let store = createStore(userReduce);
    let resStore = findStore(AppWithStore(store));
    expect(resStore).toEqual(store);
  });
});

describe("handelReduxStore", () => {
  let initStore = createStore(userReduce);
  let subscribeStore = createStore(userReduce);
  test("test in cache", () => {
    initStore.dispatch({
      type: USERMAYCHANGED,
      [USER]: { login: true, info: "value for init" }
    });
    handelReduxStore(AppWithStore(initStore));
    let storeInCache = getStoreFromCache();
    expect(storeInCache).toHaveLength(1);
    expect(storeInCache[0]).toEqual(initStore);
  });

  test("init state", () => {
    handelReduxStore(AppWithStore(subscribeStore), true);
    let state = subscribeStore.getState();
    expect(state[USER]).toEqual({ login: true, info: "value for init" });
  });

  test("when store changed sync state", () => {
    let beforeDispatchCallTimes = userReduce.mock.calls.length;
    initStore.dispatch({
      type: USERMAYCHANGED,
      [USER]: { login: false, info: "value changed" }
    });
    let state = subscribeStore.getState();
    expect(state[USER]).toEqual({ login: false, info: "value changed" });
    let afterDispatchCallTimes = userReduce.mock.calls.length;
    expect(afterDispatchCallTimes - beforeDispatchCallTimes).toBe(2);
  });
});
