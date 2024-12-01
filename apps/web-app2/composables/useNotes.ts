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
  const data = useState<Note[]>('notes', () => []);
  const filteredData = useState<Note[]>('filteredData', () => []);
  const selectedNote = ref<Note | null>(null);

  const fetchNotes = async (): Promise<Note[]> => {
    const { data: notes, error } = await useFetch<Note[]>(`${config.public.apiUrl}/notes`);

    if (error.value) {
      console.error(error.value);
      return [];
    }

    data.value = notes.value || [];
    filteredData.value = notes.value || [];
    return notes.value || []; 
  };

  const createNote = async () => {
    const note: Note = {
      id: -1,
      title: 'A title',
      content: '',
    };

    const { data: id, error } = await useFetch<number>(
      `${config.public.apiUrl}/notes`,
      {
        method: 'POST',
        body: JSON.stringify(note),
      }
    );

    if (error.value) {
      console.error(error.value);
      return -1;
    }

    note.id = id.value || -1;
    data.value = [note, ...data.value];
    filteredData.value = [note, ...filteredData.value];
  }

  const deleteNote = async (noteId: number) => {
    const { error } = await useFetch(
      `${config.public.apiUrl}/notes/${noteId}`,
      {
        method: 'DELETE',
      }
    );

    if (error.value) {
      console.error(error.value);
      return;
    }

    const filteredNotes = data.value.filter((n) => n.id !== noteId);
    data.value = filteredNotes;
    filteredData.value = filteredNotes;
  }

  const saveNote = async (note: Note) => {
    const { error } = await useFetch(
      `${config.public.apiUrl}/notes/${note.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(note),
      }
    );

    if (error.value) {
      console.error(error.value);
      return;
    }

    const index = data.value.findIndex((n) => n.id === note.id);
    const temp = [...data.value];
    temp[index] = note;
    data.value = temp;
    filteredData.value = [...data.value];
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

  const fetchNote = async (noteId: number): Promise<Note | undefined> => {
    const { data: note, error } = await useFetch<Note>(
      `${config.public.apiUrl}/notes/${noteId}`,
      {
        method: 'GET',
      }
    );

    if (error.value) {
      throw error.value;
    }

    if (note.value) {
      return note.value;
    }

    return undefined;
  }
  return {
    data,
    filteredData,
    selectedNote,
    searchNotes,
    createNote,
    deleteNote,
    fetchNote,
    saveNote,
    fetchNotes,
  };
};
