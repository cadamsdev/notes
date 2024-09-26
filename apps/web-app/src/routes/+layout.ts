import { fetchNotes } from '../store.js';
import * as api from '../lib/api';
import { redirect } from '@sveltejs/kit';
import * as notesStore from '../lib/stores/notes';

export const ssr = false;

export const load = async ({ url }) => {
	const notesData = await fetchNotes();
	const tagSort = await api.fetchTagSort();

	if (url.pathname === '/' && notesData.length > 0) {
		const selectedNote = notesData[0];
		notesStore.selectedNote.set(selectedNote);
		throw redirect(307, `/note/${selectedNote.id}`);
	}

	notesStore.notes.set(notesData);	
	return {
		notes: notesData,
		tagSort,
		selectedNote: null,
	};
};
