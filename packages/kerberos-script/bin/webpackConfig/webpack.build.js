/* eslint-disable indent */
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const getBaseConfig = require('./webpack.base.js');
const getEntrys = require("../utils/getEntrys");
const processEntry = require("./processEntry");
const path = require("path");


module.exports = () => {
  const baseConfig = getBaseConfig('production');
  baseConfig.mode("development")

  baseConfig.devtool("inline-source-map");

  let cwd = process.cwd();
  let entries = getEntrys(cwd);

  baseConfig.merge({ entry: entries });

  baseConfig.output.filename('[name].[hash:6].js');

  const outputPath = path.resolve(cwd, 'dist');

  baseConfig.output.path(outputPath);

  processEntry(baseConfig)

  // uglify js file
  // baseConfig.optimization
  //   .minimizer('UglifyJsPlugin')
  //   .use(UglifyJsPlugin, [{
  //     sourceMap: false,
  //     cache: true,
  //     parallel: true,
  //     uglifyOptions: {
  //       compress: {
  //         unused: false,
  //       },
  //       output: {
  //         ascii_only: true,
  //         comments: 'some',
  //         beautify: false,
  //       },
  //       mangle: true,
  //     },
  //   }]);

  // // optimize css file
  // baseConfig.optimization
  //   .minimizer('OptimizeCSSAssetsPlugin')
  //   .use(OptimizeCSSAssetsPlugin, [{
  //     cssProcessorOptions: {
  //       cssDeclarationSorter: false,
  //       reduceIdents: false,
  //       parser: require('postcss-safe-parser'),
  //     },
  //   }]);

  // //optimize js chunk

  baseConfig.optimization.runtimeChunk("single");
  baseConfig.optimization.splitChunks({
    chunks: 'all',
    minSize: 0,
    minChunks: 1,
    maxAsyncRequests: 6,
    maxInitialRequests: Infinity,
    automaticNameDelimiter: '.',
    automaticNameMaxLength: 30,
    cacheGroups: {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name(module) {
          // get the name. E.g. node_modules/packageName/not/this/part.js
          // or node_modules/packageName
          const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

          // npm package names are URL-safe, but some servers don't like @ symbols
          return `package.${packageName.replace('@', '')}`;
        }
      },
    }
  }).end();

  return baseConfig.toConfig();
};
