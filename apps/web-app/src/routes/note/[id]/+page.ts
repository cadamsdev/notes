import { fetchNote } from "$lib/api";
import type { PageLoad } from "./$types";
import * as notesStore from '$lib/stores/notes';

export const load: PageLoad = async ({ params }) => {
	const id = params.id;
  const note = await fetchNote(id);
  notesStore.selectedNote.set(note);
	return {

  };
};
