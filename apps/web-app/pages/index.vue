<template>
  <div class="min-h-screen bg-bg">
    <div class="max-w-4xl mx-auto p-6">
      <!-- Note Composer -->
      <div class="border border-divider bg-card-bg rounded-lg p-6 mb-8">
        <textarea
          v-model="quickNoteContent"
          @keydown="handleKeydown"
          placeholder="Any thoughts..."
          class="w-full bg-transparent text-text-primary placeholder-text-muted text-base resize-none border-none outline-none leading-relaxed min-h-[100px]"
          rows="4"
        ></textarea>
        
        <!-- Composer Actions -->
        <div class="flex items-center justify-between mt-4">
          <div class="flex items-center gap-2">
            <button 
              @click="showTagSelector = !showTagSelector"
              class="p-2 hover:bg-bg-hover rounded-lg text-text-muted hover:text-text-primary transition-colors"
              title="Add tags"
            >
              <Icon name="fluent:hashtag-20-filled" size="18" />
            </button>
            <button class="p-2 hover:bg-bg-hover rounded-lg text-text-muted hover:text-text-primary transition-colors">
              <Icon name="fluent:attach-20-filled" size="18" />
            </button>
            <button class="p-2 hover:bg-bg-hover rounded-lg text-text-muted hover:text-text-primary transition-colors">
              <Icon name="fluent:link-20-filled" size="18" />
            </button>
            <button 
              @click="toggleCodeMode"
              class="p-2 hover:bg-bg-hover rounded-lg transition-colors"
              :class="isCodeMode ? 'text-primary' : 'text-text-muted hover:text-text-primary'"
              title="Code mode"
            >
              <Icon name="fluent:code-20-filled" size="18" />
            </button>
            <button class="p-2 hover:bg-bg-hover rounded-lg text-text-muted hover:text-text-primary transition-colors">
              <Icon name="fluent:location-20-filled" size="18" />
            </button>
          </div>
          <Button 
            variant="primary" 
            @click="createQuickNote"
            :disabled="!quickNoteContent.trim()"
            class="px-6"
          >
            <Icon name="fluent:save-20-filled" size="16" class="mr-1" />
            Save
          </Button>
        </div>
        
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
            @click="selectNote(note)"
            @delete="handleDeleteNote"
            @edit-tags="handleEditNoteTags"
            class="cursor-pointer hover:bg-card-hover transition-colors rounded-lg border border-card-border"
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
const searchText = ref('');
const filteredNotes = ref<Note[]>([]);
const selectedDate = ref<Date | null>(null);

// Calendar functionality
const currentDate = ref(new Date());
const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Computed properties
const availableTags = computed(() => {
  return tags.value.filter(tag => tag.count && tag.count > 0);
});

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
});

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  // First day of the week (Sunday = 0)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  const currentDateObj = new Date(startDate);
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const date = new Date(currentDateObj);
    const isCurrentMonth = date.getMonth() === month;
    const isToday = isSameDay(date, new Date());
    const hasNotes = notes.value.some(note => 
      note.created_at && isSameDay(new Date(note.created_at), date)
    );
    
    days.push({
      date,
      day: date.getDate(),
      isCurrentMonth,
      isToday,
      hasNotes,
      key: `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
    });
    
    currentDateObj.setDate(currentDateObj.getDate() + 1);
  }
  
  return days;
});

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
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    createQuickNote();
  }
};

// Calendar methods
const previousMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
};

const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
};

const selectDate = (dateObj: any) => {
  if (selectedDate.value && isSameDay(dateObj.date, selectedDate.value)) {
    selectedDate.value = null;
  } else {
    selectedDate.value = dateObj.date;
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
