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
