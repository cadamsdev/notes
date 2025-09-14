<script setup lang="ts">
import "./styles/global.css";
import { ref } from "vue";
import Calendar from "./components/Calendar.vue";
import TagList from "./components/TagList.vue";
import NoteComposer from "./components/NoteComposer.vue";
import NoteCard from "./components/NoteCard.vue";

// Mobile UI state
const showMobileMenu = ref(false);
const activeTab = ref("notes"); // 'calendar', 'tags', 'notes'

// Mock data for demonstration
const mockNotes = ref([
  {
    id: 1,
    title: "Meeting Notes - Project Kickoff",
    content:
      "Discussed project timeline, resource allocation, and key milestones. Next steps include setting up development environment and initial planning session.",
    tags: ["work", "meetings"],
    date: "2024-09-13",
    time: "2:30 PM",
  },
  {
    id: 2,
    title: "Book Ideas",
    content:
      "Exploring themes around digital minimalism and productivity. Consider chapter structure and research materials needed.",
    tags: ["personal", "writing"],
    date: "2024-09-12",
    time: "10:15 AM",
  },
  {
    id: 3,
    title: "Weekend Tasks",
    content: "- Clean garage\n- Grocery shopping\n- Call mom\n- Review investment portfolio",
    tags: ["personal", "tasks"],
    date: "2024-09-11",
    time: "6:45 PM",
  },
]);

const mockTags = [
  { name: "work", color: "#58a6ff", count: 5 },
  { name: "personal", color: "#7c3aed", count: 8 },
  { name: "meetings", color: "#f59e0b", count: 3 },
  { name: "writing", color: "#10b981", count: 2 },
  { name: "tasks", color: "#ef4444", count: 4 },
  { name: "ideas", color: "#8b5cf6", count: 6 },
];

// Current date for calendar
const currentDate = new Date();

// Mock note dates that have notes
const noteDates = ["2024-09-13", "2024-09-10", "2024-09-08", "2024-09-05"];

// Current note being edited (for the composer)
const currentNote = ref({
  content: "",
  tags: [] as string[],
});

// Event handlers
const handleDayClick = (date: Date) => {
  console.log("Day clicked:", date);
};

const handleTagClick = (tagName: string) => {
  console.log("Tag clicked:", tagName);
};

const handleAddTag = () => {
  console.log("Add tag clicked");
};

const handleNoteClick = (noteId: number) => {
  console.log("Note clicked:", noteId);
};

const handleEditNote = (noteId: number) => {
  const note = mockNotes.value.find((n) => n.id === noteId);
  if (note) {
    currentNote.value = {
      content: note.content,
      tags: [...note.tags],
    };
  }
};

const handleDeleteNote = (noteId: number) => {
  mockNotes.value = mockNotes.value.filter((note) => note.id !== noteId);
  console.log("Note deleted:", noteId);
};
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Mobile Header -->
    <div class="lg:hidden bg-gray-800 border-b border-gray-700 p-4">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-medium text-gray-100">Notes</h1>
        <button
          @click="showMobileMenu = !showMobileMenu"
          class="p-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </button>
      </div>

      <!-- Mobile Tab Navigation -->
      <div class="flex space-x-1 mt-4">
        <button
          @click="activeTab = 'notes'"
          class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
          :class="
            activeTab === 'notes' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
          "
        >
          Notes
        </button>
        <button
          @click="activeTab = 'calendar'"
          class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
          :class="
            activeTab === 'calendar'
              ? 'bg-blue-600 text-white'
              : 'text-gray-400 hover:text-gray-200'
          "
        >
          Calendar
        </button>
        <button
          @click="activeTab = 'tags'"
          class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
          :class="
            activeTab === 'tags' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'
          "
        >
          Tags
        </button>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="flex h-screen lg:h-auto">
      <!-- Left Column: Calendar & Tags (Desktop) / Mobile Content -->
      <div
        class="w-full lg:w-80 bg-gray-800 border-r border-gray-700 flex flex-col"
        :class="{ 'hidden lg:flex': activeTab === 'notes' && !showMobileMenu }"
      >
        <!-- Mobile Calendar View -->
        <div v-if="activeTab === 'calendar'" class="lg:hidden p-4">
          <Calendar
            :current-date="currentDate"
            :note-dates="noteDates"
            @day-click="handleDayClick"
          />
        </div>

        <!-- Mobile Tags View -->
        <div v-if="activeTab === 'tags'" class="lg:hidden p-4 flex-1 overflow-y-auto">
          <TagList
            :tags="mockTags"
            layout="grid"
            @tag-click="handleTagClick"
            @add-tag="handleAddTag"
          />
        </div>

        <!-- Desktop Calendar Section -->
        <div class="hidden lg:block p-6 border-b border-gray-700">
          <Calendar
            :current-date="currentDate"
            :note-dates="noteDates"
            @day-click="handleDayClick"
          />
        </div>

        <!-- Desktop Tags Section -->
        <div class="hidden lg:block p-6 flex-1 overflow-y-auto">
          <TagList
            :tags="mockTags"
            layout="list"
            @tag-click="handleTagClick"
            @add-tag="handleAddTag"
          />
        </div>
      </div>

      <!-- Right Column: Note Editor & Feed -->
      <div
        class="flex-1 flex flex-col min-h-0"
        :class="{ 'hidden lg:flex': activeTab !== 'notes' }"
      >
        <!-- Note Composer -->
        <NoteComposer
          :content="currentNote.content"
          :tags="currentNote.tags"
        />

        <!-- Notes Feed -->
        <div class="flex-1 overflow-y-auto p-4 lg:p-6">
          <div class="max-w-4xl mx-auto">
            <div
              class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 space-y-3 sm:space-y-0"
            >
              <h2 class="text-lg lg:text-xl font-medium text-gray-100">Recent Notes</h2>

              <!-- Search & Filter -->
              <div class="flex items-center space-x-3">
                <input
                  type="text"
                  placeholder="Search notes..."
                  class="flex-1 sm:flex-none px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200 text-sm"
                />
                <button
                  class="px-3 py-2 border border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors duration-200 text-sm whitespace-nowrap"
                >
                  Filter
                </button>
              </div>
            </div>

            <!-- Notes List -->
            <div class="space-y-3 lg:space-y-4">
              <NoteCard
                v-for="note in mockNotes"
                :key="note.id"
                :note="note"
                @note-click="handleNoteClick"
                @edit-note="handleEditNote"
                @delete-note="handleDeleteNote"
                @tag-click="handleTagClick"
              />
            </div>

            <!-- Load More -->
            <div class="text-center mt-6 lg:mt-8">
              <button
                class="px-6 py-3 border border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors duration-200 text-sm"
              >
                Load More Notes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Custom styles for contenteditable placeholder */
[contenteditable][data-placeholder]:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
}

[contenteditable]:focus {
  outline: none;
}

/* Line clamp utility */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Custom scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: #374151;
}

::-webkit-scrollbar-thumb {
  background: #6b7280;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #9ca3af;
}
</style>
