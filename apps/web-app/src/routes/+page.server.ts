import type { Actions } from './$types';
import { createNote, getNotes } from '$lib/server/db';
import { redirect } from '@sveltejs/kit';

export async function load() {
	const notes = getNotes();
  if (notes.length) {
    redirect(307, `/note/${notes[0].id}`);
  }

  return {};
}

export const actions = {
	default: async ({ request }) => {
    const formData = await request.formData();
    const tagIds = formData.getAll('tags').map((tagId) => Number(tagId));
    const result = createNote('A title', '', tagIds);
    return {
      lastId: result,
    }
	},
} satisfies Actions;

