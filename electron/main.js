const { app, BrowserWindow, shell, ipcMain, Notification } = require('electron');
const path = require('path');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0a0a0c',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'hiddenInset', // Makes it look premium on macOS
  });

  // Open target links externally so they don't break the app flow
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.includes('fancode.com') || url.includes('auvio.rtbf.be') || url.includes('rtbf.be')) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  // In development, load from Vite dev server
  if (process.defaultApp || /[\\/]electron-prebuilt[\\/]/.test(process.execPath) || /[\\/]electron[\\/]/.test(process.execPath)) {
    mainWindow.loadURL('http://localhost:5173');
    // mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  ipcMain.on('open-fancode', () => {
    const streamWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      backgroundColor: '#000000',
      title: 'FanCode - F1 Stream',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      }
    });
    streamWindow.loadURL('https://www.fancode.com/formula1');
  });

  ipcMain.on('open-rtbf', () => {
    const streamWindow = new BrowserWindow({
      width: 1024,
      height: 768,
      backgroundColor: '#000000',
      title: 'RTBF Auvio - F1 Stream',
      webPreferences: {
        nodeIntegration: false,
        contextIsolation: true,
        sandbox: true,
      }
    });
    streamWindow.loadURL('https://auvio.rtbf.be');
  });

  ipcMain.on('trigger-notification', (event, { title, body }) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show();
    }
  });

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
