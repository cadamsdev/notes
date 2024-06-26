import { getTagSort } from '$lib/server/db';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getAllTags } from '$lib/server/db';

export const GET: RequestHandler = async () => {
  const tagSort = getTagSort();
  const tags = getAllTags();
	return json({
    tagSort,
    tags,
  });
};
