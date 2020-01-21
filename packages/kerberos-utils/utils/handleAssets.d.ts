export declare enum AssetTypeEnum {
    INLINE = "inline",
    EXTERNAL = "external"
}
export declare enum AssetCommentEnum {
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
export declare function appendLink(root: HTMLElement | ShadowRoot, asset: string, id: string): Promise<string>;
/**
 * Create script element (without inline) and append to root
 */
export declare function appendExternalScript(root: HTMLElement | ShadowRoot, asset: string, id: string): Promise<string>;
export declare function appendAllLink(root: HTMLElement | ShadowRoot, urlList: string[]): Promise<string[]>;
export declare function appendAllScriptWithOutInline(root: HTMLElement | ShadowRoot, urlList: string[]): Promise<string[]>;
export declare function appendAssets(assetsList: string[], useShadow?: boolean): Promise<void>;
export declare function parseUrl(entry: string): ParsedConfig;
export declare function startWith(url: string, prefix: string): boolean;
export declare function getUrl(entry: string, relativePath: string): string;
/**
 * If script/link processed by @ice/stark, add comment for it
 */
export declare function getComment(tag: string, from: string, type: AssetCommentEnum): string;
/**
 * html -> { html: processedHtml, assets: processedAssets }
 */
export declare function processHtml(html: string, entry?: string): ProcessedContent;
/**
 * Append external/inline script to root, need to be appended in order
 */
export declare function appendScript(root: HTMLElement | ShadowRoot, asset: Asset): Promise<string>;
export declare function appendProcessedContent(root: HTMLElement | ShadowRoot, processedContent: ProcessedContent): Promise<void>;
export declare function recordAssets(): void;
export declare function setStaticAttribute(tag: HTMLStyleElement | HTMLScriptElement | HTMLBodyElement): void;
export declare function emptyAssets(): void;
export declare function setContainerFlag(): void;
export declare function isInContainer(): boolean;
