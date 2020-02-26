const webpack = require("webpack");
const getWebpackConfigBuild = require('../webpackConfig/webpack.build.js');
const fs = require('fs-extra');
const path = require('path');
const os = require("os");

let entryIsApp = (name) => name.startsWith('apps-');

let hostRegex = /^(([a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9\-]*[a-zA-Z0-9])\.)*([A-Za-z0-9]|[A-Za-z0-9][A-Za-z0-9\-]*[A-Za-z0-9])$/g;

let checkHost = (host) => hostRegex.test(host);

let hostOriginData = {};

function buildRoute(compilation, callback) {
    let entrypoints = compilation.entrypoints;
    let appRoute = {};
    let containerRoute = {};
    let hostData = {}
    entrypoints.forEach((entrypoint) => {
        let name = entrypoint.name;
        let allFiles = entrypoint.getFiles();
        let isApp = entryIsApp(name);
        let routeName = name.split('-')[1];
        let jsFile = (name)=>path.extname(name)==='.js';
        if (isApp) {
            appRoute[routeName] = allFiles.filter(jsFile);
        } else {
            containerRoute[routeName] = allFiles.filter(jsFile);;
            let host = hostOriginData[name];
            if (host) {
                hostData[host] = routeName;
            }
        }
    })
    let route = {
        container: containerRoute,
        app: appRoute,
        host: hostData
    }
    let routePath = path.resolve(process.cwd(), 'route.json')
    fs.createFileSync(routePath);
    fs.writeFileSync(routePath, JSON.stringify(route, null, 2) + os.EOL);
    callback();
}

function getEntryPackageJson(entry) {
    for (const key of Object.keys(entry)) {
        let entryFiles = entry[key];
        if (entryIsApp(key)) {
            continue
        }
        for (const entryFile of entryFiles) {
            let entryPackageFile = entryFile.replace(/index.(.*)+/, 'package.json');
            if (fs.existsSync(entryPackageFile)) {
                let entryPackage = require(entryPackageFile);
                if (!entryPackage['host'] || !checkHost(entryPackage['host'])) {
                    console.error('请设置container package.json中的host');
                    process.exit(388);
                }
                let host = entryPackage['host'];
                hostOriginData[key] = host;
            }
        }
    }
}

module.exports = function () {
    let webpackConfig = getWebpackConfigBuild();
    getEntryPackageJson(webpackConfig.entry)
    const compiler = webpack(webpackConfig);
    compiler.hooks.afterEmit.tapAsync('kerberos:build', buildRoute)
    compiler.hooks.done.tap('kerberos:build', (stats) => {
        console.log(
            stats.toString({
                colors: true,
                chunks: false,
                assets: true,
                children: false,
                modules: false,
            }))

    })
    fs.emptyDirSync(webpackConfig.output.path);
    compiler.run();
}