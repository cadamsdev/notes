import type { Actions } from './$types';
import { createNote } from '$lib/server/db';

export const actions = {
	default: async () => {
    const result = createNote('A title', '');
    return {
      lastId: result,
    }
	},
} satisfies Actions;

