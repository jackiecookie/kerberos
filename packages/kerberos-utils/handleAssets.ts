import { getCache } from "./cache";
import { error } from "./message";

const PREFIX = "kerberos";
const DYNAMIC = "dynamic";
const STATIC = "static";
const IS_CSS_REGEX = /\.css(\?((?!\.js$).)+)?$/;

const getCacheRoot = () => getCache("root");

const COMMENT_REGEX = /<!--.*?-->/g;
const SCRIPT_REGEX = /<script\b[^>]*>([^<]*)<\/script>/gi;
const SCRIPT_SRC_REGEX = /<script\b[^>]*src=['"]?([^'"]*)['"]?\b[^>]*>/gi;
const LINK_HREF_REGEX = /<link\b[^>]*href=['"]?([^'"]*)['"]?\b[^>]*>/gi;
const STYLE_SHEET_REGEX = /rel=['"]stylesheet['"]/gi;

export enum AssetTypeEnum {
  INLINE = "inline",
  EXTERNAL = "external"
}

export enum AssetCommentEnum {
  REPLACED = "replaced",
  PROCESSED = "processed"
}

export interface Asset {
  type: AssetTypeEnum;
  content: string;
}

export interface ProcessedContent {
  html: string;
  assets: Asset[];
}

export interface ParsedConfig {
  origin: string;
  pathname: string;
}

/**
 * Create link element and append to root
 */
export function appendLink(
  root: HTMLElement | ShadowRoot,
  asset: string,
  id: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!root) reject(new Error(`no root element for css assert: ${asset}`));

    const element: HTMLLinkElement = document.createElement("link");

    element.setAttribute(PREFIX, DYNAMIC);
    element.id = id;
    element.rel = "stylesheet";
    element.href = asset;

    element.addEventListener(
      "error",
      () => {
        error(`css asset loaded error: ${asset}`);
        return resolve();
      },
      false
    );
    element.addEventListener("load", () => resolve(), false);

    root.appendChild(element);
  });
}

/**
 * Create script element (without inline) and append to root
 */
export function appendExternalScript(
  root: HTMLElement | ShadowRoot,
  asset: string,
  id: string
): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    if (!root) reject(new Error(`no root element for js assert: ${asset}`));

    const element: HTMLScriptElement = document.createElement("script");

    element.setAttribute(PREFIX, DYNAMIC);
    element.id = id;
    element.type = "text/javascript";
    element.src = asset;
    element.async = false;

    element.addEventListener(
      "error",
      () => reject(new Error(`js asset loaded error: ${asset}`)),
      false
    );
    element.addEventListener("load", () => resolve(), false);

    root.appendChild(element);
  });
}

export function appendAllLink(
  root: HTMLElement | ShadowRoot,
  urlList: string[]
): Promise<string[]> {
  return Promise.all(
    urlList.map((cssUrl, index) =>
      appendLink(root, cssUrl, `${PREFIX}-css-${index}`)
    )
  );
}

export function appendAllScriptWithOutInline(
  root: HTMLElement | ShadowRoot,
  urlList: string[]
): Promise<string[]> {
  return Promise.all(
    urlList.map((jsUrl, index) =>
      appendExternalScript(root, jsUrl, `${PREFIX}-js-${index}`)
    )
  );
}

export async function appendAssets(
  assetsList: string[],
  useShadow: boolean = true
) {
  const jsRoot: HTMLElement = document.getElementsByTagName("head")[0];
  const cssRoot: HTMLElement | ShadowRoot = useShadow
    ? getCacheRoot()
    : document.getElementsByTagName("head")[0];

  const jsList: string[] = [];
  const cssList: string[] = [];

  assetsList.forEach(url => {
    const isCss: boolean = IS_CSS_REGEX.test(url);
    if (isCss) {
      cssList.push(url);
    } else {
      jsList.push(url);
    }
  });

  if (useShadow) {
    // make sure css loads after all js have been loaded under shadowRoot
    await appendAllScriptWithOutInline(jsRoot, jsList);
    await appendAllLink(cssRoot, cssList);
  } else {
    await appendAllLink(cssRoot, cssList);
    await appendAllScriptWithOutInline(jsRoot, jsList);
  }
}

export function parseUrl(entry: string): ParsedConfig {
  const a = document.createElement("a");
  a.href = entry;

  return {
    origin: a.origin,
    pathname: a.pathname
  };
}

export function startWith(url: string, prefix: string): boolean {
  return url.slice(0, prefix.length) === prefix;
}

export function getUrl(entry: string, relativePath: string): string {
  const { origin, pathname } = parseUrl(entry);

  if (startWith(relativePath, "./")) {
    const rPath = relativePath.slice(1);

    if (!pathname || pathname === "/") {
      return `${origin}${rPath}`;
    }

    const pathArr = pathname.split("/");
    pathArr.splice(-1);
    return `${origin}${pathArr.join("/")}${rPath}`;
  } else if (startWith(relativePath, "/")) {
    return `${origin}${relativePath}`;
  } else {
    return `${origin}/${relativePath}`;
  }
}

