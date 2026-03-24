const { app, BrowserWindow } = require('electron');
const path = require('path');
const fs = require('fs');

app.disableHardwareAcceleration();

app.whenReady().then(() => {
  let win = new BrowserWindow({
    width: 512,
    height: 512,
    show: false,
    frame: false,
    transparent: true,
    webPreferences: {
      offscreen: true,
      nodeIntegration: false
    }
  });

  win.loadFile('/tmp/gen_icon.html');

  win.webContents.on('did-finish-load', () => {
    setTimeout(async () => {
      try {
        const image = await win.webContents.capturePage();
        const buffer = image.toPNG();
        fs.mkdirSync(path.join(__dirname, 'build'), { recursive: true });
        fs.writeFileSync(path.join(__dirname, 'build/icon.png'), buffer);
        console.log('Icon generated successfully');
      } catch (e) {
        console.error('Failed to generate icon', e);
      } finally {
        app.quit();
      }
    }, 1000);
  });
});
