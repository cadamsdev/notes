import { PUBLIC_API_URL } from "$env/static/public";
import type { Tag } from "../../interfaces/Tag";
import type { Note } from "../../store";

export async function fetchNotes(): Promise<Note[]> {
  const result = await fetch(`${PUBLIC_API_URL}/notes`, {
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
  const result = await fetch(`${PUBLIC_API_URL}/notes/${id}`, {
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
  const response = await fetch(`${PUBLIC_API_URL}/notes`, {
    method: 'POST',
    body: JSON.stringify(note)
  });

  return response;
}

export async function fetchTags(): Promise<Tag[]> {
    const result = await fetch(`${PUBLIC_API_URL}/tags`, {
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

export async function updateTag(tag: Tag): Promise<Response | null> {
	try {
		const response = await fetch(`${PUBLIC_API_URL}/tags/${tag.id}`, {
			method: 'PUT',
			body: JSON.stringify(tag)
		});
    console.log(response.statusText)
    return response;
	} catch (err) {
		console.error(err);
	}

  return null;
}

export async function fetchTagSort(): Promise<number> {
    const result = await fetch(`${PUBLIC_API_URL}/tag-sort`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

    if (result.ok) {
		  const data = await result.json() as { tagSort: number };
      return data.tagSort;
    }

    return 0;
}
