const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openFanCode: () => ipcRenderer.send('open-fancode'),
  triggerNotification: (title, body) => ipcRenderer.send('trigger-notification', { title, body })
});
