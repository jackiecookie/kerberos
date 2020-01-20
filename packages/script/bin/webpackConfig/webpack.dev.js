/* eslint-disable indent */
const webpack = require('webpack');
const getBaseConfig = require('./webpack.base.js');

module.exports = () => {
  const baseConfig = getBaseConfig('development');

  // set source map
  baseConfig.devtool('cheap-module-source-map');

  baseConfig.entry().add("./index.tsx").end();

  //output

  baseConfig.output.filename('[name].[hash:6].js');

  // set hot reload plugin
  baseConfig
    .plugin('HotModuleReplacementPlugin')
      .use(webpack.HotModuleReplacementPlugin);

      
  return baseConfig.toConfig();
};
