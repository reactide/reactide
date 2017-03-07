const electron = require('electron');
const {BrowserWindow, ipcMain, Menu, app, dialog, globalShortcut} = require('electron');
const url = require('url');
const path = require('path');
const template = require('./menus/file');
require('electron-reload')(path.join(__dirname, '../'));

app.on('ready', () => {
  let win = new BrowserWindow({
    width: 1000,
    height: 800
  });
  win.loadURL('file://' + path.join(__dirname,'../renderer/index.html'));
  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
  globalShortcut.register('CommandOrControl+Alt+I', () => {
    win.toggleDevTools();
  })
});

ipcMain.on('hello', (event, arg)=> {
  console.log(arg);
  event.sender.send('reply', 'hello');
  event.returnValue = 'HI';
})


