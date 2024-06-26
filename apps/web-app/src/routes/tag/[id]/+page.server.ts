import { deleteTag, updateTag } from "$lib/server/db";
import type { Actions } from "@sveltejs/kit";

export const actions = {
	updateTag: async ({ request }) => {
		const formData = await request.formData();
		const tagId = Number(formData.get('id'));
		const name = formData.get('name')?.toString() ?? '';
		const color = formData.get('color')?.toString() ?? '';
		const result = updateTag({ id: tagId, name, color });
		return {
			result
		};
	},
	deleteTag: async ({ request }) => {
		const formData = await request.formData();
    const tagId = Number(formData.get('id'));
    const result = deleteTag(tagId);
		return {
			result
		};
	}
} satisfies Actions;
