'use strict';
const { dialog, BrowserWindow } = require('electron');
const path = require('path');
const copy = require('../../lib/copy-directory');
const deleteDirectory = require('../../lib/delete-directory');
const cra = require('../../lib/create-react-app');
const { ipcMain } = require('electron');
const { exec } = require('child_process');
let splash = null;

const createNewProj = () => {
  // warn user of unsaved changes before below
  global.newProj = true;
  const save = dialog.showSaveDialog();
  //Run cra with 'save' variable as destination path
  if (save) {
    cra(path.join(path.dirname(save), path.basename(save).toLowerCase()));
    splash = new BrowserWindow({
      width: 600,
      height: 400,
      minWidth: 604,
      minHeight: 283,
      webPreferences: {
        devTools: false
      },
      frame: false
    })

    splash.setAlwaysOnTop(true);
    splash.loadFile(path.join(__dirname, "../../renderer/splash/public/index.html"))
    splash.once('ready-to-show', () => {
      splash.show();
    })
    global.mainWindow.webContents.send('newProject');
    ipcMain.on('closeSplash', () => {
      //garbage collect loader page
      splash.hide()
    })
  }
}

const openExistingProject = (windowObj) => {

  exec(`killall node`);
  global.mainWindow.webContents.send('closeSim', 'helloworld');
  global.newProj = false;
  //opens a directory
  const rootDir = dialog.showOpenDialog(this.windowObj, {
    properties: ['openDirectory']
  });
  if (rootDir) {
    global.mainWindow.webContents.send('openDir', rootDir[0]);
  }
}

const reactideWindow = () => {
  let reactideWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 600,
    minHeight: 300,
    webPreferences: {
      devTools: false
    }
  })

  reactideWindow.loadURL('https://reactide.github.io/reactide-website/')
  reactideWindow.once('ready-to-show', () => {
    reactideWindow.show()
  })

  reactideWindow.on('closed', () => {
    reactideWindow = null
  })
}

const githubWindow = () => {
  let githubSite = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 604,
    minHeight: 300,
    webPreferences: {
      devTools: false
    }
  })
  githubSite.loadURL('https://github.com/reactide/reactide')
  githubSite.once('ready-to-show', () => {
    githubSite.show()
  })

  githubSite.on('closed', () => {
    githubSite = null
  })
}

// ipcMain.on('itsReady', changeDevTools)
ipcMain.on('createNewProj', createNewProj)
ipcMain.on('openExistingProject', openExistingProject)
ipcMain.on('openReactideSite', reactideWindow)
ipcMain.on('openGithub', githubWindow)


const menuTemplate = windowObj => [

  {},
  {
    label: 'Main',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New Project',
        click: () => createNewProj(),
        accelerator: 'CommandOrControl+N'
      },
      { type: 'separator' },
      {
        label: 'Open…',
        click: () => openExistingProject(),
        accelerator: 'CommandOrControl+O'
      },
      { type: 'separator' },
      {
        label: 'Save',
        click: () => {
          global.mainWindow.webContents.send('saveFile');
        },
        accelerator: 'CommandOrControl+S'
      }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  },
  {
    label: 'Selection',
    submenu: [{ role: 'selectall' }]
  },
  {
    role: 'window',
    submenu: [{ role: 'minimize' }, { role: 'close' }]
  },
  {
    label: 'Developer Tools',
    submenu: [
      {
        label: 'Toggle DevTools',
        accelerator: process.platform == 'darwin' ? 'Command+I' : 'Ctrl+I',
        click(item, focusedWindow) {
           global.mainWindow.toggleDevTools()
        }
      },
      {
        role: 'reload'
      }
    ]
  }
];





module.exports = menuTemplate


