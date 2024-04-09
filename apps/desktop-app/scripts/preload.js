const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  createNote: (title, content) =>
    ipcRenderer.invoke('createNote', title, content),
  getNotes: () => ipcRenderer.invoke('getNotes'),
  updateNote: (note) => ipcRenderer.invoke('updateNote', note),
  saveTags: (noteId, tags) => ipcRenderer.invoke('saveTags', noteId, tags),
  getAllTags: () => ipcRenderer.invoke('getAllTags'),
  getTagsForNote: (noteId) => ipcRenderer.invoke('getTagsForNote', noteId),
  deleteNote: (noteId) => ipcRenderer.invoke('deleteNote', noteId),
  deleteTag: (tagId) => ipcRenderer.invoke('deleteTag', tagId),
});
