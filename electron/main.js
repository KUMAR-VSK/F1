const { app } = require('electron');
const { createMainWindow } = require('./windows');
const { registerIpcHandlers } = require('./ipc');

app.whenReady().then(() => {
  createMainWindow();
  registerIpcHandlers();

  app.on('activate', () => {
    const { BrowserWindow } = require('electron');
    if (BrowserWindow.getAllWindows().length === 0) createMainWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
