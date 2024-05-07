import { saveTags, updateNote } from "$lib/server/db";
import type { Actions } from "@sveltejs/kit";

export const actions = {
	updateNote: async ({ request }) => {
    const formData = await request.formData();
    const noteId = Number(formData.get("id"));
    const title = formData.get("title")?.toString() ?? '';
    const content = formData.get("content")?.toString() ?? '';

		const result = updateNote({ id: noteId, title, content });
		return {
			result
		};
	},
	saveTags: async ({ request }) => {
		const formData = await request.formData();
		const noteId = Number(formData.get("noteId"));
		const tags = JSON.parse(formData.get("tags")?.toString() ?? '[]');

		const result = saveTags(noteId, tags);
		return {
			result
		};
	},
} satisfies Actions;
