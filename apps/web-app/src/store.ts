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
export const currentModal = writable<string>();

export function openModal(modelId: string) {
  setTimeout(() => {
    currentModal.set(modelId);
  });
}

export function closeModal() {
  currentModal.set('');
}

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
      items.unshift(note);
      return items;
    });

    return note;
  }

  return null;
}

export async function deleteNote(note: Note, noteToSelect?: Note): Promise<void> {
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
      selectedNote.set(noteToSelect);
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
  if (tag.color) {
    formData.append('color', tag.color);
  }

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
        tempTag.color = tag.color;
      }

      tags.set(tempTags);

      // invalidate notes
      const notes = await fetchNotes();
      
      // update the selected note
      const sn = get(selectedNote);
      if (sn) {
          selectedNote.set(notes.find((n) => n.id === sn.id));
      }
    }
  } catch (err) {
    console.error(err);
  }
}
