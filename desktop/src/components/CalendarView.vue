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
    <div class="sticky top-0 bg-gradient-to-r from-[var(--color-x-dark)]/95 to-[var(--color-x-darker)]/95 backdrop-blur-xl border-b border-[var(--color-x-border)] z-10 shadow-[0_4px_15px_rgba(0,168,255,0.15)]">
      <div class="px-4 py-4">
        <div class="flex items-center gap-2 mb-3">
          <svg class="w-5 h-5 text-[var(--color-x-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <h2 class="text-lg font-semibold bg-gradient-to-r from-[var(--color-x-text-primary)] to-[var(--color-x-blue)] bg-clip-text text-transparent">
            Time Navigator
          </h2>
        </div>
        
        <!-- Month Navigation -->
        <div class="flex items-center justify-between mb-4">
          <button
            @click="previousMonth"
            class="w-9 h-9 rounded-full bg-[var(--color-x-hover)] hover:bg-[var(--color-x-blue)]/20 flex items-center justify-center transition-all duration-300 text-[var(--color-x-text-primary)] border border-transparent hover:border-[var(--color-x-blue)] hover:shadow-[0_0_15px_rgba(0,168,255,0.5)] group"
          >
            <svg class="w-5 h-5 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"/>
            </svg>
          </button>
          
          <h3 class="text-base font-semibold text-[var(--color-x-text-primary)]">{{ monthName }}</h3>
          
          <button
            @click="nextMonth"
            class="w-9 h-9 rounded-full bg-[var(--color-x-hover)] hover:bg-[var(--color-x-blue)]/20 flex items-center justify-center transition-all duration-300 text-[var(--color-x-text-primary)] border border-transparent hover:border-[var(--color-x-blue)] hover:shadow-[0_0_15px_rgba(0,168,255,0.5)] group"
          >
            <svg class="w-5 h-5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </button>
        </div>
        
        <!-- Day Labels -->
        <div class="grid grid-cols-7 gap-1 mb-2">
          <div v-for="day in ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']" :key="day" 
            class="text-center text-xs font-semibold text-[var(--color-x-blue)] py-1 uppercase tracking-wider">
            {{ day }}
          </div>
        </div>
      </div>
    </div>
    
    <!-- Calendar Grid -->
    <div class="flex-1 overflow-y-auto p-4">
      <div class="grid grid-cols-7 gap-1.5">
        <button
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="selectDate(day)"
          :disabled="!day"
          :class="[
            'aspect-square rounded-xl flex flex-col items-center justify-center text-sm transition-all duration-300 relative group',
            day ? 'hover:bg-[var(--color-x-hover)] hover:scale-105 cursor-pointer border border-transparent' : 'cursor-default',
            isToday(day) && !isSelected(day) ? 'bg-[var(--color-x-blue)]/20 text-[var(--color-x-blue)] font-bold ring-2 ring-[var(--color-x-blue)] shadow-[0_0_15px_rgba(0,168,255,0.4)]' : '',
            isSelected(day) ? 'bg-gradient-to-br from-[var(--color-x-blue)] to-[var(--color-x-nebula-purple)] text-white font-bold shadow-[0_0_20px_rgba(0,168,255,0.6)] scale-105 ring-2 ring-[var(--color-x-blue)]' : 'text-[var(--color-x-text-primary)]',
            !day ? 'text-transparent' : '',
            day && !isToday(day) && !isSelected(day) && getNotesCountForDay(day) > 0 ? 'font-semibold border-[var(--color-x-blue)]/30' : '',
            day && !isSelected(day) ? 'hover:border-[var(--color-x-blue)]/50' : ''
          ]"
        >
          <span class="relative z-10">{{ day || '' }}</span>
          <span 
            v-if="day && getNotesCountForDay(day) > 0"
            :class="[
              'w-1.5 h-1.5 rounded-full mt-1 animate-pulse',
              isSelected(day) ? 'bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]' : 'bg-[var(--color-x-rocket)] shadow-[0_0_8px_rgba(255,107,53,0.8)]'
            ]"
          ></span>
          
          <!-- Hover glow effect -->
          <div v-if="day && !isSelected(day)" class="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--color-x-blue)]/0 to-[var(--color-x-nebula-purple)]/0 group-hover:from-[var(--color-x-blue)]/10 group-hover:to-[var(--color-x-nebula-purple)]/10 transition-all duration-300"></div>
        </button>
      </div>
      
      <!-- Selected Date Info -->
      <div v-if="selectedDate" class="mt-6 p-4 bg-gradient-to-br from-[var(--color-x-hover)] to-[var(--color-x-dark)] rounded-xl border border-[var(--color-x-blue)]/30 shadow-[0_0_20px_rgba(0,168,255,0.2)]">
        <div class="text-sm text-[var(--color-x-blue)] mb-2 font-semibold flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
          </svg>
          <span>Viewing Timeline</span>
        </div>
        <div class="font-semibold text-[var(--color-x-text-primary)] mb-3">
          {{ selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }) }}
        </div>
        <button
          @click="emit('update:selectedDate', null)"
          class="w-full px-4 py-2 text-sm font-semibold text-[var(--color-x-blue)] bg-[var(--color-x-blue)]/10 hover:bg-[var(--color-x-blue)]/20 rounded-lg transition-all duration-300 border border-[var(--color-x-blue)]/30 hover:border-[var(--color-x-blue)] hover:shadow-[0_0_15px_rgba(0,168,255,0.3)]"
        >
          Clear Timeline Filter
        </button>
      </div>
    </div>
  </div>
</template>
