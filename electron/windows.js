const { BrowserWindow, shell, app } = require('electron');
const path = require('path');

function createMainWindow() {
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#0a0a0c',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    titleBarStyle: 'hiddenInset',
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    const allowedDomains = ['fancode.com', 'auvio.rtbf.be', 'rtbf.be', 'orf.at', 'srf.ch'];
    if (allowedDomains.some(domain => url.includes(domain))) {
      return { action: 'allow' };
    }
    shell.openExternal(url);
    return { action: 'deny' };
  });

  if (!app.isPackaged) {
    mainWindow.loadURL('http://localhost:5173');
    // Only open DevTools if explicitly requested via ENV flag
    if (process.env.DEVTOOLS === '1') mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }

  return mainWindow;
}

function createStreamWindow(title, url) {
  const streamWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    backgroundColor: '#000000',
    title,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    }
  });
  streamWindow.loadURL(url);
  return streamWindow;
}

module.exports = { createMainWindow, createStreamWindow };
