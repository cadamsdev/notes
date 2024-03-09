const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  createNote: (title, content) =>
    ipcRenderer.invoke('createNote', title, content),
});
