import { get, writable } from "svelte/store";
import type { TagRecord } from "./interfaces/TagRecord";
import { browser } from "$app/environment";

export interface Note {
  id: number;
  title: string;
  content: string;
}

export const notes = writable<Note[]>([]);
export const selectedNote = writable<Note | undefined>();
export const tags = writable<TagRecord[]>([]);

export async function fetchAllTags(): Promise<void> {
  if (browser) {
    const result = await window.electron.getAllTags();
    tags.set(result);
  }
}

export async function removeNote(note: Note) {
  try {
    window.electron.deleteNote(note.id);
    const filteredNotes = get(notes).filter((n) => n.id !== note.id);
    notes.set(filteredNotes);
  } catch (err) {
    console.error(err);
  }
}
