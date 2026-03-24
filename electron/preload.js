const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFanCode: () => ipcRenderer.send('open-fancode'),
  openRTBF: () => ipcRenderer.send('open-rtbf'),
  triggerNotification: (title, body) => ipcRenderer.send('trigger-notification', { title, body })
});
