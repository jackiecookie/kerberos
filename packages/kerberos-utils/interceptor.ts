// import { createStore } from "redux";
import IAdapter from "./types/IAdapter";
import EventSourceing from "./eventSourceing";

// let store = createStore(function() {});
let adapters: IAdapter[] = [];

let eventSourceing = new EventSourceing();

const IDEL = 0;
const PADDING = 1;
let state = IDEL;

function padding() {
  state = PADDING;
}

function idel() {
  state = IDEL;
}

function isPadding() {
  return state === PADDING;
}

function interceptor(adapter: IAdapter) {
  adapter.interceptor(function(event, payload) {
    if (isPadding()) {
      return;
    }
    padding();
    let fireAdapters = adapters.filter(function filter(adapterInArr) {
      return adapterInArr.eventFilter(event);
    });
    if (fireAdapters.length > 0) {
      eventSourceing.commit(event, payload);
      fireAdapters.forEach(function commander(adapterInArr) {
        adapterInArr !== adapter && adapterInArr.commander(event, payload);
      });
    }
    idel();
  });
  padding();
  eventSourceing.replay(adapter);
  idel();
  adapters.push(adapter);
}

export default interceptor;
