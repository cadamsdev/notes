
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
  };
}
