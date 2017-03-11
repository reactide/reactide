const fs = require('fs');
const path = require('path');

module.exports = (source, destination) => {
  //create recursive function
  function recurseThroughSource(source, destination) {
    //check whether if source is file or directory
    const dest = path.join(destination, path.basename(source));

    const stats = fs.statSync(source);
    if (stats.isFile()) {
      //if file read then write to destination
      let data = fs.readFileSync(source);
      fs.writeFileSync(dest, data);
    }
    //if directory exists don't overwrite, otherwise mkdir
    //should ask user if he wants to overwrite everything and overwrite everything if yes
    else {
      try {
        fs.accessSync(dest);
        console.log('directory found, won\'t overwrite');
      } catch (e) {
        // fs.chmodSync(path.resolve(dest, '..'), 00777);
        fs.mkdirSync(dest);
        const files = fs.readdirSync(source);
        files.forEach((file) => {
          recurseThroughSource(path.join(source, path.basename(file)), dest);
        });
      }
    }
    //then recurses with path to that directory
  }
  recurseThroughSource(source, destination);
}