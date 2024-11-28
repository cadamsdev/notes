
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
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  fetchData();
  return {
    data,
    error,
    loading,
  };
}
