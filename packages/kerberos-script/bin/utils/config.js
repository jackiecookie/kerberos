const fs = require('fs');
const os = require("os");


const config_file = 'config';


let cwd = process.cwd();

function createConfig(path) {
    fs.writeFileSync(path, "{}");
}


module.exports.updateConfig = async (configFile, key, value) => {
    let configFullPath = `${cwd}/${config_file}/${configFile}.json`
    let configExist = fs.existsSync(configFullPath);
    if (!configExist) {
        createConfig(configFullPath);
    }
    const config = require(configFullPath);
    config[key] = value;
    fs.writeFileSync(configFullPath, JSON.stringify(config, null, 2) + os.EOL)
}