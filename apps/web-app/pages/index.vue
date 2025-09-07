<template>
  <div class="min-h-screen bg-bg">
    <div class="max-w-4xl mx-auto p-6">
      <!-- Note Composer -->
      <div class="border border-divider bg-card-bg rounded-lg p-6 mb-8">
        <div class="quick-note-editor">
          <editor-content 
            v-if="quickNoteEditor" 
            :editor="quickNoteEditor" 
            class="min-h-[100px] text-text-primary"
          />
          <div v-else class="min-h-[100px] flex items-center text-text-muted">
            Loading editor...
          </div>
        </div>
        
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
          </div>
          <Button 
            variant="primary" 
            @click="createQuickNote"
            :disabled="!quickNoteEditor?.getText().trim()"
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
            @delete="handleDeleteNote"
            @edit-tags="handleEditNoteTags"
            @edit="handleEditNote"
            class="hover:bg-card-hover transition-colors rounded-lg border border-card-border"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Note, Tag } from '~/composables/useNotes';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlock from '@/lib/tiptap/extensions/CodeBlock';

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

// TipTap editor for quick notes
const quickNoteEditor = ref<Editor>();

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

// Initialize TipTap editor for quick notes
onMounted(() => {
  quickNoteEditor.value = new Editor({
    extensions: [
      StarterKit.configure({ 
        codeBlock: false
      }),
      CodeBlock,
      Placeholder.configure({
        placeholder: 'Any thoughts...',
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
    ],
    content: {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: []
        }
      ]
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none text-text-primary bg-transparent p-0 border-none leading-relaxed'
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          createQuickNote();
          return true;
        }
        return false;
      }
    },
    onUpdate: () => {
      // Update the content when editor changes
      const json = quickNoteEditor.value?.getJSON();
      quickNoteContent.value = JSON.stringify(json);
    },
  });
});

onBeforeUnmount(() => {
  quickNoteEditor.value?.destroy();
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
    event.preventDefault();
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
  if (!quickNoteEditor.value) return;
  
  const editorContent = quickNoteEditor.value.getJSON();
  const editorText = quickNoteEditor.value.getText().trim();
  
  if (!editorText) return;
  
  // Create note with the TipTap content
  const note: Note = {
    id: -1,
    title: editorText.split('\n')[0].substring(0, 50) || 'Quick Note',
    content: JSON.stringify(editorContent),
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
  quickNoteEditor.value.commands.clearContent();
  quickNoteContent.value = '';
  quickNoteTags.value = [];
  isCodeMode.value = false;
  showTagSelector.value = false;
  
  // Refresh notes
  await fetchNotes();
  filteredNotes.value = searchNotes(searchText.value);
};

const toggleCodeMode = () => {
  if (!quickNoteEditor.value) return;
  
  isCodeMode.value = !isCodeMode.value;
  
  if (isCodeMode.value) {
    // Switch to code block
    quickNoteEditor.value.chain().focus().toggleCodeBlock().run();
  } else {
    // Switch back to normal paragraph
    if (quickNoteEditor.value.isActive('codeBlock')) {
      quickNoteEditor.value.chain().focus().toggleCodeBlock().run();
    }
  }
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

const handleEditNote = (note: Note) => {
  router.push(`/note/${note.id}`);
};

const handleEditNoteTags = (note: Note) => {
  router.push(`/note/${note.id}?edit-tags=true`);
};
</script>

<style scoped>
.quick-note-editor :deep(.ProseMirror) {
  outline: none;
  font-size: 1rem;
  line-height: 1.6;
  color: rgb(248 249 250);
  background: transparent;
  border: none;
  padding: 0;
  min-height: 100px;
  resize: none;
}

.quick-note-editor :deep(.ProseMirror p) {
  margin: 0 0 1rem 0;
}

.quick-note-editor :deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}

.quick-note-editor :deep(.ProseMirror.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: rgb(95 99 104);
  pointer-events: none;
  height: 0;
  font-style: normal;
}

.quick-note-editor :deep(.ProseMirror .is-empty::before) {
  content: attr(data-placeholder);
  float: left;
  color: rgb(95 99 104);
  pointer-events: none;
  height: 0;
  font-style: normal;
}

/* Alternative placeholder selector for TipTap */
.quick-note-editor :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: rgb(95 99 104);
  pointer-events: none;
  height: 0;
  font-style: normal;
}

.quick-note-editor :deep(.ProseMirror h1) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: rgb(255 255 255);
}

.quick-note-editor :deep(.ProseMirror h2) {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: rgb(255 255 255);
}

.quick-note-editor :deep(.ProseMirror h3) {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: rgb(255 255 255);
}

.quick-note-editor :deep(.ProseMirror ul),
.quick-note-editor :deep(.ProseMirror ol) {
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
}

.quick-note-editor :deep(.ProseMirror li) {
  margin-bottom: 0.25rem;
}

.quick-note-editor :deep(.ProseMirror blockquote) {
  border-left: 3px solid rgb(88 166 255);
  padding-left: 1rem;
  margin: 1rem 0;
  color: rgb(154 160 166);
  font-style: italic;
}

.quick-note-editor :deep(.ProseMirror code) {
  background-color: rgb(33 38 45);
  color: rgb(88 166 255);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

.quick-note-editor :deep(.ProseMirror pre) {
  background-color: rgb(13 17 23);
  border: 1px solid rgb(33 38 45);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
}

.quick-note-editor :deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
  color: rgb(248 249 250);
}

.quick-note-editor :deep(.ProseMirror strong) {
  font-weight: 600;
  color: rgb(255 255 255);
}

.quick-note-editor :deep(.ProseMirror em) {
  font-style: italic;
}

/* Focus states */
.quick-note-editor :deep(.ProseMirror:focus) {
  outline: none;
}
</style>
