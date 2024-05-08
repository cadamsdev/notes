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

export async function removeNote(note: Note): Promise<void> {
  try {
    const formData = new FormData();
    formData.append('id', note.id.toString());

    const response = await fetch(`/note/${note.id}?/deleteNote`, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      const filteredNotes = get(notes).filter((n) => n.id !== note.id);
      notes.set(filteredNotes);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function deleteTag(tagId: number): Promise<void> {
  const formData = new FormData();
  formData.append('id', tagId.toString());

  const response = await fetch(`/tag/${tagId}?/deleteTag`, {
    method: 'POST',
    body: formData,
  });

  if (response.ok) {
    const tempTags = [...get(tags)];
    const newTags = tempTags.filter((tag) => tag.id !== tagId);
    tags.set(newTags);
  }

}

export async function editTag(tag: TagRecord): Promise<void> {
  const formData = new FormData();
  formData.append('id', tag.id.toString());
  formData.append('name', tag.name);

  try {
    const response = await fetch(`/tag/${tag.id}?/updateTag`, {
			method: 'POST',
			body: formData
		});

    if (response.ok) {
      const tempTags = [...get(tags)];
      const tempTag = tempTags.find((t) => t.id === tag.id);
      if (tempTag) {
        tempTag.name = tag.name;
      }

      tags.set(tempTags);
    }
  } catch (err) {
    console.error(err);
  }
}
