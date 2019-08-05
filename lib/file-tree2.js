'use strict'
//Pass in path to root directory
//returns object representation with all directories and files
//directory properties have property structure
//path: STRING, files: ARRAY, opened: BOOL (default false), type:STRING
//file properties have property structure
//path:STRING, type:STRING

//separate out the proj info stuff into another module? and then put info in local storage instead of a local file?

const fs = require('fs');
const path = require('path');
const { File, Directory } = require('./item-schema');

const projInfoPath = path.join(__dirname, '../lib/projInfo.js');

const projInfo = {
  htmlPath: '',
  hotLoad: false,
  webpack: false,
  rootPath: '',
  devServer: false,
  devServerScript: '',
  mainEntry: '',
  reactEntry: '',
  CRA: false,
};

function insertSorted(fileOrDir, filesOrDirs) {
  filesOrDirs.push(fileOrDir);
}

function init() {
  projInfo.htmlPath = '';
  projInfo.hotLoad = false;
  projInfo.webpack = false;
  projInfo.rootPath = '';
  projInfo.devServer = false;
  projInfo.devServerScript = '';
  projInfo.mainEntry = '';
  projInfo.reactEntry = '';
  projInfo.CRA = false;
}
// return file extension by file name - Ryan Yang
function getFileExt(fileName) {
  // todo: handle special file names (eg. .gitignore .babelrc)
  let arr = fileName.split('.');
  if (arr.length == 1)
    return '';
  else
    return arr[arr.length - 1];
}
// return css class by file extension - Ryan Yang
function getCssClassByFileExt(ext) {
  switch (ext.toUpperCase()) {
    case 'JS':
      return 'seti-javascript';
    case 'JSX':
      return 'seti-react';
    case 'CSS':
      return 'seti-css';
    case 'LESS':
      return 'seti-less';
    case 'SASS':
    case 'SCSS':
      return 'seti-sass';
    case 'JSON':
      return 'seti-json';
    case 'SVG':
      return 'seti-svg';
    case 'EOT':
    case 'WOFF':
    case 'WOFF2':
    case 'TTF':
      return 'seti-font';
    case 'XML':
      return 'seti-xml';
    case 'YML':
      return 'seti-yml';
    case 'MD':
      return 'seti-markdown';
    case 'HTML':
      return 'seti-html';
    case 'JPG':
    case 'PNG':
    case 'GIF':
    case 'JPEG':
      return 'seti-image';
    default:
      return 'octi-file-text';
  }
}

