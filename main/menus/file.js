const {dialog, Menu, ipcMain, BrowserWindow} = require('electron');
const path = require('path');
const copy = require('../../lib/copy-directory');
const deleteDirectory = require('../../lib/delete-directory');
const mainWindow = require('../main.js');
const template = [
  {
    label: 'Main',
  },
  {
    label: 'Test',
    submenu: [
      {
        label: 'Open',
        click: () => {
          const rootDir = dialog.showOpenDialog({ properties: ['openDirectory'] });
          if (rootDir) {
            BrowserWindow.getFocusedWindow().webContents.send('openDir', rootDir[0]);
          }
        }
      },
      {
        label: 'Save',
        click: () => {
          const save = dialog.showSaveDialog();
          if (save) {
            copy('./lib/temp/new-project', save[0]);
          }
          BrowserWindow.getFocusedWindow().webContents.send('openDir', save[0]);
        }
      },
      {
        label: 'New Project',
        click: () => {
          //warn user of unsaved changes before belo
            deleteDirectory('./lib/temp/new-project');
            copy('./lib/new-project-template/new-project', './lib/temp/');
            BrowserWindow.getFocusedWindow().webContents.send('openDir', path.join(__dirname, '../../lib/temp/new-project'));
        }
      }
    ],
  },
  {
    label: 'TEST2',
    submenu: [
      { role: 'redo' }
    ]
  }
]

module.exports = template;