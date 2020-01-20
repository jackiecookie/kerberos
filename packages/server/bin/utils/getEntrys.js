const glob = require('glob');
const path = require('path');

const getDefaultEntryName = (pageName) => pageName.toLocaleLowerCase();



module.exports = function getEntrys(cwd) {
  const entry = {};
  const appsIndexFiles = glob.sync('apps/*/index.*', {
    cwd: cwd,
  });

  const containerIndexFiles = glob.sync('containers/*/index.*', {
    cwd: cwd,
  });


  containerIndexFiles.concat(appsIndexFiles).filter((indexFile) => {
    return ['.jsx', '.js', '.tsx', '.ts'].indexOf(path.extname(indexFile)) !== -1;
  }).forEach((indexFile) => {
    // apps/user/index.tsx => user
    const pageName = indexFile.split('/')[0] + '-' + indexFile.split('/')[1];
    const entryName = getDefaultEntryName(pageName);

    entry[entryName] = indexFile;
  });
  return entry;
};