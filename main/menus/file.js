const {dialog, Menu, ipcMain, BrowserWindow} = require('electron');
const copy = require('../../lib/copy-dir-recurs');
const deleteDirectory = require('../../lib/delete-recurs');

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
          BrowserWindow.getFocusedWindow().webContents.send('openDir', rootDir);
        }
      },
      {
        label: 'Save',
        click: () => {
          const save = dialog.showSaveDialog();
          
        }
      },
      {
        label: 'New Project',
        click: () => {
          const file = dialog.showOpenDialog({ properties: ['openDirectory'] });
          deleteDirectory('./lib/temp/new-project');
          copy(file[0], './lib/temp/');
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