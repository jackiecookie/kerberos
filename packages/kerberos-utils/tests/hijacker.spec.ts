import { hijack, free } from "../hijacker";
import { appendExternalScript, appendLink } from "kerberos-utils";
import fetchMock, { FetchMock } from "jest-fetch-mock";
import Sandbox from "../sandbox";

let sandbox = jest.spyOn(Sandbox.prototype, "execute");

(fetchMock as FetchMock).enableMocks();

describe("test hijack", () => {
  let root = document.createElement("div");

  beforeAll(() => hijack(root, new Sandbox()));

  beforeEach(() => {
    hijack(root, new Sandbox());
    sandbox.mockClear();
  });

  afterEach(() => {
    free(root);
  });

  test("hijack appendChild with success response", async done => {
    let scipt = "let s = '1'";
    (fetchMock as FetchMock).mockResponseOnce(scipt);
    await appendExternalScript(root, "/test.js", "kerberos-js-1");
    expect(sandbox).toBeCalledWith(scipt);
    expect(root.getElementsByTagName("script")).toHaveLength(0);
    done();
  });

  test("hijack one root and append multiple script show exeuct on same sandbox", async done => {
    let scipt = "window.count = 0;";
    (fetchMock as FetchMock).mockResponseOnce(scipt);
    await appendExternalScript(root, "/test.js", "kerberos-js-1");
    (fetchMock as FetchMock).mockResponseOnce(
      "expect(window.count).toEqual(0);"
    );
    await appendExternalScript(root, "/test1.js", "kerberos-js-2");
    expect(sandbox).toBeCalledTimes(2);
    done();
  });

  test("hijack different root need work isolation", async done => {
    (fetchMock as FetchMock).mockResponseOnce(
      "expect(window.count).toBeUndefined();"
    );
    await appendExternalScript(root, "/test.js", "kerberos-js-1");
    expect(sandbox).toBeCalledTimes(1);
    done();
  });

  test("hijack appendChild with error response", async done => {
    (fetchMock as FetchMock).mockRejectOnce();
    expect(
      appendExternalScript(root, "/test.js", "kerberos-js-1")
    ).rejects.toEqual(new Error("js asset loaded error: /test.js"));
    expect(sandbox).toBeCalledTimes(0);
    expect(root.getElementsByTagName("script")).toHaveLength(0);
    done();
  });

  test("do not hijack appendChild if not script", async done => {
    appendLink(root, "/test.css", "kerberos-css-1").then(function() {
      expect(sandbox).toBeCalledTimes(0);
      done();
    });
    let links = root.getElementsByTagName("link");
    expect(links).toHaveLength(1);
    for (let i = 0; i < links.length; i++) {
      links[i].dispatchEvent(new Event("load"));
    }
  });

  test("should not hijack if already hijacked", () => {
    let rawHtmlAppendChild = root.appendChild;
    hijack(root, new Sandbox());
    expect(rawHtmlAppendChild === root.appendChild).toEqual(true);
  });
});
