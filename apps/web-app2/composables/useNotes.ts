export interface Note {
  id: number;
  title: string;
  content?: string;
  tags?: Tag[];
}

export interface Tag {
  id: number;
  name: string;
  color?: string;
  count?: number;
}

export const useNotes = () => {
  const config = useRuntimeConfig();
  const data = ref<Note[]>([]);
  const error = ref<any>(null);
  const loading = ref(false);

  const fetchNotes = async () => {
    loading.value = true;
    try {
      const result = await fetch(`${config.public.apiUrl}/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (result.ok) {
        const notes = (await result.json()) as Note[];
        data.value = notes;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  fetchNotes();
  return {
    data,
    error,
    loading,
  };
}
