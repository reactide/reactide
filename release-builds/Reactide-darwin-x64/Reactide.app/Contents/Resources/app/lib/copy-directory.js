'use strict'

const fs = require('fs');
const path = require('path');
//MAKE A DIRECTORY --OSCAR AND PABLO
module.exports = (source, destination) => {
  //create recursive function
    //check whether if source is file or directory

    const dest = path.join(destination, path.basename(source));

    const stats = fs.statSync(source);
    //if directory exists don't overwrite, otherwise mkdir
    //should ask user if he wants to overwrite everything and overwrite everything if yes
      try {
        fs.accessSync(dest);
      } catch (e) {
        fs.mkdirSync(destination);
      }
    }