import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNotesForId } from '$lib/server/db';

export const GET: RequestHandler = async (params) => {
  const noteId = +params.params.id;
	const note = getNotesForId(noteId);
	return json(note);
};
