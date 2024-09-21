import { fetchNotes } from '../store.js';
import * as api from '../lib/api';
import { redirect } from '@sveltejs/kit';

export const ssr = false;

export const load = async ({ url }) => {
	const notes = await fetchNotes();
	const tagSort = await api.fetchTagSort();

	if (url.pathname === '/' && notes.length > 0) {
		throw redirect(307, `/note/${notes[0].id}`);
	}

	return {
		notes,
		tagSort,
		selectedNote: null,
	};
};
