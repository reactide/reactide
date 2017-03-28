//Pass in path to root directory
//returns object with all directories and files
//sets up recursive watch on file tree
//directory properties have property structure
//path: STRING, files: ARRAY, opened: BOOL (default false), type:STRING
//file properties have property structure
//path:STRING, type:STRING

const fs = require('fs');
const path = require('path');
const {File, Directory} = require('./item-schema');

function insertSorted(fileOrDir, filesOrDirs) {
  // for (var i = 0; i < filesOrDirs.length; i++) {
  //   for (var j = 0; j < fileOrDir.name.length; j++) {
  //     if (fileOrDir.name[j] > filesOrDirs[i].name[j]) break;
  //     else if (fileOrDir.name[j] < filesOrDirs[i].name[j]) filesOrDirs.splice(i, 0, fileOrDir);
  //   }
  // }
  filesOrDirs.push(fileOrDir);
}

const projInfo = {
  htmlPath: '',
  hotLoad: false,
  webpack: false,
  rootPath: ''
};

function init() {
  projInfo.htmlPath = '';
  projInfo.hotLoad = false;
  projInfo.webpack = false;
  projInfo.rootPath = '';
}

var projInfoPath = path.join(__dirname, '../lib/projInfo.js');

const getTree = (rootDirPath, callback) => {
  init();
  projInfo.rootPath = rootDirPath;

  let fileTree = new Directory(rootDirPath, path.basename(rootDirPath));
  let pending = 1;
  function recurseThroughFileTree(directory) {
    //Loop through files and fill files property array
    fs.readdir(directory.path, (err, files) => {
      pending += files.length;
      if (!--pending) {
        callback(fileTree);
        fs.writeFileSync(projInfoPath, JSON.stringify(projInfo));
      }
      files.forEach((file) => {
        const filePath = path.join(directory.path, file);

        fs.stat(filePath, (err, stats) => {
          if (err) {

            console.log(err);

            if (!--pending) {
              callback(fileTree);
              fs.writeFileSync(projInfoPath, JSON.stringify(projInfo));
            }
          }

          if (stats && stats.isFile()) {
            insertSorted(new File(filePath, file), directory.files);

            //look for index.html not in node_modules, get path
            if (!projInfo.htmlPath && file.search(/.*index\.html/) !== -1 && filePath.search(/.*node\_modules.*/) === -1) {
              projInfo.htmlPath = filePath;
            }

            //look for package.json and see if webpack is installed
            else if (!projInfo.webpack && file.search(/package.json/) !== -1 && filePath === path.join(projInfo.rootPath, file)) {
              fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
                if (data.search(/webpack/) !== -1) projInfo.webpack = true;
              })
            } 

            //check index.js for AppContainer, which means there is hot loading. not very robust.
            else if (!projInfo.hotLoad && file.search(/index.js$/)) {
              fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
                if (data.search(/react\-hot\-loader/) !== -1) {
                  projInfo.hotLoad = true;
                }
              })
            }

            if (!--pending) {
              callback(fileTree);
              fs.writeFileSync(projInfoPath, JSON.stringify(projInfo));
            }
          }

          else if (stats) {
            const subdirectory = new Directory(filePath, file);
            //put directories in front
            insertSorted(subdirectory, directory.subdirectories);
            recurseThroughFileTree(subdirectory);
          }
        })
      })
    })
  }
  recurseThroughFileTree(fileTree);
  return fileTree;
}

module.exports = { getTree };