const program = require('commander');

(async () => {

  program
    .usage('<command> [options]')
    .command('attach', '初始化一个现有的程序')
    .command('create', '创建一个新的容器或者子程序')
    .command('dev', '启动开发服务器')
    .command('build', '生成文件')
    .command('start', '启动服务器');

  program.parse(process.argv);

  const proc = program.runningCommand;

  if (proc) {
    proc.on('close', process.exit.bind(process));
    proc.on('error', () => {
      process.exit(1);
    });
  }

  const subCmd = program.args[0];
  if (!subCmd) {
    program.help();
  }
})();
