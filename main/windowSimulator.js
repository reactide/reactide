'use strict';

const fs = require('fs');
const path = require('path');
require('fix-path')();
const {spawn} = require('child_process');


const windowSimulator = () => {

  const projInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/projInfo.js')));

  //Simulation for CRA
  if (projInfo.devServerScript === 'start') {
    const child = spawn('npm', ['start'], {cwd: projInfo.rootPath});
      child.stdout.on('data', (data) => {
        global.mainWindow.webContents.send('start simulator',['http://localhost:3000',child.pid]);
      });
  //Simulation for react-dev-server
  } else if (projInfo.devServerScript === 'run dev-server') {
    let child = spawn('npm',  ['run', 'reactide-server'], {cwd: projInfo.rootPath});
      child.stdout.on('data', (data) => {
        global.mainWindow.webContents.send('start simulator',['http://localhost:8085', child.pid]);
    })
  } else if (projInfo.htmlPath) {
    global.mainWindow.webContents.send('file://' + projInfo.htmlPath);
  } else {
    console.log('No Index.html found');
  }
};

module.exports = windowSimulator;
