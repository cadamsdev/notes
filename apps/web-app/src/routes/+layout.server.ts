import { getNotes } from "$lib/server/db";
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async () => {
	return {
		notes: getNotes(),
	};
};
