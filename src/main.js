const electron = require('electron');
const { BrowserWindow, ipcMain, Menu, app, dialog } = require('electron');
const url = require('url');
const path = require('path');
const template = require('./menus/file');
const registerShortcuts = require('./localShortcuts');
const registerIpcListeners = require('./ipcMainListeners');
const fs = require('fs');
require('electron-debug')();

const isDevelopment = (process.env.NODE_ENV === 'development');

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const extensions = [
    'REACT_DEVELOPER_TOOLS',
    'REDUX_DEVTOOLS'
  ];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`);
    }
  }
};

app.on('ready', async () => {
  if (isDevelopment) {
    await installExtensions();
  }

  let win = new BrowserWindow({
    width: 1000,
    height: 800
  });
  win.loadURL('file://' + path.join(__dirname, '../src/index.html'));
  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  if (isDevelopment) win.toggleDevTools();

  global.mainWindow = win;
  registerShortcuts(win);
});
