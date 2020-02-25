import sandbox from "./sandbox";

const SCRIPT_TAG_NAME = "SCRIPT";

export function hijack(root: Element, sandbox: sandbox): void {
  const rawHtmlAppendChild = root.appendChild;
  function appendChild<T extends Node>(this: any, newChild: T) {
    const element = newChild as any;
    if (element.tagName && element.tagName === SCRIPT_TAG_NAME) {
      const { src, id } = element as HTMLScriptElement;
      if (src && /kerberos/g.test(id)) {
        let error = function() {
          const errorEvent = new CustomEvent("error");
          element.dispatchEvent(errorEvent);
        };
        fetch(src)
          .then(async function fetchScript(res) {
            try {
              let script = await res.text();
              sandbox.execute(script);
              const loadEvent = new CustomEvent("load");
              element.dispatchEvent(loadEvent);
            } catch (e) {
              console.error(e);
              error();
            }
          })
          .catch(error);
        return element;
      }
    }
    return rawHtmlAppendChild.call(this, element) as T;
  }
  if (!(root as any)._rawAppendChild) {
    root.appendChild = appendChild;
    (root as any)._rawAppendChild = rawHtmlAppendChild;
  }
}

export function free(root: Element) {
  root.appendChild = (root as any)._rawAppendChild;
  (root as any)._rawAppendChild = null;
}
