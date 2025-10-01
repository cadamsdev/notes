<script setup lang="ts">
import './styles/global.css';
import { ref, computed } from 'vue';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

const noteContent = ref('');
const notes = ref<Note[]>([]);
const hoveredNoteId = ref<number | null>(null);
const selectedDate = ref<Date | null>(null);
const selectedTag = ref<string | null>(null);
const currentMonth = ref(new Date());
const MAX_CHARS = 280;
let nextId = 1;

const charCount = computed(() => noteContent.value.length);
const charCountColor = computed(() => {
  if (charCount.value > MAX_CHARS) return 'text-[var(--color-x-error)]';
  if (charCount.value > MAX_CHARS * 0.9) return 'text-[var(--color-x-warning)]';
  return 'text-[var(--color-x-text-muted)]';
});

const canPost = computed(() => {
  return noteContent.value.trim().length > 0 && charCount.value <= MAX_CHARS;
});

// Calendar computations
const daysInMonth = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  return new Date(year, month + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  return new Date(year, month, 1).getDay();
});

const calendarDays = computed(() => {
  const days = [];
  const totalDays = daysInMonth.value;
  const firstDay = firstDayOfMonth.value;
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }
  
  // Add the days of the month
  for (let i = 1; i <= totalDays; i++) {
    days.push(i);
  }
  
  return days;
});

