import Fuse from 'fuse.js';

export interface Note {
  id: number;
  title: string;
  content?: string;
  tags?: Tag[];
}

export const useNotes = () => {
  const { data: tags, filteredTags, selectedTags } = useTags();
  const config = useRuntimeConfig();
  const data = ref<Note[]>([]);
  const filteredData = ref<Note[]>([]);
  const error = ref<any>(null);
  const loading = ref(false);

  const fetchNotes = async () => {
    loading.value = true;
    try {
      const result = await fetch(`${config.public.apiUrl}/notes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (result.ok) {
        const notes = (await result.json()) as Note[];
        data.value = notes;
        filteredData.value = notes;
      }
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  const createNote = async () => {
    try {
      const note: Note = {
        id: -1,
        title: 'A title',
        content: '',
      };

      const result = await fetch(`${config.public.apiUrl}/notes`, {
        method: 'POST',
        body: JSON.stringify(note),
      });

      if (result.ok) {
        const id = await result.json();
        note.id = id;
        data.value  = [note, ...data.value];
        filteredData.value = [note, ...filteredData.value];
      }
    } catch (err) {
      error.value = err;
    }
  }

  const deleteNote = async (noteId: number) => {
    try {
      const result = await fetch(`${config.public.apiUrl}/notes/${noteId}`, {
        method: 'DELETE',
      });

      if (result.ok) {
        const filteredNotes = data.value.filter((n) => n.id !== noteId);
        data.value = filteredNotes;
        filteredData.value = filteredNotes;
      }
    } catch (err) {
      error.value = err;
    }
  }

  const searchNotes = (searchText: string) => {
    let newFilteredNotes = data.value;

    if (selectedTags.value.length) {
      newFilteredNotes = newFilteredNotes.filter((note) => {
        return selectedTags.value.every(
          (tag) => note.tags?.some((t) => t.id === tag.id) ?? false
        );
      });
    }

    const fuse = new Fuse(newFilteredNotes, {
      keys: ['title'],
    });

    let tempFilteredNotes = fuse
      .search(searchText)
      .map((result) => result.item);

    if (!tempFilteredNotes.length) {
      tempFilteredNotes = newFilteredNotes;
    }

    const noteTags = tempFilteredNotes.flatMap((note) => note.tags ?? []);
    const uniqueTags = Array.from(new Set(noteTags.map((tag) => tag.id)));
    const map = new Map<number, Tag>();
    const newFilteredTags = tags.value.filter((tag) =>
      uniqueTags.includes(tag.id)
    );
    newFilteredTags.forEach((tag) => {
      tag.count = 0;
      map.set(tag.id, tag);
    });

    // set the count of each tag
    noteTags.forEach((tag) => {
      if (map.has(tag.id)) {
        const t = map.get(tag.id);
        if (t && t.count !== undefined) {
          t.count += 1;
        }
      }
    });

    const newTags = [...map.values()];
    filteredData.value = tempFilteredNotes;
    filteredTags.value = newTags;
  };

  fetchNotes();
  return {
    data,
    filteredData,
    error,
    loading,
    searchNotes,
    createNote,
    deleteNote,
  };
};
