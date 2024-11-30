
export interface Tag {
  id: number;
  name: string;
  color?: string;
  count?: number;
}

export const useTags = () => {
  const config = useRuntimeConfig();
  const data = ref<Tag[]>([]);
  const error = ref<any>(null);
  const loading = ref(false);
  const selectedTags = useState<Tag[]>('selectedTags', () => []);
  const filteredTags = useState<Tag[]>('filteredTags', () => []);

  const fetchData = async () => {
    loading.value = true;
    try {
      const result = await fetch(`${config.public.apiUrl}/tags`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (result.ok) {
        const tags = (await result.json()) as Tag[];
        data.value = tags;
        filteredTags.value = tags;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const deleteTag = async (id: number) => {
    try {
      const result = await fetch(`${config.public.apiUrl}/tags/${id}`, {
        method: 'DELETE',
      });

      if (result.ok) {
        // remove from all tags
        data.value = [...data.value.filter((t) => t.id !== id)];

        // remove from filtered tags
        filteredTags.value = [...filteredTags.value.filter((t) => t.id !== id)];

        // remove from selected tags
        selectedTags.value = [...selectedTags.value.filter((t) => t.id !== id)];
      }
    } catch (err) {
      error.value = err;
    }
  }

  const updateTag = async (tag: Tag) => {
    try {
      const result = await fetch(`${config.public.apiUrl}/tags/${tag.id}`, {
        method: 'PUT',
        body: JSON.stringify(tag),
      });

      if (result.ok) {
        const tempTags = [...filteredTags.value];
        const tempTag = tempTags.find((t) => t.id === tag.id);
        if (tempTag) {
          tempTag.name = tag.name;
          tempTag.color = tag.color;
        }

        filteredTags.value = tempTags;
      }
    } catch (err) {
      error.value = err;
    }
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

  fetchData();
  return {
    data,
    error,
    loading,
    selectedTags,
    filteredTags,
    selectTag,
    removeSelectedTag,
    deleteTag,
    updateTag,
  };
}
