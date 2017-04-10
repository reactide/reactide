
module.exports = (win) => {
  // Prevent window to open the file on drop
  win.webContents.on('will-navigate', (event) => {
    event.preventDefault();
  });
}
