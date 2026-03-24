const { ipcMain, Notification } = require('electron');
const { createStreamWindow } = require('./windows');

const STREAMS = {
  'open-fancode': { title: 'FanCode - F1 Stream',      url: 'https://www.fancode.com/formula1' },
  'open-rtbf':    { title: 'RTBF Auvio - F1 Stream',   url: 'https://auvio.rtbf.be' },
  'open-orf':     { title: 'ORF - F1 Stream',           url: 'https://tvthek.orf.at' },
  'open-srf':     { title: 'SRF - F1 Stream',           url: 'https://www.srf.ch/play/tv' },
};

function registerIpcHandlers() {
  Object.entries(STREAMS).forEach(([channel, { title, url }]) => {
    ipcMain.on(channel, () => createStreamWindow(title, url));
  });

  ipcMain.on('trigger-notification', (event, { title, body }) => {
    if (Notification.isSupported()) {
      new Notification({ title, body }).show();
    }
  });
}

module.exports = { registerIpcHandlers };
