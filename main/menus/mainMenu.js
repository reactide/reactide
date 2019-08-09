'use strict';
const { dialog, BrowserWindow } = require('electron');
const path = require('path');
const copy = require('../../lib/copy-directory');
const deleteDirectory = require('../../lib/delete-directory');
const cra = require('../../lib/create-react-app');
const { ipcMain } = require('electron');

let splash = null;

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
        click: () => {
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
              }
            })

            splash.setAlwaysOnTop(true);
            splash.loadFile(path.join(__dirname, "../../renderer/splash/public/index.html"))

            splash.once('ready-to-show', () => {
              splash.show();
            })

            global.mainWindow.webContents.send('newProject');


            ipcMain.on('closeSplash', () => {
              splash.close()
            })

            ipcMain.on('closed', () => {
              splash = null
            })

           //garbage collect loader page
            splash.on('closeSplash', () => {
              splash.close()
              splash = null
            })


          }
        },
        accelerator: 'CommandOrControl+N'
      },
      { type: 'separator' },
      {
        label: 'Open…',
        click: () => {
          global.newProj = false;
          //opens a directory
          const rootDir = dialog.showOpenDialog(windowObj, {
            properties: ['openDirectory']
          });
          
          // console.log(rootDir, 'SSS');
          if (rootDir) {
            global.mainWindow.webContents.send('openDir', rootDir[0]);
          }
        },
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


