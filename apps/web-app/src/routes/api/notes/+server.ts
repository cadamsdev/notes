import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getNotes } from '$lib/server/db';

export const GET: RequestHandler = async () => {
	const notes = getNotes();
	return json(notes);
};
