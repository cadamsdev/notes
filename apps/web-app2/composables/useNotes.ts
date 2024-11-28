/*
export async function fetchNotes(): Promise<Note[]> {
	const result = await fetch(`${env.PUBLIC_API_URL}/notes`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		}
	});

	if (result.ok) {
		const notes = (await result.json()) as Note[];
		return notes;
	}

	return [];
}
*/

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
  console.log(`apiUrl: ${config.public.apiUrl}`);
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
        console.log(notes);
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
