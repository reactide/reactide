const { BrowserWindow, ipcMain, Menu, app, dialog } = require('electron');
const path = require('path');
const template = require('./menus/mainMenu');
const registerShortcuts = require('./localShortcuts');
const registerIpcListeners = require('./ipcMainListeners');
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

//Main window Init
app.on('ready', async () => {
  
  //install React & Redux Extensions
  await installExtensions();
  
  //initialize main window
  let win = new BrowserWindow({
    width: 1000,
    height: 800
  });
  
  //load index.html to main window
  win.loadURL('file://' + path.join(__dirname, '../renderer/index.html'));

  //initialize menus
  let menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  //toggle devtools only if development
  if (isDevelopment) win.toggleDevTools();

  //put Main window instance in global variable for use in other modules
  global.mainWindow = win;

  //Register listeners and shortcuts
  registerIpcListeners();
  registerShortcuts(win);
});
