/* eslint-disable indent */
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');
const SimpleProgressPlugin = require('webpack-simple-progress-plugin');
const ProgressPlugin = require('webpack/lib/ProgressPlugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const { defaultAppHtml } = require('./paths');

module.exports = (chainConfig, mode = 'development') => {
  const defineVariables = {
    'process.env.NODE_ENV': JSON.stringify(mode || 'development'),
  };

  let isDev = mode === 'development';


  chainConfig
    .plugin('DefinePlugin')
    .use(webpack.DefinePlugin, [defineVariables])
    .end()
    .plugin('MiniCssExtractPlugin')
    .use(MiniCssExtractPlugin, [{
      filename: '[name].css',
    }])
    .end()
    .plugin('FilterWarningsPlugin')
    .use(FilterWarningsPlugin, [{
      exclude: /Conflicting order between:/,
    }])
    .end()
    .plugin('SimpleProgressPlugin')
    // SimpleProgressPlugin will not write webpack info to stderr when it is not tty
    .use(!process.stderr.isTTY ? ProgressPlugin : SimpleProgressPlugin)
    .end()
    .plugin('CaseSensitivePathsPlugin')
    .use(CaseSensitivePathsPlugin)
    .end();

  if (isDev) {
    chainConfig.plugin('HtmlWebpackPlugin')
      .use(HtmlWebpackPlugin, [{
        inject: true,
        templateParameters: {
          NODE_ENV: process.env.NODE_ENV,
        },
        favicon: "",
        template: defaultAppHtml,
        minify: false,
      }])
      .end();
  }


};
