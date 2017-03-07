const {dialog, Menu, ipcMain, BrowserWindow} = require('electron');

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