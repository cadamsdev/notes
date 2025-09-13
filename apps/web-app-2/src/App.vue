<script setup lang="ts">
import './styles/global.css';
import { ref } from 'vue';

// Mobile UI state
const showMobileMenu = ref(false);
const activeTab = ref('notes'); // 'calendar', 'tags', 'notes'

// Mock data for demonstration
const mockNotes = [
  {
    id: 1,
    title: "Meeting Notes - Project Kickoff",
    content: "Discussed project timeline, resource allocation, and key milestones. Next steps include setting up development environment and initial planning session.",
    tags: ["work", "meetings"],
    date: "2024-09-13",
    time: "2:30 PM"
  },
  {
    id: 2,
    title: "Book Ideas",
    content: "Exploring themes around digital minimalism and productivity. Consider chapter structure and research materials needed.",
    tags: ["personal", "writing"],
    date: "2024-09-12",
    time: "10:15 AM"
  },
  {
    id: 3,
    title: "Weekend Tasks",
    content: "- Clean garage\n- Grocery shopping\n- Call mom\n- Review investment portfolio",
    tags: ["personal", "tasks"],
    date: "2024-09-11",
    time: "6:45 PM"
  }
];

const mockTags = [
  { name: "work", color: "#58a6ff", count: 5 },
  { name: "personal", color: "#7c3aed", count: 8 },
  { name: "meetings", color: "#f59e0b", count: 3 },
  { name: "writing", color: "#10b981", count: 2 },
  { name: "tasks", color: "#ef4444", count: 4 },
  { name: "ideas", color: "#8b5cf6", count: 6 }
];

// Current date for calendar
const currentDate = new Date();
const currentMonth = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

// Generate calendar days for current month
const generateCalendarDays = () => {
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days = [];
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    days.push({
      date: day.getDate(),
      isCurrentMonth: day.getMonth() === month,
      isToday: day.toDateString() === currentDate.toDateString(),
      hasNotes: Math.random() > 0.7 // Mock some days having notes
    });
  }
  return days;
};

