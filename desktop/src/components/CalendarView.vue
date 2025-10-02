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
  <div class="flex flex-col h-full">
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
          @click="emit('update:selectedDate', null)"
          class="mt-2 text-sm text-[var(--color-x-blue)] hover:underline"
        >
          Clear filter
        </button>
      </div>
    </div>
  </div>
</template>
