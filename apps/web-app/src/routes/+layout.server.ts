import { getNotes, getTagSort } from "$lib/server/db";
import type { Note } from "../store";
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ params }) => {
	const notes = getNotes();
	const tagSort = getTagSort();
	let selectedNote: Note | undefined = undefined;
	if (params.id && notes.length) {
		const id = +params.id;
		selectedNote = notes.find((note) => note.id === id) || notes[0];
	}
	return {
		notes,
		selectedNote,
		tagSort,
	};
};
