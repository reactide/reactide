const localShortcut = require('electron-localshortcut');

module.exports = (win) => {
  localShortcut.register(win, 'CommandOrControl+Alt+I', () => {
    win.toggleDevTools();
  });
  localShortcut.register(win, 'CommandOrControl+S', () => {
    win.webContents.send('saveFile');
  })
  localShortcut.register(win, 'CommandOrControl+Backspace', () => {
    win.webContents.send('delete');
  })
}