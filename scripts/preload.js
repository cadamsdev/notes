const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  ping: (title, content) => ipcRenderer.invoke('ping', title, content),
});
