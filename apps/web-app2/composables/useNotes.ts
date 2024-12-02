import Fuse from 'fuse.js';

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
  const notes = useState<Note[]>('notes', () => []);
  const selectedNote = useState<Note | null>('selectedNote', () => null);
  const router = useRouter();
  const tags = useState<Tag[]>('tags', () => []);
  const selectedTags = useState<Tag[]>('selectedTags', () => []);
  // const filteredTags = useState<Tag[]>('filteredTags', () => []);

  const fetchNotes = async (): Promise<Note[]> => {
    const data = await $fetch<Note[]>(`${config.public.apiUrl}/notes`);
    const notesData = data;
    notes.value = notesData;
    return notesData; 
  };

  const createNote = async () => {
    const note: Note = {
      id: -1,
      title: 'A title',
      content: '',
    };

    const id = await $fetch<number>(
      `${config.public.apiUrl}/notes`,
      {
        method: 'POST',
        body: note,
      }
    );

    await fetchNotes();
    router.push(`/note/${id}`);
  }

  const deleteNote = async (noteId: number) => {
    await $fetch(
      `${config.public.apiUrl}/notes/${noteId}`,
      {
        method: 'DELETE',
      }
    );

    await fetchNotes();
  }

  const saveNote = async (note: Note) => {
    await $fetch(
      `${config.public.apiUrl}/notes/${note.id}`,
      {
        method: 'PUT',
        body: note,
      }
    );

    await fetchNotes();
  }

  const saveTags = async (noteId: number, tags: Tag[]) => {
    await $fetch(`${config.public.apiUrl}/notes/${noteId}/tags`, {
      method: 'POST',
      body: tags,
    });

    const note = notes.value.find((n) => n.id === noteId);
    if (note) {
      note.tags = tags;
    }
  }

  const searchNotes = (searchText: string): Note[] => {
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

    return tempFilteredNotes;
  };

  const fetchNote = async (noteId: number): Promise<Note> => {
    const note = await $fetch<Note>(
      `${config.public.apiUrl}/notes/${noteId}`,
      {
        method: 'GET',
      }
    );
    return note;
  }

  const fetchTags = async (): Promise<Tag[]> => {
    const data = await $fetch<Tag[]>(`${config.public.apiUrl}/tags`);
    const tagsData = data;
    tags.value = tagsData;
    return tagsData;
  };

  const deleteTag = async (id: number) => {
    await $fetch(`${config.public.apiUrl}/tags/${id}`, {
      method: 'DELETE',
    });

    // remove from selected tags
    selectedTags.value = [...selectedTags.value.filter((t) => t.id !== id)];

    await fetchTags();
  };

  const updateTag = async (tag: Tag) => {
    await $fetch(`${config.public.apiUrl}/tags/${tag.id}`, {
      method: 'PUT',
      body: tag,
    });

    await fetchNotes();
    await fetchTags();
  };

  const selectTag = (tag: Tag) => {
    const index = selectedTags.value.findIndex((t) => t.id === tag.id);
    if (index === -1) {
      selectedTags.value = [...selectedTags.value, tag];
    }
  };

  const removeSelectedTag = (id: number) => {
    selectedTags.value = selectedTags.value.filter((t) => t.id !== id);
  };

  return {
    notes,
    selectedNote,
    searchNotes,
    createNote,
    deleteNote,
    fetchNote,
    saveNote,
    fetchNotes,
    tags,
    selectedTags,
    selectTag,
    removeSelectedTag,
    deleteTag,
    updateTag,
    fetchTags,
    saveTags,
  };
};
