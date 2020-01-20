const webpack = require("webpack");
const WebpackDevServer = require("webpack-dev-server");
const openBrowser = require('react-dev-utils/openBrowser');
const getWebpackConfigDev = require('../webpackConfig/webpack.dev')
const defaultConfig = require('../webpackConfig/default.config')
const chalk = require('chalk');
const prepareUrLs = require('../utils/prepareURLs')


module.exports = function (port) {
    const HOST = '0.0.0.0';
    const PORT = port || 8080;

    let webpackConfig = getWebpackConfigDev();

    const compiler = webpack(webpackConfig);
    const devServer = new WebpackDevServer(compiler, defaultConfig.devServer);

    const urls = prepareUrLs(HOST, PORT);

    let firstStart = false;


    compiler.hooks.done.tap('done', (stats) => {
        if (firstStart) {
            console.log(chalk.cyan('Starting the development server...'));
            console.log(
                [
                    `    - Local:   ${chalk.yellow(urls.localUrlForTerminal)}`,
                    `    - Network: ${chalk.yellow(urls.lanUrlForTerminal)}`,
                ].join('\n')
            );
            openBrowser(urls.localUrlForBrowser);
            firstStart = true;
        }

        console.log(
            stats.toString({
                colors: true,
                chunks: false,
                assets: true,
                children: false,
                modules: false,
            }))
    })

    devServer.listen(PORT, HOST, (err) => {
        if (err) {
            console.error(err);
            process.exit(500);
        }
    });
}