'use strict';

const { dialog } = require('electron');
const path = require('path');
const copy = require('../../lib/copy-directory');
const deleteDirectory = require('../../lib/delete-directory');

const menuTemplate = windowObj => [
  {
    label: 'Main',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' },
    ],
  },
  {
    label: 'File',
    submenu: [
      {
        label: 'New Project',
        click: () => {
          // warn user of unsaved changes before belo
          global.newProj = true;
          global.mainWindow.webContents.send('newProject');
          deleteDirectory('./lib/new-project');
          copy('./lib/new-project-template/new-project', './lib/');
          global.mainWindow.webContents.send(
            'openDir',
            path.join(__dirname, '../../lib/new-project')
          );
        },
        accelerator: 'CommandOrControl+N',
      },
      {
        label: 'Open…',
        click: () => {
          global.newProj = false;
          const rootDir = dialog.showOpenDialog(windowObj, {
            properties: ['openDirectory']
          });
          if (rootDir) {
            global.mainWindow.webContents.send('openDir', rootDir[0]);
          }
        },
        accelerator: 'CommandOrControl+O',
      },
      {
        label: 'Save',
        click: () => {
          const save = dialog.showSaveDialog();
          if (save) {
            copy('./lib/temp/new-project', save[0]);
          }
          global.mainWindow.webContents.send('openDir', save[0]);
        },
        accelerator: 'CommandOrControl+S',
      },
    ],
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
    ],
  },
  {
    label: 'Selection',
    submenu: [
      { role: 'selectall' },
    ],
  },
  {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' },
    ],
  },
];

module.exports = menuTemplate;
