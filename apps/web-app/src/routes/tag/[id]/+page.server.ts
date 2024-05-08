import { updateTag } from "$lib/server/db";
import type { Actions } from "@sveltejs/kit";

export const actions = {
	updateTag: async ({ request }) => {
		const formData = await request.formData();
    const tagId = Number(formData.get('id'));
    const name = formData.get('name')?.toString() ?? '';
		const result = updateTag({ id: tagId, name });
		return {
			result
		};
	},
} satisfies Actions;
