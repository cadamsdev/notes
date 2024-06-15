import { updateTagSort } from "$lib/server/db";
import type { Actions } from "@sveltejs/kit";

export const actions = {
	updateTagSort: async ({ request }) => {
		const formData = await request.formData();
		const tagSort = Number(formData.get('tagSort'));
		const result = updateTagSort(tagSort);
		return {
			result,
		};
	},
} satisfies Actions;
