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
  const filteredData = useState<Note[]>('filteredData', () => []);
  const selectedNote = useState<Note | null>('selectedNote', () => null);
  const router = useRouter();
  const tags = useState<Tag[]>('tags', () => []);
  const selectedTags = useState<Tag[]>('selectedTags', () => []);
  const filteredTags = useState<Tag[]>('filteredTags', () => []);

  const fetchNotes = async (): Promise<Note[]> => {
    const data = await $fetch<Note[]>(`${config.public.apiUrl}/notes`);
    const notesData = data;
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

    const id = await $fetch<number>(
      `${config.public.apiUrl}/notes`,
      {
        method: 'POST',
        body: note,
      }
    );

    note.id = id;
    notes.value = [note, ...notes.value];
    filteredData.value = [note, ...filteredData.value];
    router.push(`/note/${id}`);
  }

  const deleteNote = async (noteId: number) => {
    await $fetch(
      `${config.public.apiUrl}/notes/${noteId}`,
      {
        method: 'DELETE',
      }
    );

    const filteredNotes = notes.value.filter((n) => n.id !== noteId);
    notes.value = filteredNotes;
    filteredData.value = filteredNotes;
  }

  const saveNote = async (note: Note) => {
    await $fetch(
      `${config.public.apiUrl}/notes/${note.id}`,
      {
        method: 'PUT',
        body: note,
      }
    );

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
    filteredTags.value = tagsData;
    return tagsData;
  };

  const deleteTag = async (id: number) => {
    await $fetch(`${config.public.apiUrl}/tags/${id}`, {
      method: 'DELETE',
    });

    // remove from all tags
    tags.value = [...tags.value.filter((t) => t.id !== id)];

    // remove from filtered tags
    filteredTags.value = [...filteredTags.value.filter((t) => t.id !== id)];

    // remove from selected tags
    selectedTags.value = [...selectedTags.value.filter((t) => t.id !== id)];
  };

  const updateTag = async (tag: Tag) => {
    await $fetch(`${config.public.apiUrl}/tags/${tag.id}`, {
      method: 'PUT',
      body: tag,
    });

    const tempTags = [...filteredTags.value];
    const tempTag = tempTags.find((t) => t.id === tag.id);
    if (tempTag) {
      tempTag.name = tag.name;
      tempTag.color = tag.color;
    }

    filteredTags.value = tempTags;
    await fetchNotes();
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
    filteredData,
    selectedNote,
    searchNotes,
    createNote,
    deleteNote,
    fetchNote,
    saveNote,
    fetchNotes,
    tags,
    selectedTags,
    filteredTags,
    selectTag,
    removeSelectedTag,
    deleteTag,
    updateTag,
    fetchTags,
  };
};
