'use strict'

const fs = require('fs');
const path = require('path');
//TRY AND CHANGE THIS TO DIRECTLY INTERFACE WITH THE TERMINAL
module.exports = (filePath) => {
  try {
    fs.accessSync(filePath);
    recursivelyDelete(filePath);
  } catch (e) {
    return;
  }
  
  function recursivelyDelete(filePath) {
    //check if directory or file
    let stats = fs.statSync(filePath);
    //if file unlinkSync
    if (stats.isFile()) {
      fs.unlinkSync(filePath);
    }
    //if directory, readdir and call recursivelyDelete for each file
    else {
      let files = fs.readdirSync(filePath);
      files.forEach((file) => {
        recursivelyDelete(path.join(filePath, file));
      });
      fs.rmdirSync(filePath);
    }
  }
}