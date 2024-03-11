const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  createNote: (title, content) =>
    ipcRenderer.invoke('createNote', title, content),
  getNotes: () => ipcRenderer.invoke('getNotes'),
  updateNote: (note) => ipcRenderer.invoke('updateNote', note),
});
