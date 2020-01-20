/* eslint-disable indent */
const Chain = require('webpack-chain');
const { appDirectory } = require('./paths');
const setLoaders = require('./setWebpackLoaders');
const setPlugins = require('./setWebpackPlugins');

module.exports = (mode = 'development') => {
  const chainConfig = new Chain();

  chainConfig
    .resolve.extensions
    .add(".js").add(".tsx").add(".jsx").add(".json").add(".html").add(".ts").end();


  chainConfig.resolve.modules.add("node_modules").add("../node_modules").end();    


  chainConfig.mode(mode)
    .context(appDirectory);

  // -------------- webpack loader config --------------
  setLoaders(chainConfig, mode);

  // -------------- webpack plugin config --------------
  setPlugins(chainConfig, mode);

  return chainConfig;
};
