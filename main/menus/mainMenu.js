const {dialog, Menu, ipcMain, BrowserWindow} = require('electron');
const electron = require('electron');
const path = require('path');
const copy = require('../../lib/copy-directory');
const deleteDirectory = require('../../lib/delete-directory');

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
          global.newProj = false;
          const rootDir = dialog.showOpenDialog({ properties: ['openDirectory'] });
          if (rootDir) {
            global.mainWindow.webContents.send('openDir', rootDir[0]);
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
          global.mainWindow.webContents.send('openDir', save[0]);
        }
      },
      {
        label: 'New Project',
        click: () => {
          //warn user of unsaved changes before belo
          global.newProj = true;
          global.mainWindow.webContents.send('newProject');
          deleteDirectory('./lib/new-project');
          copy('./lib/new-project-template/new-project', './lib/');
          global.mainWindow.webContents.send('openDir', path.join(__dirname, '../../lib/new-project'));
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