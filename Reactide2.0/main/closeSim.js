const fs = require('fs');
const path = require('path');
require('fix-path')();
const { exec } = require('child_process');

const closeSim = (pid) => {
    //Killall Node
    let command = 'killall node'
    let child = exec(
      command,
      (err, stdout, stderr) => {
        if(err) console.log(err);
        global.mainWindow.webContents.send('closeSim', 'helloworld');
      }
    );
  }
  module.exports = closeSim;
