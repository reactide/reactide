const {ipcMain, BrowserWindow} = require('electron');
const fs = require('fs');
const path = require('path');
const {exec} = require('child_process');
const deleteItem = require('../lib/delete-directory');

function simulator(root) {
  const projInfo = JSON.parse(fs.readFileSync(path.join(__dirname, '../lib/projInfo.js')));
  
  if (projInfo.hotLoad) {
    let child = exec('webpack-dev-server', {
      cwd: projInfo.rootPath,
      shell: '/bin/bash'
    }, (err, stdout, stderr) => {
      let child = new BrowserWindow({
        width: 800,
        height: 600
      });
      child.loadURL('http://localhost:8080');
      child.toggleDevTools();
    })
  }
  else if(projInfo.webpack) { console.log('should open')
    let child = exec('webpack', {
      cwd: projInfo.rootPath,
      shell: '/bin/bash'
    }, (err, stdout, stderr) => {
      let child = new BrowserWindow({
        width: 800,
        height: 600
      });
      child.loadURL('file://' + projInfo.htmlPath);
      child.toggleDevTools();
    })
  } else if(projInfo.htmlPath) {
    let child = new BrowserWindow({
        width: 800,
        height: 600
      });
      child.loadURL('file://' + projInfo.htmlPath);
      child.toggleDevTools();
  } else {
    console.log('No Index.html found');
  }
}

module.exports = () => {

  ipcMain.on('openSimulator', (event, root) => {
    simulator(root);
  });

  ipcMain.on('createItem', (event, dirPath, name, type) => {
    if (type === 'file') {
      fs.writeFile(path.join(dirPath, name), '', (err) => {
        if (err) console.log(err);
      })
    } else {
      fs.mkdir(path.join(dirPath, name), (err) => {
        if (err) console.log(err);
      })
    }
  });

  ipcMain.on('delete', (event, itemPath) => {
    deleteItem(itemPath);
  });

  ipcMain.on('rename', (event, itemPath, newName) => {
    fs.rename(itemPath, path.join(path.dirname(itemPath), newName));
  });
}