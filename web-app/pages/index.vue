<template>
  <div class="min-h-screen bg-bg">
    <div class="max-w-4xl mx-auto p-6">
      <!-- Note Composer -->
      <NoteComposer 
        @save="handleCreateNote"
        placeholder="Any thoughts..."
        class="mb-8"
      />

      <!-- Search and Filter Bar -->
      <div class="flex items-center justify-between mb-6">
        <div class="flex items-center gap-4">
          <h1 class="text-xl font-semibold text-text-primary-emphasis">Notes</h1>
          <span class="text-sm text-text-muted">{{ notes.length }} notes</span>
        </div>
        <SearchInput 
          @search="handleSearch" 
          placeholder="Search notes..." 
          class="w-64" 
          :show-results-count="false"
        />
      </div>

      <!-- Notes Feed -->
      <div class="space-y-4">
        <!-- Filter Info -->
        <div v-if="selectedTags.length > 0 || selectedDate" class="flex items-center gap-2 text-sm text-text-muted">
          <Icon name="fluent:filter-20-filled" size="16" />
          <span>Filtered by:</span>
          <div class="flex items-center gap-1">
            <Chip 
              v-for="tag in selectedTags" 
              :key="tag.id" 
              :text="tag.name" 
              :color="tag.color" 
              hasCloseBtn 
              @close="removeSelectedTag(tag.id)" 
            />
            <span v-if="selectedDate" class="px-2 py-1 bg-bg-secondary rounded text-xs">
              {{ formatDate(selectedDate) }}
              <button @click="selectedDate = null" class="ml-1 hover:text-text-primary">×</button>
            </span>
          </div>
        </div>

        <!-- Empty state -->
        <div v-if="filteredNotes.length === 0" class="text-center py-16">
          <div class="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="fluent:note-20-regular" size="32" class="text-text-muted" />
          </div>
          <h3 class="text-lg font-medium text-text-primary mb-2">
            {{ searchText || selectedTags.length > 0 || selectedDate ? 'No notes found' : 'No notes yet' }}
          </h3>
          <p class="text-text-muted">
            {{ searchText || selectedTags.length > 0 || selectedDate ? 'Try adjusting your filters' : 'Start writing your first note above' }}
          </p>
        </div>
        
        <!-- Notes List -->
        <div v-else class="space-y-3">
          <NoteCard
            v-for="note in filteredNotes"
            :key="note.id"
            :note="note"
            :isGridView="false"
            @delete="handleDeleteNote"
            @edit-tags="handleEditNoteTags"
            @edit="handleEditNote"
            @save="handleSaveNote"
            @save-tags="handleSaveNoteTags"
            class="hover:bg-card-hover transition-colors rounded-lg border border-card-border"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note, Tag } from '~/composables/useNotes';

useHead({
  title: 'Notes - Home',
  meta: [
    {
      name: 'description',
      content: 'Modern note-taking app'
    }
  ]
});

const { 
  createNote, 
  searchNotes, 
  selectTag, 
  removeSelectedTag,
  selectedTags,
  selectedDate,
  deleteNote,
  saveNote,
  saveTags,
  tags,
  notes,
  fetchNotes
} = useNotes();

const config = useRuntimeConfig();
const router = useRouter();

// View and filters
const searchText = ref('');
const filteredNotes = ref<Note[]>([]);

// Computed properties
const availableTags = computed(() => {
  return tags.value.filter(tag => tag.count && tag.count > 0);
});

// Initialize component - removed TipTap editor as it's now in NoteComposer component

// Watch for changes to update filtered notes
watch([searchText, selectedTags, selectedDate, notes], () => {
  let filtered = searchNotes(searchText.value);
  
  // Filter by selected date
  if (selectedDate.value) {
    filtered = filtered.filter(note => 
      note.created_at && isSameDay(new Date(note.created_at), selectedDate.value!)
    );
  }
  
  filteredNotes.value = filtered;
}, { immediate: true });

// Helper functions
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric' 
  });
};

// Methods
const handleCreateNote = async (content: string, tags: Tag[]) => {
  const contentObj = JSON.parse(content);
  const firstParagraph = contentObj.content?.[0]?.content?.[0]?.text || '';
  
  // Create note with the TipTap content
  const note: Note = {
    id: -1,
    title: firstParagraph.substring(0, 50) || 'Quick Note',
    content: content,
  };

  const noteId = await $fetch<number>(
    `${config.public.apiUrl}/notes`,
    {
      method: 'POST',
      body: note,
    }
  );
  
  // Add tags if any
  if (tags.length > 0 && noteId) {
    await saveTags(noteId, tags);
  }
  
  // Refresh notes
  await fetchNotes();
  filteredNotes.value = searchNotes(searchText.value);
};

const handleSearch = (event: { text: string }) => {
  searchText.value = event.text;
};

const toggleTagFilter = (tag: Tag) => {
  if (isTagSelected(tag.id)) {
    removeSelectedTag(tag.id);
  } else {
    selectTag(tag);
  }
};

const isTagSelected = (tagId: number) => {
  return selectedTags.value.some(tag => tag.id === tagId);
};

const selectNote = (note: Note) => {
  router.push(`/note/${note.id}`);
};

const handleDeleteNote = async (note: Note) => {
  await deleteNote(note.id);
  filteredNotes.value = searchNotes(searchText.value);
};

const handleEditNote = (note: Note) => {
  router.push(`/note/${note.id}`);
};

const handleSaveNote = async (note: Note) => {
  await saveNote(note);
  filteredNotes.value = searchNotes(searchText.value);
};

const handleSaveNoteTags = async (note: Note, tags: Tag[]) => {
  await saveTags(note.id, tags);
  filteredNotes.value = searchNotes(searchText.value);
};

const handleEditNoteTags = (note: Note) => {
  router.push(`/note/${note.id}?edit-tags=true`);
};
</script>
