# kerberos

![Build Status](https://travis-ci.org/jackiecookie/kerberos.png)  ![codecov](https://codecov.io/gh/jackiecookie/kerberos/graph/badge.svg)

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

appRegister(App)
```

basically, you can use any framework on sub-App either react or vue can register to the container but for now, if you want to use global state container, Kerberos only supports react/redux. 

