const electron = require('electron');
const {BrowserWindow, ipcMain, Menu, app, dialog, globalShortcut} = require('electron');
const url = require('url');
const path = require('path');
const template = require('./menus/file');
const {spawn, exec} = require('child_process');
// require('electron-reload')(path.join(__dirname, '../'));

app.on('ready', () => {
  let win = new BrowserWindow({
    width: 1000,
    height: 800
  });
  win.loadURL('file://' + path.join(__dirname, '../renderer/index.html'));
  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  globalShortcut.register('CommandOrControl+Alt+I', () => {
    win.toggleDevTools();
  });
  
});
function simulator() {
  let spawnOfHeaven = exec('webpack', {
    cwd: path.join(__dirname, '../lib/temp/new-project')
  }, (err, stdout, stderr) => {
    console.log('err:', err);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    let child = new BrowserWindow({
      width: 800,
      height: 600
    });
    child.loadURL('file://' + path.join(__dirname, '../lib/temp/new-project/client/public/index.html'));
    child.toggleDevTools();
  })
}

ipcMain.on('openSimulator', (event, arg) => {
  simulator();
})


