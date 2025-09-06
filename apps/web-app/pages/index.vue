<template>
  <div class="min-h-screen bg-bg flex">
    <!-- Left Sidebar -->
    <div class="w-80 border-r border-divider bg-card-bg flex flex-col">
      <!-- Header -->
      <div class="p-4 border-b border-divider">
        <h1 class="text-xl font-semibold text-text-primary-emphasis mb-1">Notes</h1>
        <div class="flex items-center justify-between">
          <span class="text-sm text-text-muted">{{ notes.length }} notes</span>
          <SearchInput 
            @search="handleSearch" 
            placeholder="Search memos..." 
            class="w-32" 
            :show-results-count="false"
          />
        </div>
      </div>

      <!-- Calendar Section -->
      <div class="p-4 border-b border-divider">
        <h2 class="text-sm font-medium text-text-primary mb-3 flex items-center gap-2">
          <Icon name="fluent:calendar-20-filled" size="16" />
          Calendar
        </h2>
        <div class="bg-bg-secondary rounded-lg p-3">
          <!-- Calendar Header -->
          <div class="flex items-center justify-between mb-3">
            <button @click="previousMonth" class="p-1 hover:bg-bg-hover rounded">
              <Icon name="fluent:chevron-left-20-filled" size="16" class="text-text-muted" />
            </button>
            <h3 class="text-sm font-medium text-text-primary">{{ currentMonthYear }}</h3>
            <button @click="nextMonth" class="p-1 hover:bg-bg-hover rounded">
              <Icon name="fluent:chevron-right-20-filled" size="16" class="text-text-muted" />
            </button>
          </div>
          
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1 text-xs">
            <!-- Day headers -->
            <div v-for="day in dayHeaders" :key="day" class="text-center text-text-muted p-1 font-medium">
              {{ day }}
            </div>
            
            <!-- Calendar days -->
            <button
              v-for="date in calendarDays"
              :key="date.key"
              @click="selectDate(date)"
              :class="[
                'text-center p-1 rounded hover:bg-bg-hover transition-colors',
                date.isCurrentMonth ? 'text-text-primary' : 'text-text-muted',
                date.isToday ? 'bg-primary text-white' : '',
                date.hasNotes ? 'font-semibold' : '',
                selectedDate && isSameDay(date.date, selectedDate) ? 'bg-primary-soft text-primary' : ''
              ]"
            >
              {{ date.day }}
            </button>
          </div>
        </div>
      </div>

      <!-- Tags Section -->
      <div class="flex-1 p-4">
        <div class="flex items-center justify-between mb-3">
          <h2 class="text-sm font-medium text-text-primary flex items-center gap-2">
            <Icon name="fluent:tag-20-filled" size="16" />
            Tags
          </h2>
          <button class="text-xs text-text-muted hover:text-text-primary">
            <Icon name="fluent:add-20-filled" size="12" />
          </button>
        </div>
        
        <!-- Tag List -->
        <div class="space-y-1">
          <button
            v-for="tag in availableTags"
            :key="tag.id"
            @click="selectTag(tag)"
            :class="[
              'w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left transition-colors text-sm',
              selectedTags.find(t => t.id === tag.id)
                ? 'bg-primary-soft text-primary'
                : 'hover:bg-bg-hover text-text-secondary'
            ]"
          >
            <ColorDot :color="tag.color" size="sm" />
            <span class="flex-1">{{ tag.name }}</span>
            <span class="text-xs opacity-75">{{ tag.count }}</span>
          </button>
        </div>

        <!-- Shortcuts -->
        <div class="mt-6 pt-4 border-t border-divider">
          <h3 class="text-xs font-medium text-text-muted mb-2">Shortcuts</h3>
          <div class="space-y-1">
            <button class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-bg-hover text-sm text-text-secondary">
              <Icon name="fluent:link-20-filled" size="14" />
              <span>Links</span>
              <span class="text-xs opacity-75 ml-auto">0</span>
            </button>
            <button class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-bg-hover text-sm text-text-secondary">
              <Icon name="fluent:checkmark-square-20-filled" size="14" />
              <span>To-do</span>
              <span class="text-xs opacity-75 ml-auto">0 / 1</span>
            </button>
            <button class="w-full flex items-center gap-2 px-2 py-1.5 rounded-lg text-left hover:bg-bg-hover text-sm text-text-secondary">
              <Icon name="fluent:code-20-filled" size="14" />
              <span>Code</span>
              <span class="text-xs opacity-75 ml-auto">0</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Note Composer -->
      <div class="border-b border-divider bg-card-bg p-6">
        <div class="max-w-4xl">
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
      </div>

      <!-- Notes Feed -->
      <div class="flex-1 overflow-y-auto p-6">
        <div class="max-w-4xl space-y-4">
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