const calendarDays = generateCalendarDays();
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100">
    <!-- Mobile Header -->
    <div class="lg:hidden bg-gray-800 border-b border-gray-700 p-4">
      <div class="flex items-center justify-between">
        <h1 class="text-lg font-medium text-gray-100">Notes</h1>
        <button @click="showMobileMenu = !showMobileMenu" 
                class="p-2 text-gray-400 hover:text-gray-200 transition-colors duration-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
      </div>
      
      <!-- Mobile Tab Navigation -->
      <div class="flex space-x-1 mt-4">
        <button @click="activeTab = 'notes'" 
                class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                :class="activeTab === 'notes' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'">
          Notes
        </button>
        <button @click="activeTab = 'calendar'" 
                class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                :class="activeTab === 'calendar' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'">
          Calendar
        </button>
        <button @click="activeTab = 'tags'" 
                class="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors duration-200"
                :class="activeTab === 'tags' ? 'bg-blue-600 text-white' : 'text-gray-400 hover:text-gray-200'">
          Tags
        </button>
      </div>
    </div>

    <!-- Main Layout -->
    <div class="flex h-screen lg:h-auto">
      
      <!-- Left Column: Calendar & Tags (Desktop) / Mobile Content -->
      <div class="w-full lg:w-80 bg-gray-800 border-r border-gray-700 flex flex-col"
           :class="{ 'hidden lg:flex': activeTab === 'notes' && !showMobileMenu }">
        
        <!-- Mobile Calendar View -->
        <div v-if="activeTab === 'calendar'" class="lg:hidden p-4">
          <h2 class="text-lg font-medium text-gray-100 mb-4">{{ currentMonth }}</h2>
          
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1 text-sm">
            <!-- Day Headers -->
            <div v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" 
                 :key="day" 
                 class="text-center text-gray-400 font-medium py-2">
              {{ day }}
            </div>
            
            <!-- Calendar Days -->
            <button v-for="(day, index) in calendarDays" 
                    :key="index"
                    class="relative h-10 text-center rounded hover:bg-gray-700 transition-colors duration-200"
                    :class="{
                      'text-gray-500': !day.isCurrentMonth,
                      'text-gray-100': day.isCurrentMonth,
                      'bg-blue-600 text-white': day.isToday,
                      'hover:bg-blue-500': day.isToday
                    }">
              {{ day.date }}
              <!-- Note indicator -->
              <div v-if="day.hasNotes && day.isCurrentMonth" 
                   class="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
            </button>
          </div>
        </div>

        <!-- Mobile Tags View -->
        <div v-if="activeTab === 'tags'" class="lg:hidden p-4 flex-1 overflow-y-auto">
          <h3 class="text-lg font-medium text-gray-100 mb-4">Tags</h3>
          
          <div class="grid grid-cols-2 gap-2">
            <button v-for="tag in mockTags" 
                    :key="tag.name"
                    class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-left">
              <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: tag.color }"></div>
              <div class="flex-1 min-w-0">
                <span class="text-gray-200 text-sm block truncate">{{ tag.name }}</span>
                <span class="text-gray-400 text-xs">{{ tag.count }}</span>
              </div>
            </button>
          </div>
          
          <!-- Add Tag Button -->
          <button class="mt-4 w-full px-3 py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors duration-200">
            + Add Tag
          </button>
        </div>
        
        <!-- Desktop Calendar Section -->
        <div class="hidden lg:block p-6 border-b border-gray-700">
          <h2 class="text-lg font-medium text-gray-100 mb-4">{{ currentMonth }}</h2>
          
          <!-- Calendar Grid -->
          <div class="grid grid-cols-7 gap-1 text-sm">
            <!-- Day Headers -->
            <div v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" 
                 :key="day" 
                 class="text-center text-gray-400 font-medium py-2">
              {{ day }}
            </div>
            
            <!-- Calendar Days -->
            <button v-for="(day, index) in calendarDays" 
                    :key="index"
                    class="relative h-8 text-center rounded hover:bg-gray-700 transition-colors duration-200"
                    :class="{
                      'text-gray-500': !day.isCurrentMonth,
                      'text-gray-100': day.isCurrentMonth,
                      'bg-blue-600 text-white': day.isToday,
                      'hover:bg-blue-500': day.isToday
                    }">
              {{ day.date }}
              <!-- Note indicator -->
              <div v-if="day.hasNotes && day.isCurrentMonth" 
                   class="absolute bottom-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
            </button>
          </div>
        </div>
        
        <!-- Desktop Tags Section -->
        <div class="hidden lg:block p-6 flex-1 overflow-y-auto">
          <h3 class="text-lg font-medium text-gray-100 mb-4">Tags</h3>
          
          <div class="space-y-2">
            <button v-for="tag in mockTags" 
                    :key="tag.name"
                    class="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-left">
              <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: tag.color }"></div>
              <span class="text-gray-200 flex-1">{{ tag.name }}</span>
              <span class="text-gray-400 text-sm">{{ tag.count }}</span>
            </button>
          </div>
          
          <!-- Add Tag Button -->
          <button class="mt-4 w-full px-3 py-2 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors duration-200">
            + Add Tag
          </button>
        </div>
      </div>
      
      <!-- Right Column: Note Editor & Feed -->
      <div class="flex-1 flex flex-col min-h-0"
           :class="{ 'hidden lg:flex': activeTab !== 'notes' }">
        
        <!-- Note Composer -->
        <div class="bg-gray-800 border-b border-gray-700 p-4 lg:p-6">
          <div class="max-w-4xl mx-auto">
            <!-- Title Input -->
            <input type="text" 
                   placeholder="Note title..." 
                   class="w-full bg-transparent text-lg lg:text-xl font-medium text-gray-100 placeholder-gray-500 border-none outline-none mb-3 lg:mb-4">
            
            <!-- Content Editor -->
            <div class="min-h-24 lg:min-h-32 p-3 lg:p-4 bg-gray-750 rounded-lg border border-gray-600 focus-within:border-blue-500 transition-colors duration-200">
              <div contenteditable="true" 
                   class="outline-none text-gray-200 placeholder-gray-500 leading-relaxed text-sm lg:text-base"
                   data-placeholder="Start writing your note...">
              </div>
            </div>
            
            <!-- Editor Toolbar -->
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0">
              <div class="flex items-center space-x-4">
                <!-- Tag Selector -->
                <div class="flex items-center space-x-2">
                  <span class="text-sm text-gray-400 hidden sm:inline">Tags:</span>
                  <div class="flex space-x-1">
                    <span class="px-2 py-1 bg-blue-600 text-white text-xs rounded-full">work</span>
                    <button class="px-2 py-1 border border-gray-600 text-gray-400 text-xs rounded-full hover:border-gray-500 transition-colors duration-200">
                      + Add
                    </button>
                  </div>
                </div>
              </div>
              
              <div class="flex items-center justify-between sm:justify-end space-x-3">
                <span class="text-sm text-gray-400">Auto-saving...</span>
                <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 text-sm">
                  Save Note
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Notes Feed -->
        <div class="flex-1 overflow-y-auto p-4 lg:p-6">
          <div class="max-w-4xl mx-auto">
            <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 lg:mb-6 space-y-3 sm:space-y-0">
              <h2 class="text-lg lg:text-xl font-medium text-gray-100">Recent Notes</h2>
              
              <!-- Search & Filter -->
              <div class="flex items-center space-x-3">
                <input type="text" 
                       placeholder="Search notes..." 
                       class="flex-1 sm:flex-none px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-gray-200 placeholder-gray-500 focus:border-blue-500 focus:outline-none transition-colors duration-200 text-sm">
                <button class="px-3 py-2 border border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors duration-200 text-sm whitespace-nowrap">
                  Filter
                </button>
              </div>
            </div>
            
            <!-- Notes List -->
            <div class="space-y-3 lg:space-y-4">
              <div v-for="note in mockNotes" 
                   :key="note.id"
                   class="bg-gray-800 rounded-lg p-4 lg:p-6 border border-gray-700 hover:border-gray-600 transition-colors duration-200 cursor-pointer group">
                
                <!-- Note Header -->
                <div class="flex items-start justify-between mb-2 lg:mb-3">
                  <h3 class="text-base lg:text-lg font-medium text-gray-100 flex-1 mr-2">{{ note.title }}</h3>
                  <div class="text-xs lg:text-sm text-gray-400 whitespace-nowrap">
                    {{ note.date }} • {{ note.time }}
                  </div>
                </div>
                
                <!-- Note Content Preview -->
                <p class="text-gray-300 leading-relaxed mb-3 lg:mb-4 line-clamp-2 lg:line-clamp-3 text-sm lg:text-base">
                  {{ note.content }}
                </p>
                
                <!-- Note Tags and Actions -->
                <div class="flex items-center justify-between">
                  <div class="flex flex-wrap gap-1 lg:gap-2">
                    <span v-for="tag in note.tags" 
                          :key="tag"
                          class="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                      {{ tag }}
                    </span>
                  </div>
                  
                  <!-- Note Actions -->
                  <div class="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button class="text-gray-400 hover:text-gray-300 transition-colors duration-200">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                      </svg>
                    </button>
                    <button class="text-gray-400 hover:text-red-400 transition-colors duration-200">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Load More -->
            <div class="text-center mt-6 lg:mt-8">
              <button class="px-6 py-3 border border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors duration-200 text-sm">
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
