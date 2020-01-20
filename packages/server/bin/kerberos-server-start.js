
const program = require('commander');
const Server = require("./commands/start");
const getCliOptions = require('./utils/index');
const chalk = require('chalk');


program
    .option('-p, --port [port]', '设置端口')
    .parse(process.argv);



(() => {
    const cliOptions = getCliOptions(program);
    let { port } = cliOptions;
    port = 3000

    let server = new Server();
    server.listen(port).then(()=>{
        console.log(chalk.cyan(`server start on ${port}`));
    })
})();
