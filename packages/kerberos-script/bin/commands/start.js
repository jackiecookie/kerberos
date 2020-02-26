const express = require("express");
const path = require("path");
const lodashArray = require("lodash/array")
const cwd = process.cwd();
let routePath = path.resolve(cwd, "route.json");
const routeData = require(routePath);
const containerRoute = routeData.container;
const appRpute = routeData.app;
const hostData = routeData.host;

const JS = '_JS_FILE';
const CSS = '_CSS_FILE';
const ICO = '_ICO_FILE';
const JSMAP = '_JSMAP_FILE';

function isStaticFile(url) {
    let extname = path.extname(url);
    let type = '';
    if (extname === '.js') {
        type = JS;
    } else if (extname === '.map') {
        type = JSMAP;
    } else if (extname === '.css') {
        type = CSS;
    } else if (extname === '.ico') {
        type = ICO;
    }
    return type;
}

function htmlTagObjectToString(tagDefinitions) {
    return tagDefinitions.reduce((res, tagDefinition) => {
        const attributes = Object.keys(tagDefinition.attributes || {})
            .filter(function (attributeName) {
                return tagDefinition.attributes[attributeName] !== false;
            })
            .map(function (attributeName) {
                if (tagDefinition.attributes[attributeName] === true) {
                    return attributeName;
                }
                return attributeName + '="' + tagDefinition.attributes[attributeName] + '"';
            });
        res += '<' + [tagDefinition.tagName].concat(attributes).join(' ') + (tagDefinition.voidTag && '') + '>' +
            (tagDefinition.innerHTML || '') +
            (tagDefinition.voidTag ? '' : '</' + tagDefinition.tagName + '>');
        return res;
    }, '')
}


class Server {
    constructor() {
        this.isReady = false;
        this.ready();
    }

    setupApp() {
        this.app = new express();
    }

    NotFound() {
        res.status(404).send("页面不存在")
    }

    generatedHtml(assets) {
        let [jsAssetHtmlObjs, cssAssetHtmlObjs] = assets.reduce((res, asset) => {
            let fileType = isStaticFile(asset)
            if (fileType) {
                let isJs = fileType === JS;
                let htmlObject = isJs ? this.generatedScriptTags(asset) : this.generateStyleTags(asset);
                (isJs ? res[0] : res[1]).push(htmlObject)
                return res
            }
            return res;
        }, [[], []]);
        let scripts, csses;
        scripts = csses = '';
        if (jsAssetHtmlObjs && jsAssetHtmlObjs.length > 0) {
            scripts = htmlTagObjectToString(jsAssetHtmlObjs);
        }
        if (cssAssetHtmlObjs && cssAssetHtmlObjs.length > 0) {
            csses = htmlTagObjectToString(cssAssetHtmlObjs);
        }
        const responsePage = `<!DOCTYPE html><html><head><meta charset="utf-8"/>${csses}</head><body><div id="container"></div>${scripts}</body></html>`;
        return responsePage;
    }

    generatedScriptTags(scriptAsset) {
        return {
            tagName: 'script',
            voidTag: false,
            attributes: {
                src: scriptAsset
            }
        };
    }

    generateStyleTags(styleAsset) {
        return {
            tagName: 'link',
            voidTag: true,
            attributes: {
                href: styleAsset,
                rel: 'stylesheet'
            }
        }
    }

    getContainerFiles(req) {
        let host = req.hostname;
        if (!hostData[host] || !containerRoute[hostData[host]]) {
            return null;
        }
        return containerRoute[hostData[host]];
    }
    setupRouteHandle() {
        let self = this;
        // 返回对应app的js文件地址
        this.app.get('/code/:code', function (req, res, next) {
            if (isStaticFile(req.url)) {
                return next();
            }
            let code = req.params['code'];
            let appFiles = appRpute[code];
            if (appFiles) {
                let containerFiles = self.getContainerFiles(req) || [];
                res.json({
                    success: true,
                    data: lodashArray.difference(appFiles, containerFiles)
                })
            } else {
                return next();
            }
        })


        this.app.get("*", function (req, res, next) {
            // 1. 有没有path都根据host判断container,返回让前端路由去处理
            if (isStaticFile(req.url)) {
                return next();
            }
            let containerFiles = self.getContainerFiles(req);
            if (!containerFiles) {
                return next();
            }
            let responsePage = self.generatedHtml(containerFiles);
            res.send(responsePage);
        })

        //全都处理不了就static文件
        this.app.use(express.static('dist'))
    }

    ready() {
        if (!this.isReady) {
            this.isReady = true;
            this.setupApp();
            this.setupRouteHandle();
        }
    }

    listen(port) {
        return new Promise((resolve, reject) => {
            this.app.listen(port, (err) => {
                if (err) {
                    reject(err)
                }
                else {
                    resolve();
                }
            });
        })
    }

    userMiddleware() {

    }
}

module.exports = Server;
