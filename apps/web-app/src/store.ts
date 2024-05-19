import { get, writable } from "svelte/store";
import { browser } from "$app/environment";
import type { Tag } from "./interfaces/Tag";

export interface Note {
  id: number;
  title: string;
  content: string;
  tags?: Tag[];
}

export const notes = writable<Note[]>([]);
export const selectedNote = writable<Note | undefined>();
export const tags = writable<Tag[]>([]);

export async function fetchNotes(): Promise<Note[]> {
  if (browser) {
    const result = await fetch('/api/notes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await result.json();
    notes.set(data);
    return data;
  }

  return [];
}

export async function fetchTags(): Promise<void> {
  if (browser) {
    const result = await fetch ('/api/tags', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });
    const data = await result.json();
    tags.set(data);
  }
}

export async function createNote(): Promise<Note | null> {
  const formData = new FormData();
  formData.append('title', 'A title');
  formData.append('content', '');

  const response = await fetch('/', {
    method: 'POST',
    body: formData
  });

  if (response.ok) {
    const obj = await response.json();
    // TODO fix
    const data = JSON.parse(obj.data);
    const note: Note = { id: Number(data[1]), title: 'A title', content: '' };
    notes.update((items) => {
      items.push(note);
      return items;
    });

    return note;
  }

  return null;
}

export async function deleteNote(note: Note): Promise<void> {
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

export async function updateTag(tag: Tag): Promise<void> {
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
