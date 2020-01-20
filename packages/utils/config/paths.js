const { realpathSync } = require('fs');
const { resolve } = require('path');

function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  }
  return path;
}

function resolveSDK(relativePath) {
  console.log('__dirname', __dirname)
  return resolve(__dirname, relativePath);
}

const appDirectory = realpathSync(process.cwd());

function resolveApp(relativePath) {
  // console.log(relativePath, resolve(appDirectory, relativePath))
  return resolve(appDirectory, relativePath);
}

module.exports = {
  appPublic: resolveApp(''),
  appFavicon: resolveApp('favicon.png'),
  appFaviconIco: resolveApp('favicon.ico'),
  appPackageJson: resolveApp('package.json'),
  appAbcJson: resolveApp('abc.json'),
  appSrc: resolveApp('src'),
  defaultAppHtml: resolveApp('index.html'),
  defaultBuildPath: resolveApp('build'),
  defaultPublicPath: ensureSlash('/', true),
  appNodeModules: resolveApp('../../node_modules'),
  sdkNodeModules: resolveSDK('../../node_modules'),
  resolveApp,
  appDirectory,
};
