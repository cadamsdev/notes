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
    console.log('calling fetchAllTags')
    const result = await fetch ('/api/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await result.json();
    console.log('tags', data)
    tags.set(data);
  }
}

export async function removeNote(note: Note) {
  try {
    // window.electron.deleteNote(note.id);
    // const filteredNotes = get(notes).filter((n) => n.id !== note.id);
    // notes.set(filteredNotes);
  } catch (err) {
    console.error(err);
  }
}

export function deleteTag(tagId: number): void {
  // window.electron.deleteTag(tagId);
  const tempTags = [...get(tags)];
  const newTags = tempTags.filter((tag) => tag.id !== tagId);
  tags.set(newTags);
}

export function editTag(tag: TagRecord): void {
	// window.electron.editTag(tag);
	const tempTags = [...get(tags)];
  const tempTag = tempTags.find((t) => t.id === tag.id);
  if (tempTag) {
    tempTag.name = tag.name;
  }

	tags.set(tempTags);
}
