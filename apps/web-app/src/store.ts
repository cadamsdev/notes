import { get, writable } from "svelte/store";
import type { Tag } from "./interfaces/Tag";
import { TAG_SORT_COUNT, TAG_SORT_NAME } from "./constants/settings.constants";
import * as api from './lib/api';
import Fuse from 'fuse.js';

export interface Note {
  id: number;
  title: string;
  content?: string;
  tags?: Tag[];
}

export const notes = writable<Note[]>([]);
export const filteredNotes = writable<Note[]>([]);  
export const selectedNote = writable<Note | undefined>();
export const tags = writable<Tag[]>([]);
export const filteredTags = writable<Tag[]>([]);
export const currentModal = writable<string>();
export const selectedTags = writable<Tag[]>([]);

export function openModal(modelId: string) {
  currentModal.set(modelId);
}

export function closeModal() {
  currentModal.set('');
}

export async function fetchNotes(): Promise<Note[]> {
  const data = await api.fetchNotes();
  notes.set(data);
  return data;
}

export async function fetchTags(): Promise<void> {
	const tagsData = await api.fetchTags();
  const tagSort = await api.fetchTagSort();
	tags.set(tagsData);
	filteredTags.set(tagsData);
	sortTags(tagSort);
}

export async function createNote(): Promise<Note | null> {
  const newNote: Note = {
    id: -1,
    title: 'A title',
    content: '',
  }

  const response = await api.createNote(newNote);

  if (response.ok) {
    const id = await response.json();
    console.log(id);
    newNote.id = id;

    notes.update((items) => {
      items.unshift(newNote);
      return items;
    });

    selectedTags.set([]);
    return newNote;
  }

  return null;
}

export async function deleteNote(noteId: number, noteToSelect?: Note): Promise<void> {
  try {
    const response = await api.deleteNote(noteId);

    if (response.ok) {
      const filteredNotes = get(notes).filter((n) => n.id !== noteId);
      notes.set(filteredNotes);
      selectedNote.set(noteToSelect);
    }
  } catch (err) {
    console.error(err);
  }
}

export async function deleteTag(tagId: number): Promise<void> {
  const response = await api.deleteTag(tagId);
  if (response.ok) {
    const tempTags = [...get(filteredTags)];
    const newTags = tempTags.filter((tag) => tag.id !== tagId);
    filteredTags.set(newTags);

    // remove from all tags
    const allTags = get(tags);
    const newAllTags = allTags.filter((tag) => tag.id !== tagId);
    tags.set(newAllTags);

    // delete from selectedTags
    const sTags = get(selectedTags);
    const newSelectedTags = sTags.filter((tag) => tag.id !== tagId);
    selectedTags.set(newSelectedTags);

    // remove tag from selected note
    const sn = get(selectedNote);
    if (sn) {
      const newNoteTags = sn.tags?.filter((tag) => tag.id !== tagId);
      sn.tags = newNoteTags;
      selectedNote.set(sn);
    }

    // remove tag from notes
    const notes = get(filteredNotes);
    notes.forEach((note) => {
      if (note.tags) {
        const newNoteTags = note.tags.filter((tag) => tag.id !== tagId);
        note.tags = newNoteTags;
      }
    });
  }

}

export async function updateTag(tag: Tag): Promise<void> {
    const response = await api.updateTag(tag);
    if (response?.ok) {
			const tempTags = [...get(filteredTags)];
			const tempTag = tempTags.find((t) => t.id === tag.id);
			if (tempTag) {
				tempTag.name = tag.name;
				tempTag.color = tag.color;
			}

			filteredTags.set(tempTags);

			// invalidate notes
			const notes = await fetchNotes();

			// update the selected note
			const sn = get(selectedNote);
			if (sn) {
				selectedNote.set(notes.find((n) => n.id === sn.id));
			}
    }
}

export async function updateTagSort(tagSort: number): Promise<void> {
  const response = await api.updateTagSort({ value: tagSort });
	if (!response.ok) {
    console.error('failed to update tag sort');
    return;
	}

  sortTags(tagSort);
}

export function sortTags(tagSort: number): void {
	if (tagSort === TAG_SORT_COUNT) {
		filteredTags.update((tags) => {
			return tags.sort((a, b) => {
				const aCount = a.count ?? 0;
				const bCount = b.count ?? 0;

				const result = bCount - aCount;
				if (result === 0) {
					return a.name.localeCompare(b.name);
				}

				return result;
			});
		});
	} else if (tagSort === TAG_SORT_NAME) {
		filteredTags.update((tags) => {
			return tags.sort((a, b) => a.name.localeCompare(b.name));
		});
	}
}

export function searchNotes(searchTerm: string): void {
  const sTags = get(selectedTags);

  let newFilteredNotes = get(notes);

  if (sTags.length) {
    newFilteredNotes = newFilteredNotes.filter((note) => {
			return sTags.every((tag) => note.tags?.some((t) => t.id === tag.id) ?? false);
		});
  }

  const fuse = new Fuse(newFilteredNotes, {
		keys: ['title']
	});

  let tempFilteredNotes = fuse.search(searchTerm).map((result) => result.item);

  if (!tempFilteredNotes.length) {
		tempFilteredNotes = newFilteredNotes;
	}

  const noteTags = tempFilteredNotes.flatMap((note) => note.tags ?? []);
  const uniqueTags = Array.from(new Set(noteTags.map((tag) => tag.id)));

  const map = new Map<number, Tag>();
  const newFilteredTags = get(tags).filter((tag) => uniqueTags.includes(tag.id));
  newFilteredTags.forEach((tag) => {
    tag.count = 0;
    map.set(tag.id, tag);
  });


  // set the count of each tag
  noteTags.forEach((tag) => {
    if (map.has(tag.id)) {
      const t = map.get(tag.id);
      if (t && t.count !== undefined) {
        t.count += 1;
      }
    }
  });


  const newTags = [...map.values()];
  filteredTags.set(newTags);
  filteredNotes.set(tempFilteredNotes);
}
