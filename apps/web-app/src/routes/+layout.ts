import { fetchNotes } from '../store.js';
import * as api from '../lib/api';
// import { redirect } from '@sveltejs/kit';

export const load = async ({ fetch }) => {
	const notes = await fetchNotes();

  // if (notes.length) {
	// 	redirect(307, `/note/${notes[0].id}`);
	// }

	const tagSort = await api.fetchTagSort();

		// let selectedNote: Note | undefined = undefined;
		// if (params.id && notes.length) {
		// 	const id = +params.id;
		// 	selectedNote = notes.find((note) => note.id === id) || notes[0];
		// }

	return {
		notes,
		tagSort,
		selectedNote: null,
	};
};