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
// let uniqueId = 0;
// function File(path, name) {
//   this.path = path;
//   this.type = 'file';
//   this.name = name;
//   this.id = uniqueId++;
// }

// function Directory(path, name) {
//   this.path = path;
//   this.type = 'directory';
//   this.name = name;
//   this.opened = false;
//   this.files = [];
//   this.subdirectories = [];
//   this.id = uniqueId++;
// }

function insertSorted(fileOrDir, filesOrDirs) {
  // for (var i = 0; i < filesOrDirs.length; i++) {
  //   for (var j = 0; j < fileOrDir.name.length; j++) {
  //     if (fileOrDir.name[j] > filesOrDirs[i].name[j]) break;
  //     else if (fileOrDir.name[j] < filesOrDirs[i].name[j]) filesOrDirs.splice(i, 0, fileOrDir);
  //   }
  // }
  filesOrDirs.push(fileOrDir);
}
module.exports = (rootDirPath, callback) => {
  let fileTree = new Directory(rootDirPath, path.basename(rootDirPath));
  let pending = 1;
  function recurseThroughFileTree(directory) {
    //Loop through files and fill files property array
    fs.readdir(directory.path, (err, files) => {
      pending += files.length;
      if (!--pending) {
        callback(fileTree);
      }
      files.forEach((file) => {
        const filePath = path.join(directory.path, file);
        fs.stat(filePath, (err, stats) => {
          if (err) {
            console.log(err);
            if (!--pending) {
              callback(fileTree);
            }
          }
          if (stats && stats.isFile()) {
            insertSorted(new File(filePath, file), directory.files);
            if (!--pending) {
              callback(fileTree);
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
