
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
    const { data, error } = await useFetch<Tag[]>(`${config.public.apiUrl}/tags`);

    if (error.value) {
      console.error(error.value);
      return [];
    }

    const tagsData = data.value || [];
    tags.value = tagsData;
    filteredTags.value = tagsData;
    return tagsData;
  };

  const deleteTag = async (id: number) => {
  const { error } = await useFetch(
    `${config.public.apiUrl}/tags/${id}`,
    {
      method: 'DELETE',
    }
  );

  if (error.value) {
    console.error(error.value);
    return;
  }

    // remove from all tags
    tags.value = [...tags.value.filter((t) => t.id !== id)];

    // remove from filtered tags
    filteredTags.value = [...filteredTags.value.filter((t) => t.id !== id)];

    // remove from selected tags
    selectedTags.value = [...selectedTags.value.filter((t) => t.id !== id)];
  }

  const updateTag = async (tag: Tag) => {
    const { error } = await useFetch(
      `${config.public.apiUrl}/tags/${tag.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(tag),
      }
    );

    if (error.value) {
      console.error(error.value);
      return;
    }

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
      console.log('selectedTags');
      console.log(selectedTags.value);
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
