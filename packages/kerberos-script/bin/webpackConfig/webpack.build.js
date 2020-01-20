/* eslint-disable indent */
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const getBaseConfig = require('./webpack.base.js');
const getEntrys = require("../utils/getEntrys");
const processEntry = require("./processEntry")


module.exports = () => {
  const baseConfig = getBaseConfig('production');

  baseConfig.devtool(false);

  let entries = getEntrys(process.cwd());

  baseConfig.merge({ entry: entries });

  processEntry(baseConfig)

  // uglify js file
  baseConfig.optimization
    .minimizer('UglifyJsPlugin')
    .use(UglifyJsPlugin, [{
      sourceMap: false,
      cache: true,
      parallel: true,
      uglifyOptions: {
        compress: {
          unused: false,
        },
        output: {
          ascii_only: true,
          comments: 'some',
          beautify: false,
        },
        mangle: true,
      },
    }]);

  // optimize css file
  baseConfig.optimization
    .minimizer('OptimizeCSSAssetsPlugin')
    .use(OptimizeCSSAssetsPlugin, [{
      cssProcessorOptions: {
        cssDeclarationSorter: false,
        reduceIdents: false,
        parser: require('postcss-safe-parser'),
      },
    }]);

  // optimize js chunk
  // baseConfig.optimization.splitChunks({
  //   chunks: 'async',
  //   minSize: 30000,
  //   maxSize: 0,
  //   minChunks: 1,
  //   maxAsyncRequests: 6,
  //   maxInitialRequests: 4,
  //   automaticNameDelimiter: '~',
  //   automaticNameMaxLength: 30,
  //   cacheGroups: {
  //     // defaultVendors: {
  //     //   test: /[\\/]node_modules[\\/]/,
  //     //   priority: -10
  //     // },
  //     // default: {
  //     //   minChunks: 2,
  //     //   priority: -20,
  //     //   reuseExistingChunk: true
  //     // }
  //     commons: {
  //       name: 'commons',
  //       chunks: 'initial',
  //       minChunks: 2
  //     }
  //   }
  // }).end();

  return baseConfig.toConfig();
};
