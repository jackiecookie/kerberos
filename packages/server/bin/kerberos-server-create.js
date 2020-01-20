const program = require('commander');
const getCliOptions = require('./utils/index');
const { initApp, initContainer } = require("./commands/create");



program
    .option('-c, --container <name>', '初始化容器')
    .option('-a, --app <name>', '初始化app')
    .option('-s, --server <name>', '初始化app')
    .parse(process.argv);

(() => {
    const cliOptions = getCliOptions(program);
    const { container, app, server } = cliOptions;
    if(server){

    }
    else if (container) {
        initContainer(container)
    }
    else if (app) {
        initApp(app);
    }

})();