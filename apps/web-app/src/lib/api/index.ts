import { env } from '$env/dynamic/public';
import type { Tag } from '../../interfaces/Tag';
import type { Note } from '../../store';

export async function fetchNotes(): Promise<Note[]> {
	const result = await fetch(`${env.PUBLIC_API_URL}/notes`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (result.ok) {
		const notes = (await result.json()) as Note[];
		return notes;
	}

	return [];
}

export async function fetchNote(id: string): Promise<Note | null> {
	const result = await fetch(`${env.PUBLIC_API_URL}/notes/${id}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (result.ok) {
		const note = (await result.json()) as Note;
		return note;
	}

	return null;
}

export async function createNote(note: Note): Promise<Response> {
	const response = await fetch(`${env.PUBLIC_API_URL}/notes`, {
		method: 'POST',
		body: JSON.stringify(note)
	});
	return response;
}

export async function updateNote(note: Note): Promise<Response> {
	const response = await fetch(`${env.PUBLIC_API_URL}/notes/${note.id}`, {
		method: 'PUT',
		body: JSON.stringify(note)
	});
	return response;
}

export async function deleteNote(noteId: number): Promise<Response> {
	const response = await fetch(`${env.PUBLIC_API_URL}/notes/${noteId}`, {
		method: 'DELETE'
	});
	return response;
}

export async function fetchTags(): Promise<Tag[]> {
	const result = await fetch(`${env.PUBLIC_API_URL}/tags`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (result.ok) {
		const tags = (await result.json()) as Tag[];
		return tags;
	}

	return [];
}

export async function updateTag(tag: Tag): Promise<Response> {
	const response = await fetch(`${env.PUBLIC_API_URL}/tags/${tag.id}`, {
		method: 'PUT',
		body: JSON.stringify(tag)
	});
	return response;
}

export async function deleteTag(tagId: number): Promise<Response> {
	const response = await fetch(`${env.PUBLIC_API_URL}/tags/${tagId}`, {
		method: 'DELETE'
	});
	return response;
}

export async function fetchTagSort(): Promise<number> {
	const result = await fetch(`${env.PUBLIC_API_URL}/tag-sort`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (result.ok) {
		const data = (await result.json()) as { tagSort: number };
		return data.tagSort;
	}

	return 0;
}

export interface UpdateTagSortConfig {
	value: number;
}

export async function updateTagSort(config: UpdateTagSortConfig): Promise<Response> {
	const response = await fetch(`${env.PUBLIC_API_URL}/settings/tag_sort`, {
		method: 'PUT',
		body: JSON.stringify(config)
	});
	return response;
}

export async function saveTags(noteId: number, tags: Tag[]): Promise<Response> {
	const response = await fetch(`${env.PUBLIC_API_URL}/notes/${noteId}/tags`, {
		method: 'POST',
		body: JSON.stringify(tags)
	});
	return response;
}

export async function exportData(): Promise<Response> {
	const response = await fetch(`${env.PUBLIC_API_URL}/export/data`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/zip'
		}
	});

	if (response.ok) {
		const blob = await response.blob();
		const url = window.URL.createObjectURL(blob);
		const a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.download = 'exported_data.zip';
		document.body.appendChild(a);
		a.click();
		window.URL.revokeObjectURL(url);
	} else {
		throw new Error('Failed to export data');
	}

	return response;
}
