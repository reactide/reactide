'use strict';

const { app, BrowserWindow, Menu, Tray } = require('electron');
const path = require('path');
const url = require('url')
const fs = require('fs');
const menuTemplate = require('./menus/mainMenu');
const registerShortcuts = require('./localShortcuts');
const registerIpcListeners = require('./ipcMainListeners');
const devtron = require('devtron');
const { exec } = require('child_process');
require('electron-debug')();

const projInfoPath = path.join(__dirname, '../lib/projInfo.js');
const projInfo = {
  htmlPath: '',
  hotLoad: false,
  webpack: false,
  rootPath: '',
  devServer: false,
  devServerScript: '',
  mainEntry: '',
  reactEntry: ''
};
const installExtensions = async () => {
  devtron.install();
  const installer = require('electron-devtools-installer');
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  for (const name of extensions) {
    try {
      await installer.default(installer[name], forceDownload);
    } catch (e) {
      console.log(`Error installing ${name} extension: ${e.message}`);
    }
  }
};
 
 const nativeImage = require('electron').nativeImage;
 let image = nativeImage.createFromPath(__dirname + '/icons/icon.icns');
 image.setTemplateImage(true);
 
 // Main window init
 // define window in global scope to prevent garbage collection
 let win = null;
 app.on('ready', async () => {
   // initialize main window
   win = new BrowserWindow({
     width: 1200,
    height: 800,
    minWidth: 604,
    minHeight: 283,
    title: 'Reactide',
    // titleBarStyle: hidden-inset, // pending
    // icon: image,
    show: false
  });

  // load index.html to main window
  win.loadURL('file://' + path.join(__dirname, '../renderer/index.html'));

  // initialize menus
  const menu = Menu.buildFromTemplate(menuTemplate(win));
  Menu.setApplicationMenu(menu);

  // toggle devtools only if development
  await installExtensions();
  
  // put Main window instance in global variable for use in other modules
  global.mainWindow = win;

  // Register listeners and shortcuts
  registerIpcListeners();
  registerShortcuts(win);
  //Register listener to close entire window + simulator window when mainWindow closes
  win.on('closed', function(){
    fs.writeFileSync(projInfoPath, JSON.stringify(projInfo));
    exec(
      'killall node',
      (err, stdout, stderr) => {
      }
    );
    app.quit();
  });
  // Wait for window to be ready before showing to avoid white loading screen
  win.once('ready-to-show', () => {
    win.show();
  });
});
