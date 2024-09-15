import { get, writable } from "svelte/store";
import type { Tag } from "./interfaces/Tag";
import { TAG_SORT_COUNT, TAG_SORT_NAME } from "./constants/settings.constants";
import { PUBLIC_API_URL } from '$env/static/public';
import * as api from './lib/api';

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
		const result = await fetch(`${PUBLIC_API_URL}/notes`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
    
		const data = await result.json();
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

    selectedTags.set([]);
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
  } catch (err) {
    console.error(err);
  }
}

// export async function updateTagSort(tagSort: number): Promise<void> {
// 	const formData = new FormData();
// 	formData.append('tagSort', tagSort.toString());

// 	const response = await fetch(`/settings?/updateTagSort`, {
// 		method: 'POST',
// 		body: formData
// 	});

// 	if (!response.ok) {
//     return;
// 	}

//   sortTags(tagSort);
// }

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
  const searchTerms = searchTerm.toLowerCase().split(' ');
  const sTags = get(selectedTags);

  const newFilteredNoets = get(notes).filter((note) => {
    const titleTerms = note.title.toLowerCase().split(' ');
    return (
			searchTerms.every((term) => titleTerms.some((t) => t.includes(term))) &&
			sTags.every((tag) => note.tags?.some((t) => t.id === tag.id) ?? false)
		);
  });

  const noteTags = newFilteredNoets.flatMap((note) => note.tags ?? []);
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
  filteredNotes.set(newFilteredNoets);
}
