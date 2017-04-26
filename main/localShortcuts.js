const localShortcut = require('electron-localshortcut');
const {dialog} = require('electron');

module.exports = (win) => {
  localShortcut.register(win, 'CommandOrControl+Alt+I', () => {
    win.toggleDevTools();
  });
  localShortcut.register(win, 'CommandOrControl+S', () => {
    win.webContents.send('saveFile');
  });
  localShortcut.register(win, 'CommandOrControl+Backspace', () => {
    win.webContents.send('delete');
  });
  localShortcut.register(win, 'CommandOrControl+R', () => {
    win.reload();
  })
  localShortcut.register(win, 'Command+Q', () => {
    win.close();
  })
  localShortcut.register(win, 'CommandOrControl+O', () => {
    
    //  From {mainToolbar.js}
    //  Opens native OS file explorer
    //    Explorer -> Windows x64/x86
    //    Finder -> macOS
    dialog.showOpenDialog({ properties: ['openDirectory'] });
  })
}
