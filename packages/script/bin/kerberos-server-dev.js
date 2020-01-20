
const program = require('commander');
const startDevServer = require("./commands/dev");
const getCliOptions = require('./utils/index');



program
    .option('-p, --port <port>', '设置端口')
    .parse(process.argv);



(() => {
    const cliOptions = getCliOptions(program);
    const { port } = cliOptions;
    startDevServer(port)
})();
