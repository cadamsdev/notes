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
	default: async () => {
    const result = createNote('A title', '');
    return {
      lastId: result,
    }
	},
} satisfies Actions;

