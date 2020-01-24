import { Store } from "redux";
import { USER, USERMAYCHANGED } from "./const";
import { setCache, getCache } from "./cache";

const storeKey = "_KERBEROS_STORES";
let dispatching = false;

function _findStore(appInstance: JSX.Element): null | Store {
  if (!appInstance || typeof appInstance.props !== "object") {
    return null;
  }
  let { children, store } = appInstance.props;
  if (store && store.getState && store.dispatch && store.subscribe) {
    return store;
  }
  if (children && typeof children === "object") {
    return _findStore(children);
  } else {
    return null;
  }
}

function setStoreIntoCache(store: Store) {
  let stores = _getStoreFromCache();
  stores.push(store);
  setCache(storeKey, stores);
}

function _getStoreFromCache(): Store[] {
  return getCache(storeKey) || [];
}

function dispatchStore(user, store) {
  if (dispatching) {
    return;
  }
  dispatching = true;
  let stores = _getStoreFromCache();
  stores.forEach(targeStore => {
    if (targeStore != store) {
      storeDispatch(targeStore, user);
    }
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
  let stores = _getStoreFromCache();
  let user = null;
  if (stores) {
    user = stores[0].getState()[USER];
  }
  storeDispatch(store, user);
}

function handelReduxStore(appInstance: JSX.Element, init: boolean = false) {
  let store = _findStore(appInstance);
  if (store) {
    store as Store
    let state = store.getState();
    if (state && state[USER]) {
      if (init) {
        initUserState(store);
      }
      store.subscribe(() => {
        dispatchStore((store as Store).getState()[USER], store);
      });
      setStoreIntoCache(store);
    }
  }
}

export { handelReduxStore, _findStore, _getStoreFromCache };
