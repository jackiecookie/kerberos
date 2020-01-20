const execSync = require('child_process').execSync;
const chalk = require('chalk');
const spawn = require('cross-spawn');
const fs = require("fs-extra");
const path = require("path");
const os = require("os");


function shouldUseYarn() {
  try {
    execSync('yarnpkg --version', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function install(root, dependencies) {
  let useYarn = shouldUseYarn();
  return new Promise((resolve, reject) => {
    let command;
    let args;
    if (useYarn) {
      command = 'yarnpkg';
      args = ['add', '--exact'];

      [].push.apply(args, dependencies);

      args.push('--cwd');
      args.push(root);

    } else {
      command = 'npm';
      args = [
        'install',
        '--save',
        '--save-exact',
        '--loglevel',
        'error',
      ].concat(dependencies);
    }

    const child = spawn(command, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({
          command: `${command} ${args.join(' ')}`,
        });
        return;
      }
      resolve();
    });
  });
}


function installDependencies(root, tempFullPath) {
  let dependencies = require(tempFullPath + '/dependencies.json').dependencies;
  return install(root, dependencies)
}

function initProject(isApp, name) {
  // move template
  let tempPath = isApp ? '../../template/app' : '../../template/container';
  let tempFullPath = path.resolve(__dirname, tempPath);
  let rootPath = process.cwd();
  let root = path.resolve(rootPath, (isApp ? 'apps/' : 'containers/') + name);
  fs.copy(tempFullPath + '/template', root);
  // init package.json
  initPackageJson(name, root, isApp);
  let initSuccess = tryGitInit();
  if (initSuccess) {
    addGitIgnore(root)
  }
  installDependencies(root, tempFullPath).then(() => {
    console.log(chalk.green(`初始化${isApp ? 'app' : 'container'}成功`))

  })
}


function initPackageJson(name, path, isApp) {
  let packageJson = {
    name: name,
    version: "1.0.0",
    license: "MIT",
    scripts: {
      "dev": ""
    }
  }
  if (!isApp) {
    packageJson.host = '设置container对应的host'
    packageJson.code = name
  }
  let packagePath = path + "/package.json";
  fs.createFileSync(packagePath);
  fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2) + os.EOL);
}

function isInGitRepository() {
  try {
    execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
    return true;
  } catch (e) {
    return false;
  }
}

function tryGitInit() {
  let gitVersionError = true;
  try {
    execSync('git --version', { stdio: 'ignore' });
    gitVersionError = false;
    if (isInGitRepository()) {
      return true;
    }
    execSync('git init', { stdio: 'ignore' });
    execSync('git add -A', { stdio: 'ignore' });
    execSync('git commit -m "Initial commit from kerberos"', {
      stdio: 'ignore',
    });
    return true;
  } catch (e) {
    console.error(chalk.yellow("git初始化失败"))

    if (gitVersionError) {
      console.error(chalk.red("请检查git环境是否安装正常。"))
    }
    return false;
  }

}

function addGitIgnore(root) {
  let filePath = path.resolve(root, '.gitignore')
  let gitIgnore = `
  # dependencies
  /node_modules
  
  # production
  /build
  
  # misc
  .DS_Store
  .env.local
  .env.development.local
  .env.test.local
  .env.production.local
  
  npm-debug.log*
  yarn-debug.log*
  yarn-error.log*`
  fs.createFileSync(filePath);
  fs.writeFileSync(filePath, gitIgnore + os.EOL);
}


module.exports.initApp = function (name) {
  initProject(true, name)
}

module.exports.initContainer = function (name) {
  initProject(false, name)
}