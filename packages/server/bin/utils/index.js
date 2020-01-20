
const camelcase = require('camelcase');

module.exports = (program) => {
  const cliOptions = {};
  program.options.forEach((option) => {
    const key = camelcase(option.long, {
      pascalCase: false,
    });

    if (program[key] !== undefined) {
      cliOptions[key] = program[key];
    }
  });

  return cliOptions;
};
