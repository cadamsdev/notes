import Fuse from 'fuse.js';

export interface Note {
  id: number;
  title: string;
  content?: string;
  tags?: Tag[];
}

export const useNotes = () => {
  const { tags, filteredTags, selectedTags } = useTags();
  const config = useRuntimeConfig();
  const notes = useState<Note[]>('notes', () => []);
  const filteredData = useState<Note[]>('filteredData', () => []);
  const selectedNote = ref<Note | null>(null);

  const fetchNotes = async (): Promise<Note[]> => {
    const { data, error } = await useFetch<Note[]>(`${config.public.apiUrl}/notes`);

    if (error.value) {
      console.error(error.value);
      return [];
    }

    const notesData = data.value || [];
    notes.value = notesData;
    filteredData.value = notesData;
    return notesData; 
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
    notes.value = [note, ...notes.value];
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

    const filteredNotes = notes.value.filter((n) => n.id !== noteId);
    notes.value = filteredNotes;
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

    const index = notes.value.findIndex((n) => n.id === note.id);
    const temp = [...notes.value];
    temp[index] = note;
    notes.value = temp;
    filteredData.value = [...notes.value];
  }

  const searchNotes = (searchText: string) => {
    let newFilteredNotes = notes.value;

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
    notes,
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
