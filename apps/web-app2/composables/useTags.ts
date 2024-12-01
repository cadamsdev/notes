
export interface Tag {
  id: number;
  name: string;
  color?: string;
  count?: number;
}

export const useTags = () => {
  const config = useRuntimeConfig();
  const tags = useState<Tag[]>('tags', () => []);
  const selectedTags = useState<Tag[]>('selectedTags', () => []);
  const filteredTags = useState<Tag[]>('filteredTags', () => []);

  const fetchTags = async (): Promise<Tag[]> => {
    const data = await $fetch<Tag[]>(`${config.public.apiUrl}/tags`);
    const tagsData = data;
    tags.value = tagsData;
    filteredTags.value = tagsData;
    return tagsData;
  };

  const deleteTag = async (id: number) => {
    await $fetch(
      `${config.public.apiUrl}/tags/${id}`,
      {
        method: 'DELETE',
      }
    );

    // remove from all tags
    tags.value = [...tags.value.filter((t) => t.id !== id)];

    // remove from filtered tags
    filteredTags.value = [...filteredTags.value.filter((t) => t.id !== id)];

    // remove from selected tags
    selectedTags.value = [...selectedTags.value.filter((t) => t.id !== id)];
  }

  const updateTag = async (tag: Tag) => {
    await $fetch(
      `${config.public.apiUrl}/tags/${tag.id}`,
      {
        method: 'PUT',
        body: tag,
      }
    );

    const tempTags = [...filteredTags.value];
    const tempTag = tempTags.find((t) => t.id === tag.id);
    if (tempTag) {
      tempTag.name = tag.name;
      tempTag.color = tag.color;
    }

    filteredTags.value = tempTags;
  }

  const selectTag = (tag: Tag) => {
    const index = selectedTags.value.findIndex((t) => t.id === tag.id);
    if (index === -1) {
      selectedTags.value = [...selectedTags.value, tag];
    }
  }

  const removeSelectedTag = (id: number) => {
    selectedTags.value = selectedTags.value.filter((t) => t.id !== id);
  }
  return {
    tags,
    selectedTags,
    filteredTags,
    selectTag,
    removeSelectedTag,
    deleteTag,
    updateTag,
    fetchTags,
  };
}
