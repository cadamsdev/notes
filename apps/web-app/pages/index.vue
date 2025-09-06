<template>
  <div class="max-w-6xl mx-auto min-h-screen bg-bg">
    <!-- Header -->
    <header class="sticky top-0 bg-bg/95 backdrop-blur-sm border-b border-divider p-4 z-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <h1 class="text-2xl font-semibold text-text-primary-emphasis">Notes</h1>
          <span class="text-sm text-text-muted">{{ notes.length }} notes</span>
        </div>
        <div class="flex items-center gap-2">
          <SearchInput 
            @search="handleSearch" 
            placeholder="Search your notes..." 
            class="w-80" 
            :show-results-count="!!searchText"
            :result-count="searchText ? filteredNotes.length : null"
          />
          <button 
            @click="showFilters = !showFilters"
            class="p-2 hover:bg-bg-hover rounded-lg transition-colors"
            :class="{ 'text-primary': selectedTags.length > 0 }"
            title="Filter by tags"
          >
            <Icon name="fluent:filter-20-filled" size="20" />
          </button>
          <button 
            @click="toggleView" 
            class="p-2 hover:bg-bg-hover rounded-lg transition-colors"
            :title="isGridView ? 'List view' : 'Grid view'"
          >
            <Icon :name="isGridView ? 'fluent:list-20-filled' : 'fluent:grid-20-filled'" size="20" />
          </button>
        </div>
      </div>
      
      <!-- Active filters -->
      <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-2 mt-3">
        <Chip 
          v-for="tag in selectedTags" 
          :key="tag.id" 
          :text="tag.name" 
          :color="tag.color" 
          hasCloseBtn 
          @close="removeSelectedTag(tag.id)" 
        />
      </div>
      
      <!-- Tag filter panel -->
      <Transition
        enter-active-class="transition-all duration-200 ease-out"
        enter-from-class="opacity-0 -translate-y-2"
        enter-to-class="opacity-100 translate-y-0"
        leave-active-class="transition-all duration-150 ease-in"
        leave-from-class="opacity-100 translate-y-0"
        leave-to-class="opacity-0 -translate-y-2"
      >
        <div v-if="showFilters" class="mt-4 p-4 bg-card-bg border border-card-border rounded-lg">
          <h3 class="text-sm font-medium text-text-primary mb-3">Filter by tags</h3>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="tag in availableTags"
              :key="tag.id"
              @click="selectTag(tag)"
              class="inline-flex items-center gap-1 px-3 py-1 rounded-full border transition-all hover:bg-bg-hover"
              :class="[
                selectedTags.find(t => t.id === tag.id)
                  ? 'border-primary bg-primary-soft text-primary'
                  : 'border-bg-border text-text-secondary hover:border-bg-border-hover'
              ]"
            >
              <ColorDot :color="tag.color" size="sm" />
              <span class="text-sm">{{ tag.name }}</span>
              <span class="text-xs opacity-75">({{ tag.count }})</span>
            </button>
          </div>
        </div>
      </Transition>
    </header>

    <!-- Quick Note Composer -->
    <div class="p-6 border-b border-divider bg-card-bg">
      <div class="max-w-4xl mx-auto">
        <div class="flex gap-4">
          <div class="w-8 h-8 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
            <Icon name="fluent:edit-20-filled" size="16" class="text-white" />
          </div>
          <div class="flex-1">
            <textarea
              v-model="quickNoteContent"
              @keydown="handleKeydown"
              placeholder="Write a quick note..."
              class="w-full bg-transparent text-text-primary placeholder-text-muted text-base resize-none border-none outline-none leading-relaxed"
              rows="2"
            ></textarea>
            
            <!-- Tags for quick note -->
            <div v-if="quickNoteTags.length > 0" class="flex flex-wrap gap-1 mt-3">
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
            <div class="flex items-center justify-between mt-4">
              <div class="flex items-center gap-1">
                <button 
                  @click="showTagSelector = !showTagSelector"
                  class="p-2 hover:bg-bg-hover rounded-lg text-text-muted hover:text-text-primary transition-colors"
                  title="Add tags"
                >
                  <Icon name="fluent:tag-20-filled" size="18" />
                </button>
                <button 
                  @click="toggleCodeMode"
                  class="p-2 hover:bg-bg-hover rounded-lg transition-colors"
                  :class="isCodeMode ? 'text-primary' : 'text-text-muted hover:text-text-primary'"
                  title="Code mode"
                >
                  <Icon name="fluent:code-20-filled" size="18" />
                </button>
              </div>
              <div class="flex items-center gap-3">
                <span class="text-sm text-text-muted">{{ quickNoteContent.length }} chars</span>
                <Button 
                  variant="primary" 
                  @click="createQuickNote"
                  :disabled="!quickNoteContent.trim()"
                  class="px-6"
                >
                  <Icon name="fluent:add-20-filled" size="16" class="mr-1" />
                  Add Note
                </Button>
              </div>
            </div>
            
            <!-- Tag selector -->
            <Transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition-all duration-150 ease-in"
              leave-from-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div v-if="showTagSelector" class="mt-4 p-4 bg-bg-secondary border border-bg-border rounded-lg">
                <TagCombobox :tags="quickNoteTags" @selected-tags="updateQuickNoteTags" />
              </div>
            </Transition>
          </div>
        </div>
      </div>
    </div>

    <!-- Notes Display -->
    <main class="p-6">
      <div class="max-w-6xl mx-auto">
        <!-- Empty state -->
        <div v-if="filteredNotes.length === 0" class="text-center py-16">
          <div class="w-16 h-16 bg-bg-secondary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="fluent:note-20-regular" size="32" class="text-text-muted" />
          </div>
          <h3 class="text-lg font-medium text-text-primary mb-2">
            {{ searchText ? 'No notes found' : 'No notes yet' }}
          </h3>
          <p class="text-text-muted">
            {{ searchText ? 'Try a different search term' : 'Create your first note using the composer above' }}
          </p>
        </div>
        
        <!-- Notes grid/list -->
        <div v-else :class="isGridView 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
          : 'space-y-4'
        ">
          <NoteCard
            v-for="note in filteredNotes"
            :key="note.id"
            :note="note"
            :isGridView="isGridView"
            @click="selectNote(note)"
            @delete="handleDeleteNote"
            @edit-tags="handleEditNoteTags"
            class="transition-all duration-200 hover:scale-[1.02] cursor-pointer"
          />
        </div>
      </div>
    </main>
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
