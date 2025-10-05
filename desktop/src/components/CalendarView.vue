<script setup lang="ts">
import { computed } from 'vue';

interface Note {
  id: number;
  content: string;
  createdAt: Date;
}

interface Props {
  notes: Note[];
  selectedDate: Date | null;
  currentMonth: Date;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:selectedDate': [date: Date | null];
  'update:currentMonth': [date: Date];
}>();

// Calendar computations
const daysInMonth = computed(() => {
  const year = props.currentMonth.getFullYear();
  const month = props.currentMonth.getMonth();
  return new Date(year, month + 1, 0).getDate();
});

const firstDayOfMonth = computed(() => {
  const year = props.currentMonth.getFullYear();
  const month = props.currentMonth.getMonth();
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
  return props.currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
});

const getNotesCountForDay = (day: number | null): number => {
  if (!day) return 0;
  
  const year = props.currentMonth.getFullYear();
  const month = props.currentMonth.getMonth();
  const date = new Date(year, month, day);
  
  return props.notes.filter(note => {
    const noteDate = new Date(note.createdAt);
    return noteDate.toDateString() === date.toDateString();
  }).length;
};

const isToday = (day: number | null): boolean => {
  if (!day) return false;
  
  const today = new Date();
  const year = props.currentMonth.getFullYear();
  const month = props.currentMonth.getMonth();
  const date = new Date(year, month, day);
  
  return date.toDateString() === today.toDateString();
};

const isSelected = (day: number | null): boolean => {
  if (!day || !props.selectedDate) return false;
  
  const year = props.currentMonth.getFullYear();
  const month = props.currentMonth.getMonth();
  const date = new Date(year, month, day);
  
  return date.toDateString() === props.selectedDate.toDateString();
};

const selectDate = (day: number | null) => {
  if (!day) return;
  
  const year = props.currentMonth.getFullYear();
  const month = props.currentMonth.getMonth();
  const date = new Date(year, month, day);
  
  if (props.selectedDate?.toDateString() === date.toDateString()) {
    emit('update:selectedDate', null); // Deselect if clicking the same date
  } else {
    emit('update:selectedDate', date);
  }
};

const previousMonth = () => {
  emit('update:currentMonth', new Date(props.currentMonth.getFullYear(), props.currentMonth.getMonth() - 1));
};

const nextMonth = () => {
  emit('update:currentMonth', new Date(props.currentMonth.getFullYear(), props.currentMonth.getMonth() + 1));
};
</script>

<template>
  <div class="flex flex-col h-full border-b border-white/30">
    <!-- Calendar Header -->
    <div class="px-4 py-3 border-b border-white/30 glass-dark">
      <div class="flex items-center gap-2 mb-3">
        <svg class="w-4 h-4 text-x-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
          <path stroke-linecap="round" stroke-linejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
        </svg>
        <h2 class="text-sm font-semibold text-x-text-primary">
          Calendar
        </h2>
      </div>
      
      <!-- Month Navigation -->
      <div class="flex items-center justify-between">
        <button
          @click="previousMonth"
          class="p-1.5 rounded hover:bg-white/60 dark:hover:bg-white/20 text-x-text-secondary hover:text-x-text-primary transition-all backdrop-blur-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7"/>
          </svg>
        </button>
        
        <h3 class="text-sm font-medium text-x-text-primary">{{ monthName }}</h3>
        
        <button
          @click="nextMonth"
          class="p-1.5 rounded hover:bg-white/60 dark:hover:bg-white/20 text-x-text-secondary hover:text-x-text-primary transition-all backdrop-blur-sm"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
    </div>
    
    <!-- Calendar Grid -->
    <div class="p-4">
      <!-- Day Labels -->
      <div class="grid grid-cols-7 gap-1 mb-2">
        <div v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']" :key="day" 
          class="text-center text-xs font-medium text-x-text-muted">
          {{ day }}
        </div>
      </div>
      
      <!-- Days -->
      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="selectDate(day)"
          :disabled="!day"
          :class="[
            'aspect-square rounded-md flex flex-col items-center justify-center text-xs transition-all relative backdrop-blur-sm',
            day ? 'hover:bg-white/60 dark:hover:bg-white/10 cursor-pointer' : 'cursor-default',
            isToday(day) && !isSelected(day) ? 'bg-x-text-secondary/10 text-x-text-primary font-semibold ring-1 ring-x-text-secondary' : '',
            isSelected(day) ? 'bg-x-black text-white font-semibold shadow-lg' : day ? 'text-x-text-primary' : 'text-transparent',
            day && !isToday(day) && !isSelected(day) && getNotesCountForDay(day) > 0 ? 'font-medium' : ''
          ]"
        >
          <span>{{ day || '' }}</span>
          <span 
            v-if="day && getNotesCountForDay(day) > 0"
            :class="[
              'w-1 h-1 rounded-full mt-0.5',
              isSelected(day) ? 'bg-white' : 'bg-x-text-primary'
            ]"
          ></span>
        </button>
      </div>
      
      <!-- Selected Date Info -->
      <div v-if="selectedDate" class="mt-4 p-3 glass-dark rounded-lg border border-white/30">
        <div class="text-xs text-x-text-secondary mb-1">
          Filtering by date
        </div>
        <div class="text-sm font-medium text-x-text-primary mb-2">
          {{ selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) }}
        </div>
        <button
          @click="emit('update:selectedDate', null)"
          class="w-full px-3 py-1.5 text-xs font-medium text-x-blue hover:bg-white/60 dark:hover:bg-white/20 rounded transition-all backdrop-blur-sm"
        >
          Clear filter
        </button>
      </div>
    </div>
  </div>
</template>