//getTree is a function expression that takes in 2x arguments
//A 'rootDirPath' and a callback
const getTree = (rootDirPath, callback) => {
  //init resets the values in the projInfo object back to their default values
  init();
  //rootPath property inside of projInfo object is reassigned to the inputted rootDirPath
  projInfo.rootPath = rootDirPath;
  //fileTree is assigned the object returned from invoking Director constructor
  //Object returned has the following properties:
  //path, type, name, opened, files, subdirectories, & id
  //The path.basename() methods returns the last portion of a path, in this instance, the folder name
  let fileTree = new Directory(rootDirPath, path.basename(rootDirPath), true);
  console.log(fileTree, '***');

  //I'm not sure what the purpose of pending is
  let pending = 1;

  //recurseThroughFileTree is called and passed the object that exists at fileTree
  function recurseThroughFileTree(directory) {
    //Loop through files and fill files property array
    //fs.readdir reads the contents of a directory
    //entire directory exists at directory.path
    fs.readdir(directory.path, (err, files) => {

      //I'm not sure what the purpose of pending is
      pending += files.length;

      //this conditional is assessing pending after it's decremented to see if it's a false/falsy value
      //should only be true after being decremented several times
      if (!--pending) {
        //if it is, we call writeFileSync and pass the file stored at projInfoPath 
        //we write the stringified value of projInfo to whatever file exists at projInfoPath
        fs.writeFileSync(projInfoPath, JSON.stringify(projInfo));
        //inputted callback to getTree is then fired and passed the fileTree object
        callback(fileTree);
      }
      //files is an array of files that exist in the directory passed to the fs.readdir method
      //forEach is used to iterate over that array
      files.forEach((file) => {
        //filePath uses path.join() to join the path and file names together
        const filePath = path.join(directory.path, file);
        //fs.stat is a method that checks for file details associated with the inputted file
        //if status is good, it's details are available at the 'stats' variable
        fs.stat(filePath, (err, stats) => {
          if (err) {
            //this conditional is assessing pending after it's decremented to see if it's a false/falsy value
            //should only be true after being decremented several times
            if (!--pending) {
              //if it is, we call writeFileSync and pass the file stored at projInfoPath 
              //we write the stringified value of projInfo to whatever file exists at projInfoPath
              fs.writeFileSync(projInfoPath, JSON.stringify(projInfo));
              //inputted callback to getTree is then fired and passed the fileTree object
              callback(fileTree);
            }
          }
          //checks if stats is true or truthy & stats.isFile() resolves to true
          if (stats && stats.isFile()) {
            //insertSorted pushes an object into the directory.files array
            //object pushed into the array has the following parameters:
            //path, type, name, ext, id
            insertSorted(new File(filePath, file, getFileExt), directory.files);
            //check if the filePath is the same as the resolved value as path.join(...) & if the file contains the text of webpack.config.js
            if (filePath === path.join(projInfo.rootPath, file) && file.search(/webpack.config.js/) !== -1) {
              //if it does, then we invoke the readFile method to access the data in the file
              fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
                //created a regExp to check for a pattern that matches entry...
                const regExp = new RegExp('entry(.*?),', 'g');
                //file is stringified and then searched for the match assigned to the regExp
                let entry = JSON.stringify(data).match(regExp);

                //?????
                let reactEntry = String(entry[0].split('\'')[1]);

                //reactEntry property inside of the projInfo object is updated to the resolved value of path.join(...)
                projInfo.reactEntry = path.join(projInfo.rootPath, reactEntry);
              })
            }
            //look for index.html not in node_modules, get path
            if (!projInfo.htmlPath && filePath.search(/.*node\_modules.*/) === -1 && file.search(/.*index\.html/) !== -1) {
              projInfo.htmlPath = filePath;
            }
            //look for package.json and see if webpack is installed and react-dev-server is installed
            else if (!projInfo.webpack && file.search(/package.json/) !== -1 && filePath === path.join(projInfo.rootPath, file)) {
              //if projInfo.webpack is false, the file contains package.json, and the filePath matches the resolved value of projInfo.rootPath & file, readFile is invoked and passed the filePath variable
              fs.readFile(filePath, { encoding: 'utf-8' }, (err, data) => {
                //data is parsed into a JS object
                data = JSON.parse(data);
                //checks if the parsed object has a property of react-scripts
                if (data.dependencies['react-scripts']) {
                  //if it does, the property of devServerScript is reassigned to 'start'
                  projInfo.devServerScript = 'start',
                    //if it does, the property of CRA is reassigned to 'true'
                    projInfo.CRA = true;
                  //checks if the parsed object has a property of webpack-dev-server
                } else if (data.devDependencies['webpack-dev-server']) {
                  //if it does, the property of devServerScript is reassigned to 'run dev-server'
                  projInfo.devServerScript = 'run dev-server';
                }
                //checks if data.main is true or truthy
                if (data.main) {
                  //if it is, the mainEntry property is reassigned to the resolved value of path.join(...)
                  projInfo.mainEntry = path.join(filePath, data.main);
                }
              })
            }

            //this conditional is assessing pending after it's decremented to see if it's a false/falsy value
            //should only be true after being decremented several times
            if (!--pending) {
              //if it is, we call writeFileSync and pass the file stored at projInfoPath 
              //we write the stringified value of projInfo to whatever file exists at projInfoPath
              fs.writeFileSync(projInfoPath, JSON.stringify(projInfo));
              //inputted callback to getTree is then fired and passed the fileTree object
              callback(fileTree);
            }
            //checks if stats is true or truthy
            else if (stats) {
              //if it is, a const variable is declared and assigned the resolved value of invoking the Diretory constructor and passing it the filePath and file variables
              const subdirectory = new Directory(filePath, file);
              //put directories in front
              insertSorted(subdirectory, directory.subdirectories);
              //calls recurseThroughFileTree on the newly found subdirectory
              recurseThroughFileTree(subdirectory);
            }
          }
        });
      })
    })
  }
  recurseThroughFileTree(fileTree);
  //returns the fileTree object
  return fileTree;
}

module.exports = { getTree, getCssClassByFileExt, getFileExt };