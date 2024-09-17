import { fetchNote } from "$lib/api";
import type { PageLoad } from "./$types";

export const load: PageLoad = async ({ params }) => {
	const id = params.id;
  const note = await fetchNote(id);
	return {
    id,
    note,
  };
};