/**
 * If script/link processed by @ice/stark, add comment for it
 */
export function getComment(
  tag: string,
  from: string,
  type: AssetCommentEnum
): string {
  return `<!--${tag} ${from} ${type} by @ice/stark-->`;
}

/**
 * html -> { html: processedHtml, assets: processedAssets }
 */
export function processHtml(html: string, entry?: string): ProcessedContent {
  if (!html) return { html: "", assets: [] };

  const processedAssets = [] as any[];

  const processedHtml = html
    .replace(COMMENT_REGEX, "")
    .replace(SCRIPT_REGEX, (arg1, arg2) => {
      if (!arg1.match(SCRIPT_SRC_REGEX)) {
        processedAssets.push({
          type: AssetTypeEnum.INLINE ,
          content: arg2 
        });

        return getComment("script", "inline", AssetCommentEnum.REPLACED);
      } else {
        return arg1.replace(SCRIPT_SRC_REGEX, (_, argSrc2) => {
          const url =
            argSrc2.indexOf("//") >= 0 ? argSrc2 : getUrl(entry as string, argSrc2);
          processedAssets.push({
            type: AssetTypeEnum.EXTERNAL,
            content: url
          });

          return getComment("script", argSrc2, AssetCommentEnum.REPLACED);
        });
      }
    })
    .replace(LINK_HREF_REGEX, (arg1, arg2) => {
      // not stylesheet, return as it is
      if (!arg1.match(STYLE_SHEET_REGEX)) {
        return arg1;
      }

      const url = arg2.indexOf("//") >= 0 ? arg2 : getUrl(entry as string, arg2);
      return `${getComment(
        "link",
        arg2,
        AssetCommentEnum.PROCESSED
      )}   ${arg1.replace(arg2, url)}`;
    });

  return {
    html: processedHtml,
    assets: processedAssets
  };
}

/**
 * Append external/inline script to root, need to be appended in order
 */
export function appendScript(
  root: HTMLElement | ShadowRoot,
  asset: Asset
): Promise<string> {
  const { type, content } = asset;

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");

    // inline script
    if (type === AssetTypeEnum.INLINE) {
      script.innerHTML = content;
      root.appendChild(script);
      resolve();
      return;
    }

    // external script
    script.setAttribute("src", content);
    script.addEventListener("load", () => resolve(), false);
    script.addEventListener("error", () =>
      reject(new Error(`js asset loaded error: ${content}`))
    );
    root.appendChild(script);
  });
}

export function recordAssets(): void {
  // getElementsByTagName is faster than querySelectorAll
  const styleList: HTMLCollectionOf<HTMLStyleElement> = document.getElementsByTagName(
    "style"
  );
  const linkList: HTMLCollectionOf<HTMLStyleElement> = document.getElementsByTagName(
    "link"
  );
  const jsList: HTMLCollectionOf<HTMLScriptElement> = document.getElementsByTagName(
    "script"
  );

  for (let i = 0; i < styleList.length; i++) {
    setStaticAttribute(styleList[i]);
  }

  for (let i = 0; i < linkList.length; i++) {
    setStaticAttribute(linkList[i]);
  }

  for (let i = 0; i < jsList.length; i++) {
    setStaticAttribute(jsList[i]);
  }
}

export function setStaticAttribute(
  tag: HTMLStyleElement | HTMLScriptElement | HTMLBodyElement
): void {
  if (tag.getAttribute(PREFIX) !== DYNAMIC) {
    tag.setAttribute(PREFIX, STATIC);
  }
  //@ts-ignore
  tag = null;
}

export function emptyAssets(): void {
  // remove extra assets
  const styleList: NodeListOf<HTMLElement> = document.querySelectorAll(
    `style:not([${PREFIX}=${STATIC}])`
  );
  styleList.forEach(style => {
    style.parentNode&&style.parentNode.removeChild(style);
  });

  const linkList: NodeListOf<HTMLElement> = document.querySelectorAll(
    `link:not([${PREFIX}=${STATIC}])`
  );
  linkList.forEach(link => {
    link.parentNode && link.parentNode.removeChild(link);
  });

  const jsExtraList: NodeListOf<HTMLElement> = document.querySelectorAll(
    `script:not([${PREFIX}=${STATIC}])`
  );
  jsExtraList.forEach(js => {
    js.parentNode && js.parentNode.removeChild(js);
  });
}

export function setContainerFlag() {
  const bodyElm: HTMLBodyElement = document.getElementsByTagName("body")[0];
  setStaticAttribute(bodyElm);
}

export function isInContainer(): boolean {
  const bodyElm: HTMLBodyElement = document.getElementsByTagName("body")[0];
  return bodyElm.getAttribute(PREFIX) === STATIC;
}
