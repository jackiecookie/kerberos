# kerberos

![Build Status](https://travis-ci.org/jackiecookie/kerberos.png) ![codecov](https://codecov.io/gh/jackiecookie/kerberos/graph/badge.svg)

Frontends solution for large application decomposition

## Installation

`yarn global add kerber-server`

### build app

`kerber-server create -a <appName>`

### build container

`kerber-server create -c <container>`

### run dev server

`cd <appName> && kerber-server dev`

### build container and app together ready to release

`kerber-server build`

### server start

`kerber-server start`

## Getting Started

### container

### container/index.tsx

```js
import React from "react";
import App from "./App";
import { render } from "kerberos-container";

render(App, document.getElementById("container"));
```

#### container/App.tsx

```js
import React from "react";
import { Container } from "kerberos-container";

export default function App() {
  return (
    <div>
      <Container authUrl={"authUrl"} />
    </div>
  );
}
```

### sub-App

### app/index.tsx

```js
import React from "react";

import App from "./App";

import { appRegister } from "kerberos-app";

appRegister(App);
```

basically, you can use any framework on sub-app either react or vue can register to the container.

## state management

### redux

```js
import ReduxAdapter from "kerberos-utils/adapters/reduxAdapter";
import { createStore, applyMiddleware } from "redux";
import ReactApp from "./App";

let reduxStore = createStore(reducer, applyMiddleware(ReduxAdapter.middleware));
let reduxAdapter = new ReduxAdapter(reduxStore, [
  "events need handel",
  "login",
  "loginOut"
]);

appRegister(ReactApp, { adapter: reduxAdapter });
```

### vuex

```js
import VuexAdapter from "kerberos-utils/adapters/vuexAdapter";
import Vuex from "vuex";
import Vue from "vue";
import VueApp from "./App";

Vue.use(Vuex);
const vuexStore = new Vuex.Store({});
let vuexAdapter = new VuexAdapter(vuexStore, [
  "events need handel",
  "login",
  "loginOut"
]);

appRegister(VueApp, { adapter: vuexAdapter });
```

you can also implemention your own `adapter` by implements
`kerberos-utils/types/IAdapter`

### IAdapter.ts

```typescript
interface IAdapter {
  query(name: string): any;
  commander(event: string, payload: object): void; 
  eventFilter(event: string): boolean;
  interceptor(interceptor: (event: string, payload: object) => void): void;
}

export default IAdapter;
```
