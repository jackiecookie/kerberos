const program = require('commander');
const getCliOptions = require('./utils/index');
const Git = require("nodegit");
const log = require("./utils/log");
const configHelp = require("./utils/config");

const _regex = /([^\/]+(?!.*\/))[.]git/g


program
    .option('-c, --container <gitRepository>', '附加容器')
    .option('-a, --app <gitRepository>', '附加app')
    .parse(process.argv);

function onError(err) {
    log.error(err.message || err);
    process.exit(1);
}

function GitClone(repo, path) {
    let repoNames = _regex.exec(repo);
    if (!repoNames) {
        const error = '非法git仓库地址'
        onError(error)
    } else {
        return Git.Clone(repo, path + repoNames[1]).catch(onError).then(function () {
            return repoNames[1];
        });
    }
}

function updateRepoConfig(key, gitRepo) {
    return function (repoName) {
        configHelp.updateConfig(key, repoName, gitRepo)
    }
}

( () => {
    const cliOptions = getCliOptions(program);
    const { container, app } = cliOptions;
    if (container) {
        GitClone(container, `./containers/`).then(updateRepoConfig("container", container));
    }
    if (app) {
        GitClone(app, `./apps/`).then(updateRepoConfig("apps", app));
    }
})();