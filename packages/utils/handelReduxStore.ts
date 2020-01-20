import { Store } from "redux";
import { USER, USERMAYCHANGED } from "./const";
import { setCache, getCache } from "./cache";

const storeKey = "_KERBEROS_STORES";
let dispatching = false;

function findStore(appInstance: JSX.Element): null | Store {
  if (!appInstance||typeof(appInstance.props)!=='object' ) {
    return null;
  }
  let { children, store } = appInstance.props;
  if (store && store.getState && store.dispatch && store.subscribe) {
    return store;
  }
  if (children && typeof children === "object") {
    return findStore(children);
  } else {
    return null;
  }
}

function setStoreIntoCache(store: Store) {
  let stores = getStoreFromCache();
  stores.push(store);
  setCache(storeKey, stores);
}

function getStoreFromCache(): Store[] {
  return getCache(storeKey) || [];
}

function dispatchStore(user) {
  if (dispatching) {
    return;
  }
  dispatching = true;
  let stores = getStoreFromCache();
  stores.forEach(store => {
    storeDispatch(store, user);
  });
  dispatching = false;
}

function storeDispatch(store, user) {
  if (user) {
    store.dispatch({
      type: USERMAYCHANGED,
      [USER]: user
    });
  }
}

function initUserState(store: Store) {
  let stores = getStoreFromCache();
  let user = null;
  if (stores) {
    user = stores[0].getState()[USER];
  }
  storeDispatch(store, user);
}

function handelReduxStore(appInstance: JSX.Element, init: boolean = false) {
  let store = findStore(appInstance);
  if (store) {
    let state = store.getState();
    if (state && state[USER]) {
      if (init) {
        initUserState(store);
      }
      store.subscribe(() => {
        dispatchStore(store.getState[USER]);
      });
      setStoreIntoCache(store);
    }
  }
}

export default handelReduxStore;
