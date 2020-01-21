/// <reference types="react" />
import { Store } from "redux";
declare function _findStore(appInstance: JSX.Element): null | Store;
declare function _getStoreFromCache(): Store[];
declare function handelReduxStore(appInstance: JSX.Element, init?: boolean): void;
export { handelReduxStore, _findStore, _getStoreFromCache };
