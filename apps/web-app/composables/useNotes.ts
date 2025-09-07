import Fuse from 'fuse.js';

export interface Note {
  id: number;
  title: string;
  content?: string;
  tags?: Tag[];
  created_at?: string;
  updated_at?: string;
}
export interface Tag {
  id: number;
  name: string;
  color?: string;
  count?: number;
}

export const useNotes = () => {
  const config = useRuntimeConfig();
  const { settings } = useSettings();
  const notes = useState<Note[]>('notes', () => []);
  const selectedNote = useState<Note | null>('selectedNote', () => null);
  const router = useRouter();
  const tags = useState<Tag[]>('tags', () => []);
  const filteredTags = useState<Tag[]>('filteredTags', () => []);
  const selectedTags = useState<Tag[]>('selectedTags', () => []);
  const selectedDate = useState<Date | null>('selectedDate', () => null);
  // const filteredTags = useState<Tag[]>('filteredTags', () => []);

  const fetchNotes = async (): Promise<Note[]> => {
    const data = await $fetch<Note[]>(`${config.public.apiUrl}/notes`);
    const notesData = data;
    notes.value = notesData;
    return notesData;
  };

  const createNote = async (content?: string) => {
    const defaultContent = JSON.stringify({
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: content ? [{ type: 'text', text: content }] : []
        }
      ]
    });

    const note: Note = {
      id: -1,
      title: content ? content.split('\n')[0].substring(0, 50) || 'Quick Note' : 'Untitled',
      content: content ? defaultContent : defaultContent,
    };

    const id = await $fetch<number>(
      `${config.public.apiUrl}/notes`,
      {
        method: 'POST',
        body: note,
      }
    );

    await fetchNotes();

    // If content was provided, return the ID instead of navigating
    if (content) {
      return id;
    }

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

    await Promise.all([fetchNotes(), fetchTags()]);
  }

  // Helper function to extract plain text from TipTap JSON content
  const extractTextFromContent = (content: string): string => {
    try {
      const parsed = JSON.parse(content);

      const extractText = (node: any): string => {
        let text = '';

        if (node.type === 'text') {
          text += node.text || '';
        }

        if (node.content && Array.isArray(node.content)) {
          node.content.forEach((child: any) => {
            text += extractText(child);
          });
        }

        return text;
      };

      return extractText(parsed);
    } catch (e) {
      // If parsing fails, return the original content
      return content;
    }
  };

  const searchNotes = (searchText: string): Note[] => {
    let newFilteredNotes = notes.value;

    if (selectedTags.value.length) {
      newFilteredNotes = newFilteredNotes.filter((note) => {
        return selectedTags.value.every(
          (tag) => note.tags?.some((t) => t.id === tag.id) ?? false
        );
      });
    }

    // If no search text, return all filtered notes
    if (!searchText.trim()) {
      const noteTags = newFilteredNotes.flatMap((note) => note.tags ?? []);
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

      filteredTags.value = newFilteredTags.sort((a, b) => {
        if (settings.value.tagSort === 0) {
          const aCount = a.count ?? 0;
          const bCount = b.count ?? 0;

          return bCount - aCount;
        }
        return a.name.localeCompare(b.name);
      });

      return newFilteredNotes;
    }

    // Prepare notes with extracted text content for search
    const searchableNotes = newFilteredNotes.map(note => ({
      ...note,
      searchableContent: extractTextFromContent(note.content || '')
    }));

    // Search in both title and extracted content
    const fuse = new Fuse(searchableNotes, {
      keys: ['title', 'searchableContent'],
      threshold: 0.3,
    });

    let tempFilteredNotes = fuse
      .search(searchText.trim())
      .map((result) => result.item);

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

    filteredTags.value = newFilteredTags.sort((a, b) => {
      if (settings.value.tagSort === 0) {
        const aCount = a.count ?? 0;
        const bCount = b.count ?? 0;

        return bCount - aCount;
      }
      return a.name.localeCompare(b.name);
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
    filteredTags.value = [...tagsData];
    return tagsData;
  };

  const deleteTag = async (id: number) => {
    await $fetch(`${config.public.apiUrl}/tags/${id}`, {
      method: 'DELETE',
    });

    // remove from selected tags
    selectedTags.value = [...selectedTags.value.filter((t) => t.id !== id)];

    await Promise.all([fetchNotes(), fetchTags()]);
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
    filteredTags,
    selectedTags,
    selectedDate,
    selectTag,
    removeSelectedTag,
    deleteTag,
    updateTag,
    fetchTags,
    saveTags,
  };
};
