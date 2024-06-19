import { deleteNote, getNoteForId, getTagsForNote, saveTags, updateNote } from "$lib/server/db";
import type { Actions } from "@sveltejs/kit";

export async function load({ params }) {
	const noteId = +params.id;
	const note = getNoteForId(noteId);
	const tags = getTagsForNote(noteId)
	.map((tag) => ({ id: tag.id, name: tag.name, color: tag.color }));

	return {
		id: params.id,
		note,
		tags
	};
}

export const actions = {
	updateNote: async ({ request }) => {
		const formData = await request.formData();
		const noteId = Number(formData.get('id'));
		const title = formData.get('title')?.toString() ?? '';
		const content = formData.get('content')?.toString() ?? '';

		const result = updateNote({ id: noteId, title, content });
		return {
			result
		};
	},
	saveTags: async ({ request }) => {
		const formData = await request.formData();
		const noteId = Number(formData.get('noteId'));
		const tags = JSON.parse(formData.get('tags')?.toString() ?? '[]');

		const result = saveTags(noteId, tags);
		return {
			result
		};
	},
	deleteNote: async ({ request }) => {
		const formData = await request.formData();
		const noteId = Number(formData.get('id'));
		const result = deleteNote(noteId);
		return {
			result
		};
	}
} satisfies Actions;
