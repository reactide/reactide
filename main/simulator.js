'use strict';

const fs = require('fs');
const path = require('path');
require('fix-path')();
const { exec, spawn } = require('child_process');
const { BrowserWindow } = require('electron');

const simulator = () => {
  const WIDTH = 800;
  const HEIGHT = 600;
  //Deserialize project info from projInfo file, contains path to index.html and presence of webpack among other things
  const projInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/projInfo.js')));

  //Simulation for CRA
  if (projInfo.devServerScript === 'start') {
    let child = exec(
      'npm start',
      {
        cwd: projInfo.rootPath,
      },
      (err, stdout, stderr) => {
        if(err) console.log(err);
        let childWindow = new BrowserWindow({
          width: WIDTH,
          height: HEIGHT
        });
        childWindow.loadURL('http://localhost:3000');
        childWindow.openDevTools();
      }
    );
  //Simulation for react-dev-server
  } else if (projInfo.devServerScript === 'run dev-server') {
    let child = new BrowserWindow({
      width: WIDTH,
      height: HEIGHT
    });
    child.loadURL('http://localhost:8085');
    child.openDevTools();
    // let child = exec(
    //   'npm run dev-server',
    //   {
    //     cwd: projInfo.rootPath,
    //     shell: '/bin/bash'
    //   },
    //   (err, stdout, stderr) => {
    //     let child = new BrowserWindow({
    //       width: WIDTH,
    //       height: HEIGHT
    //     });
    //     child.loadURL('http://localhost:8085');
    //     child.openDevTools();
    //   }
    // );
  } else if (projInfo.htmlPath) {
    let child = new BrowserWindow({
      width: WIDTH,
      height: HEIGHT
    });
    child.loadURL('file://' + projInfo.htmlPath);
    child.openDevTools();
  } else {
    console.log('No Index.html found');
  }
};

module.exports = simulator;
