const electron = require('electron');
const {BrowserWindow, ipcMain, Menu, app, dialog} = require('electron');
const url = require('url');
const path = require('path');
const template = require('./menus/file');
const registerShortcuts = require('./localShortcuts');
const registerIpcListeners = require('./ipcMainListeners');
const fs = require('fs');

app.on('ready', () => {
  let win = new BrowserWindow({
    width: 1000,
    height: 800
  });
  win.loadURL('file://' + path.join(__dirname, '../renderer/index.html'));
  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (process.env.NODE_ENV === 'development') win.toggleDevTools();
  
  registerShortcuts(win);
});
registerIpcListeners();



