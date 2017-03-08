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
    //if directory check if directory exists, otherwise mkdir
    else {
      try {
        fs.accessSync(dest);
        console.log('dir found, won\'t overwrite');
      } catch (e) {
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