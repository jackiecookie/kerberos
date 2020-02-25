class Sandbox {
  private proxy;
  constructor() {
    let rawWindow = window;
    function buildProxy(raw:object){
      const _ = Object.create(null) as object;
      let proxy = new Proxy(_, {
        get(_: Window, p: PropertyKey): any {
          if (p === "top" || p === "window" || p === "self") {
            return proxy;
          }
          if (_[p]) {
            return _[p];
          }
          let rawVal = raw[p];
          switch (typeof rawVal) {
            case "function": {
              if(!isConstructable(rawVal)){
                let boundValue = rawVal.bind(raw);
                Object.keys(rawVal).forEach(key => (boundValue[key] = rawVal[key]));
                return boundValue;
              }
              return rawVal;
            }
            case "object": {
              _[p] = buildProxy(rawVal);
              return _[p];
            }
            case "string":
              return rawVal;
          }
          return _[p];
        },
        set(_: object, p: PropertyKey, value: any): boolean {
          _[p] = value;
          return true;
        },
        has(_: object, p: string | number | symbol): boolean {
          return p in _ || p in raw;
        }
      });
      return proxy;
    }
    this.proxy = buildProxy(rawWindow);
  }

  execute(script) {
    let proxy = this.proxy;
    var proxyName = `proxy${Math.floor(Math.random() * 1e9)}`;
    var fn = new Function("window", proxyName, `with(${proxyName}){
      ${script};
    }`);
    return fn.call(proxy, proxy, proxy);
  }

  dispose() {
    this.proxy = null;
  }
}

function isConstructable(fn: () => void | FunctionConstructor) {
  const constructableFunctionRegex = /^function\b\s[A-Z].*/;
  const classRegex = /^class\b/;

  return (
    (fn.prototype && Object.getOwnPropertyNames(fn.prototype).filter(k => k !== 'constructor').length) ||
    constructableFunctionRegex.test(fn.toString()) ||
    classRegex.test(fn.toString())
  );
}

export default Sandbox;
