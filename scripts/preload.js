const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  createNote: (title, content) =>
    ipcRenderer.invoke('createNote', title, content),
  getNotes: () => ipcRenderer.invoke('getNotes'),
  updateNote: (id, content) => ipcRenderer.invoke('updateNote', id, content),
});
