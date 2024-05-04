import { contextBridge, ipcRenderer } from 'electron';
import { Note } from './interfaces/note';
import { Tag } from './interfaces/tag';

contextBridge.exposeInMainWorld('electron', {
  createNote: (title: string, content: string) =>
    ipcRenderer.invoke('createNote', title, content),
  getNotes: () => ipcRenderer.invoke('getNotes'),
  updateNote: (note: Note) => ipcRenderer.invoke('updateNote', note),
  saveTags: (noteId: number, tags: Tag[]) => ipcRenderer.invoke('saveTags', noteId, tags),
  getAllTags: () => ipcRenderer.invoke('getAllTags'),
  getTagsForNote: (noteId: number) => ipcRenderer.invoke('getTagsForNote', noteId),
  deleteNote: (noteId: number) => ipcRenderer.invoke('deleteNote', noteId),
  deleteTag: (tagId: number) => ipcRenderer.invoke('deleteTag', tagId),
  editTag: (tag: Tag) => ipcRenderer.invoke('editTag', tag),
});