const monthName = computed(() => {
  return currentMonth.value.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const filteredNotes = computed(() => {
  let filtered = notes.value;
  
  // Filter by date
  if (selectedDate.value) {
    filtered = filtered.filter(note => {
      const noteDate = new Date(note.createdAt);
      return noteDate.toDateString() === selectedDate.value!.toDateString();
    });
  }
  
  // Filter by tag
  if (selectedTag.value) {
    filtered = filtered.filter(note => {
      const tags = extractTags(note.content);
      return tags.includes(selectedTag.value!);
    });
  }
  
  return filtered;
});

// Extract tags from note content (words starting with #)
const extractTags = (content: string): string[] => {
  const tagRegex = /#(\w+)/g;
  const matches = content.matchAll(tagRegex);
  return Array.from(matches, m => m[1].toLowerCase());
};

// Get all unique tags from all notes
const allTags = computed(() => {
  const tagSet = new Set<string>();
  notes.value.forEach(note => {
    const tags = extractTags(note.content);
    tags.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
});

// Get note count for each tag
const getNotesCountForTag = (tag: string): number => {
  return notes.value.filter(note => {
    const tags = extractTags(note.content);
    return tags.includes(tag);
  }).length;
};

const selectTag = (tag: string) => {
  if (selectedTag.value === tag) {
    selectedTag.value = null; // Deselect if clicking the same tag
  } else {
    selectedTag.value = tag;
  }
};

const getNotesCountForDay = (day: number | null): number => {
  if (!day) return 0;
  
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const date = new Date(year, month, day);
  
  return notes.value.filter(note => {
    const noteDate = new Date(note.createdAt);
    return noteDate.toDateString() === date.toDateString();
  }).length;
};

const isToday = (day: number | null): boolean => {
  if (!day) return false;
  
  const today = new Date();
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const date = new Date(year, month, day);
  
  return date.toDateString() === today.toDateString();
};

const isSelected = (day: number | null): boolean => {
  if (!day || !selectedDate.value) return false;
  
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const date = new Date(year, month, day);
  
  return date.toDateString() === selectedDate.value.toDateString();
};

const selectDate = (day: number | null) => {
  if (!day) return;
  
  const year = currentMonth.value.getFullYear();
  const month = currentMonth.value.getMonth();
  const date = new Date(year, month, day);
  
  if (selectedDate.value?.toDateString() === date.toDateString()) {
    selectedDate.value = null; // Deselect if clicking the same date
  } else {
    selectedDate.value = date;
  }
};

const previousMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() - 1);
};

const nextMonth = () => {
  currentMonth.value = new Date(currentMonth.value.getFullYear(), currentMonth.value.getMonth() + 1);
};

const createNote = () => {
  if (canPost.value) {
    notes.value.unshift({
      id: nextId++,
      content: noteContent.value,
      createdAt: new Date()
    });
    noteContent.value = '';
  }
};

const deleteNote = (id: number) => {
  notes.value = notes.value.filter(note => note.id !== id);
};

const formatDate = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  if (diffInSeconds < 60) return `${diffInSeconds}s`;
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const handleKeydown = (e: KeyboardEvent) => {
  if ((e.metaKey || e.ctrlKey) && e.key === 'Enter' && canPost.value) {
    createNote();
  }
};
</script>

<template>
  <main class="min-h-screen flex justify-center bg-[var(--color-x-black)]">
    <!-- Main Container - 2 Column Layout -->
    <div class="w-full max-w-[1200px] flex border-x border-[var(--color-x-border)]">
      
      <!-- Left Column - Calendar -->
      <div class="w-[400px] border-r border-[var(--color-x-border)] flex flex-col">
        <!-- Calendar Header -->
        <div class="sticky top-0 bg-[var(--color-x-black)]/95 backdrop-blur-xl border-b border-[var(--color-x-border)] z-10 shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
          <div class="px-4 py-4">
            <h2 class="text-lg font-semibold mb-3">Calendar</h2>
            
            <!-- Month Navigation -->
            <div class="flex items-center justify-between mb-4">
              <button
                @click="previousMonth"
                class="w-8 h-8 rounded-full hover:bg-[var(--color-x-hover)] flex items-center justify-center transition-colors text-[var(--color-x-text-primary)]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
                </svg>
              </button>
              
              <h3 class="text-base font-semibold">{{ monthName }}</h3>
              
              <button
                @click="nextMonth"
                class="w-8 h-8 rounded-full hover:bg-[var(--color-x-hover)] flex items-center justify-center transition-colors text-[var(--color-x-text-primary)]"
              >
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
            
            <!-- Day Labels -->
            <div class="grid grid-cols-7 gap-1 mb-2">
              <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" 
                class="text-center text-xs font-medium text-[var(--color-x-text-muted)] py-1">
                {{ day }}
              </div>
            </div>
          </div>
        </div>
        
        <!-- Calendar Grid -->
        <div class="flex-1 overflow-y-auto p-4">
          <div class="grid grid-cols-7 gap-1">
            <button
              v-for="(day, index) in calendarDays"
              :key="index"
              @click="selectDate(day)"
              :disabled="!day"
              :class="[
                'aspect-square rounded-lg flex flex-col items-center justify-center text-sm transition-all duration-200 relative',
                day ? 'hover:bg-[var(--color-x-hover)] cursor-pointer' : 'cursor-default',
                isToday(day) && !isSelected(day) ? 'bg-[var(--color-x-blue-light)] text-[var(--color-x-blue)] font-semibold ring-1 ring-[var(--color-x-blue)]' : '',
                isSelected(day) ? 'bg-[var(--color-btn-primary)] text-[var(--color-btn-primary-text)] font-semibold shadow-lg' : 'text-[var(--color-x-text-primary)]',
                !day ? 'text-transparent' : '',
                day && !isToday(day) && !isSelected(day) && getNotesCountForDay(day) > 0 ? 'font-medium' : ''
              ]"
            >
              <span>{{ day || '' }}</span>
              <span 
                v-if="day && getNotesCountForDay(day) > 0"
                :class="[
                  'text-xs mt-0.5',
                  isSelected(day) ? 'text-[var(--color-btn-primary-text)]/70' : 'text-[var(--color-x-blue)]'
                ]"
              >
                {{ getNotesCountForDay(day) }}
              </span>
            </button>
          </div>
          
          <!-- Selected Date Info -->
          <div v-if="selectedDate" class="mt-6 p-3 bg-[var(--color-x-hover)] rounded-lg border border-[var(--color-x-border)]">
            <div class="text-sm text-[var(--color-x-text-secondary)] mb-1">Viewing notes from</div>
            <div class="font-semibold text-[var(--color-x-text-primary)]">
              {{ selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }}
            </div>
            <button
              @click="selectedDate = null"
              class="mt-2 text-sm text-[var(--color-x-blue)] hover:underline"
            >
              Clear filter
            </button>
          </div>
        </div>
        
        <!-- Tags Section -->
        <div class="border-t border-[var(--color-x-border)] p-4">
          <h3 class="text-base font-semibold mb-3">Tags</h3>
          
          <div v-if="allTags.length > 0" class="flex flex-wrap gap-2">
            <button
              v-for="tag in allTags"
              :key="tag"
              @click="selectTag(tag)"
              :class="[
                'px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200',
                selectedTag === tag 
                  ? 'bg-[var(--color-btn-primary)] text-[var(--color-btn-primary-text)] shadow-md' 
                  : 'bg-[var(--color-x-hover)] text-[var(--color-x-text-primary)] hover:bg-[var(--color-x-border)]'
              ]"
            >
              #{{ tag }}
              <span class="ml-1.5 text-xs opacity-70">{{ getNotesCountForTag(tag) }}</span>
            </button>
          </div>
          
          <div v-else class="text-[var(--color-x-text-muted)] text-sm">
            No tags yet. Add hashtags to your notes like #ideas or #todo to organize them.
          </div>
          
          <!-- Selected Tag Info -->
          <div v-if="selectedTag" class="mt-3 p-2 bg-[var(--color-x-hover)] rounded-lg border border-[var(--color-x-border)]">
            <div class="text-xs text-[var(--color-x-text-secondary)] mb-1">Filtering by tag</div>
            <div class="flex items-center justify-between">
              <span class="font-medium text-[var(--color-x-text-primary)] text-sm">#{{ selectedTag }}</span>
              <button
                @click="selectedTag = null"
                class="text-xs text-[var(--color-x-blue)] hover:underline"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Notes Feed -->
      <div class="flex-1 flex flex-col">
        <!-- Header -->
        <header class="sticky top-0 bg-[var(--color-x-black)]/95 backdrop-blur-xl border-b border-[var(--color-x-border)] z-10 shadow-[0_1px_3px_rgba(0,0,0,0.5)]">
          <div class="px-4 py-4">
            <h1 class="text-xl font-bold tracking-tight">My Notes</h1>
          </div>
        </header>

        <!-- Note Creator -->
        <div class="border-b border-[var(--color-x-border)] bg-[var(--color-x-black)]">
          <div class="p-4">
            <div class="flex gap-3">
              <!-- Input Area -->
              <div class="flex-1">
                <textarea
                  v-model="noteContent"
                  @keydown="handleKeydown"
                  placeholder="What's on your mind?"
                  class="w-full bg-transparent text-[var(--color-x-text-primary)] placeholder-[var(--color-x-text-muted)] resize-none border-none outline-none text-lg leading-relaxed min-h-[100px] py-2 focus:placeholder-[var(--color-x-text-secondary)]"
                  rows="3"
                  maxlength="500"
                ></textarea>

                <!-- Character Counter & Actions -->
                <div class="flex items-center justify-between pt-3 mt-2 border-t border-[var(--color-x-border)]">
                  <div class="flex items-center gap-2">
                    <!-- Icon Buttons with better hover states -->
                    <button 
                      class="w-9 h-9 rounded-full hover:bg-[var(--color-x-blue-light)] flex items-center justify-center transition-all duration-200 text-[var(--color-x-blue)] hover:scale-110 active:scale-95"
                      title="Add image"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                      </svg>
                    </button>
                    <button 
                      class="w-9 h-9 rounded-full hover:bg-[var(--color-x-blue-light)] flex items-center justify-center transition-all duration-200 text-[var(--color-x-blue)] hover:scale-110 active:scale-95"
                      title="Add emoji"
                    >
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </button>
                    
                    <!-- Character Counter -->
                    <div class="ml-2 flex items-center gap-2">
                      <span :class="['text-sm font-medium transition-colors', charCountColor]">
                        {{ charCount }} / {{ MAX_CHARS }}
                      </span>
                    </div>
                  </div>

                  <!-- Post Button -->
                  <button
                    @click="createNote"
                    :disabled="!canPost"
                    class="px-6 py-2.5 bg-[var(--color-btn-primary)] text-[var(--color-btn-primary-text)] rounded-full font-semibold hover:bg-[var(--color-btn-primary-hover)] disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl disabled:shadow-none hover:scale-105 active:scale-95 disabled:hover:scale-100"
                  >
                    Post Note
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Notes Feed -->
        <div class="flex-1 overflow-y-auto">
          <div class="divide-y divide-[var(--color-x-border)]">
            <div
              v-for="note in filteredNotes"
              :key="note.id"
              @mouseenter="hoveredNoteId = note.id"
              @mouseleave="hoveredNoteId = null"
              class="p-4 hover:bg-[var(--color-x-hover)] transition-all duration-200 cursor-pointer group relative"
            >
              <div class="flex gap-3">
                <!-- Note Content -->
                <div class="flex-1 min-w-0">
                  <div class="flex items-center justify-between mb-1">
                    <div class="flex items-center gap-2">
                      <span class="font-semibold text-[var(--color-x-text-primary)]">You</span>
                      <span class="text-[var(--color-x-text-muted)] text-sm">·</span>
                      <span class="text-[var(--color-x-text-muted)] text-sm">{{ formatDate(note.createdAt) }}</span>
                    </div>
                    
                    <!-- Delete button (shows on hover) -->
                    <button
                      @click.stop="deleteNote(note.id)"
                      :class="[
                        'opacity-0 group-hover:opacity-100 transition-all duration-200 p-2 rounded-full hover:bg-red-500/10 text-[var(--color-x-text-muted)] hover:text-[var(--color-x-error)]',
                        hoveredNoteId === note.id ? 'scale-100' : 'scale-90'
                      ]"
                      title="Delete note"
                    >
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                      </svg>
                    </button>
                  </div>
                  
                  <div class="text-[var(--color-x-text-primary)] whitespace-pre-wrap break-words leading-relaxed">
                    {{ note.content }}
                  </div>

                  <!-- Action Buttons -->
                  <div class="flex items-center gap-16 mt-4 text-[var(--color-x-text-muted)]">
                    <button class="flex items-center gap-2 group/action transition-all duration-200">
                      <div class="w-8 h-8 rounded-full group-hover/action:bg-[var(--color-x-blue-light)] flex items-center justify-center transition-all duration-200 group-hover/action:scale-110">
                        <svg class="w-4 h-4 group-hover/action:text-[var(--color-x-blue)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>
                        </svg>
                      </div>
                    </button>

                    <button class="flex items-center gap-2 group/action transition-all duration-200">
                      <div class="w-8 h-8 rounded-full group-hover/action:bg-green-500/10 flex items-center justify-center transition-all duration-200 group-hover/action:scale-110">
                        <svg class="w-4 h-4 group-hover/action:text-green-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                        </svg>
                      </div>
                    </button>

                    <button class="flex items-center gap-2 group/action transition-all duration-200">
                      <div class="w-8 h-8 rounded-full group-hover/action:bg-pink-600/10 flex items-center justify-center transition-all duration-200 group-hover/action:scale-110">
                        <svg class="w-4 h-4 group-hover/action:text-pink-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/>
                        </svg>
                      </div>
                    </button>

                    <button class="flex items-center gap-2 group/action transition-all duration-200">
                      <div class="w-8 h-8 rounded-full group-hover/action:bg-[var(--color-x-blue-light)] flex items-center justify-center transition-all duration-200 group-hover/action:scale-110">
                        <svg class="w-4 h-4 group-hover/action:text-[var(--color-x-blue)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"/>
                        </svg>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Enhanced Empty State -->
            <div v-if="filteredNotes.length === 0" class="p-20 text-center">
              <div class="w-20 h-20 mx-auto mb-4 rounded-full bg-[var(--color-x-blue-light)] flex items-center justify-center">
                <svg class="w-10 h-10 text-[var(--color-x-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                </svg>
              </div>
              <div class="text-[var(--color-x-text-primary)] text-xl font-semibold mb-2">
                {{ selectedDate ? 'No notes for this date' : 'No notes yet' }}
              </div>
              <div class="text-[var(--color-x-text-secondary)] text-base max-w-sm mx-auto">
                {{ selectedDate ? 'Try selecting a different date or create a new note.' : 'Share your thoughts, ideas, or reminders. Your first note is just a few keystrokes away.' }}
              </div>
              <div v-if="!selectedDate" class="mt-4 text-[var(--color-x-text-muted)] text-sm">
                Press <kbd class="px-2 py-1 bg-[var(--color-x-border)] rounded text-xs font-mono">Ctrl</kbd> + <kbd class="px-2 py-1 bg-[var(--color-x-border)] rounded text-xs font-mono">Enter</kbd> to post
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>
