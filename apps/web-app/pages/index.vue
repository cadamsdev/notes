<template>
  <div class="max-w-4xl mx-auto border-x border-bg-border min-h-screen">
    <!-- Header -->
    <div class="sticky top-0 bg-bg/80 backdrop-blur-md border-b border-bg-border p-6 z-10">
      <div class="flex items-center justify-between">
        <h1 class="text-xl font-bold text-text-primary-emphasis">Notes</h1>
        <button @click="toggleView" class="p-2 hover:bg-bg-hover rounded-full">
          <Icon :name="isGridView ? 'fluent:list-20-filled' : 'fluent:grid-20-filled'" size="20" />
        </button>
      </div>
    </div>

    <!-- Quick Note Composer -->
    <div class="border-b border-bg-border p-6">
      <div class="flex gap-3">
        <div class="w-10 h-10 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="fluent:note-20-filled" size="20" class="text-white" />
        </div>
        <div class="flex-1">
          <textarea
            v-model="quickNoteContent"
            @keydown="handleKeydown"
            placeholder="What's on your mind?"
            class="w-full bg-transparent text-text-primary-emphasis placeholder-text-secondary text-lg resize-none border-none outline-none"
            rows="3"
          ></textarea>
          
          <!-- Tags for quick note -->
          <div v-if="quickNoteTags.length > 0" class="flex flex-wrap gap-1 mt-2">
            <Chip 
              v-for="tag in quickNoteTags" 
              :key="tag.id" 
              :text="tag.name" 
              :color="tag.color" 
              hasCloseBtn 
              @close="removeQuickNoteTag(tag.id)" 
            />
          </div>
          
          <!-- Quick actions -->
          <div class="flex items-center justify-between mt-3">
            <div class="flex items-center gap-2">
              <button 
                @click="showTagSelector = !showTagSelector"
                class="p-2 hover:bg-bg-hover rounded-full text-text-secondary hover:text-text-primary"
              >
                <Icon name="fluent:tag-20-filled" size="18" />
              </button>
              <button 
                @click="toggleCodeMode"
                class="p-2 hover:bg-bg-hover rounded-full text-text-secondary hover:text-primary"
                :class="{ 'text-primary': isCodeMode }"
              >
                <Icon name="fluent:code-20-filled" size="18" />
              </button>
            </div>
            <div class="flex items-center gap-2">
              <span class="text-sm text-text-secondary">{{ quickNoteContent.length }}/280</span>
              <Button 
                variant="primary" 
                @click="createQuickNote"
                :disabled="!quickNoteContent.trim()"
                class="px-6"
              >
                Note
              </Button>
            </div>
          </div>
          
          <!-- Tag selector -->
          <div v-if="showTagSelector" class="mt-3 p-3 bg-bg-secondary rounded-lg">
            <TagCombobox :tags="quickNoteTags" @selected-tags="updateQuickNoteTags" />
          </div>
        </div>
      </div>
    </div>

    <!-- Search and Filter -->
    <div class="p-6 border-b border-bg-border">
      <div class="flex gap-3 mb-4">
        <SearchInput 
          @search="handleSearch" 
          placeholder="Search notes..." 
          class="flex-1" 
          :show-results-count="!!searchText"
          :result-count="searchText ? filteredNotes.length : null"
        />
        <button 
          @click="showFilters = !showFilters"
          class="p-3 hover:bg-bg-hover rounded-lg"
          :class="{ 'text-primary': selectedTags.length > 0 }"
        >
          <Icon name="fluent:filter-20-filled" size="20" />
        </button>
      </div>
      
      <!-- Active filters -->
      <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-1">
        <Chip 
          v-for="tag in selectedTags" 
          :key="tag.id" 
          :text="tag.name" 
          :color="tag.color" 
          hasCloseBtn 
          @close="removeSelectedTag(tag.id)" 
        />
      </div>
      
      <!-- Filter panel -->
      <div v-if="showFilters" class="mt-3 p-3 bg-bg-secondary rounded-lg">
        <h3 class="text-sm font-medium text-text-primary-emphasis mb-2">Filter by tags</h3>
        <div class="flex flex-wrap gap-1">
          <button
            v-for="tag in availableTags"
            :key="tag.id"
            @click="toggleTagFilter(tag)"
            class="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs hover:bg-bg-hover"
            :class="isTagSelected(tag.id) ? 'bg-primary text-white' : 'bg-bg-hover text-text-secondary'"
          >
            <ColorDot :color="tag.color" :size="8" />
            {{ tag.name }} ({{ tag.count }})
          </button>
        </div>
      </div>
    </div>

    <!-- Notes Timeline -->
    <div class="pb-20 lg:pb-4">
      <div v-if="filteredNotes.length === 0" class="p-8 text-center text-text-secondary">
        <Icon name="fluent:note-20-regular" size="48" class="mx-auto mb-4 opacity-50" />
        <p>No notes found</p>
        <p class="text-sm mt-1">Start by creating your first note above</p>
      </div>
      
      <div v-else :class="isGridView ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6' : ''">
        <NoteCard
          v-for="note in filteredNotes"
          :key="note.id"
          :note="note"
          :isGridView="isGridView"
          @click="selectNote(note)"
          @delete="handleDeleteNote"
          @edit-tags="handleEditNoteTags"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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
  deleteNote,
  saveTags,
  tags,
  notes,
  fetchNotes
} = useNotes();

const config = useRuntimeConfig();
const router = useRouter();

// Quick note composer
const quickNoteContent = ref('');
const quickNoteTags = ref<Tag[]>([]);
const isCodeMode = ref(false);
const showTagSelector = ref(false);

// View and filters
const isGridView = ref(false);
const showFilters = ref(false);
const searchText = ref('');
const filteredNotes = ref<Note[]>([]);

// Computed
const availableTags = computed(() => {
  return tags.value.filter(tag => tag.count && tag.count > 0);
});

// Watch for changes to update filtered notes
watch([searchText, selectedTags, notes], () => {
  filteredNotes.value = searchNotes(searchText.value);
}, { immediate: true });

// Methods
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    createQuickNote();
  }
};

const createQuickNote = async () => {
  if (!quickNoteContent.value.trim()) return;
  
  // Create note with the content
  const note: Note = {
    id: -1,
    title: quickNoteContent.value.split('\n')[0].substring(0, 50) || 'Quick Note',
    content: isCodeMode.value 
      ? `\`\`\`\n${quickNoteContent.value}\n\`\`\``
      : quickNoteContent.value,
  };

  const noteId = await $fetch<number>(
    `${config.public.apiUrl}/notes`,
    {
      method: 'POST',
      body: note,
    }
  );
  
  // Add tags if any
  if (quickNoteTags.value.length > 0 && noteId) {
    await saveTags(noteId, quickNoteTags.value);
  }
  
  // Reset form
  quickNoteContent.value = '';
  quickNoteTags.value = [];
  isCodeMode.value = false;
  showTagSelector.value = false;
  
  // Refresh notes
  await fetchNotes();
  filteredNotes.value = searchNotes(searchText.value);
};

const toggleCodeMode = () => {
  isCodeMode.value = !isCodeMode.value;
};

const toggleView = () => {
  isGridView.value = !isGridView.value;
};

const removeQuickNoteTag = (tagId: number) => {
  quickNoteTags.value = quickNoteTags.value.filter(tag => tag.id !== tagId);
};

const updateQuickNoteTags = (tags: Tag[]) => {
  quickNoteTags.value = tags;
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

const handleEditNoteTags = (note: Note) => {
  router.push(`/note/${note.id}?edit-tags=true`);
};
</script>
