import { browser } from '$app/environment';
import type { Tag } from '../../../interfaces/Tag.js';

export async function load({ params }) {
  const tags: Tag[] = [];

  if (browser) {
    // const tt = await window.electron.getTagsForNote(params.id);
    // tags = tt.map((tag) => ({ value: tag.id, label: tag.name }));
  }

  return {
    id: params.id,
    tags,
  }
}
