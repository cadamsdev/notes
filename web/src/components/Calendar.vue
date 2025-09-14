<script setup lang="ts">
import { computed } from 'vue';

interface CalendarDay {
  date: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasNotes: boolean;
}

interface Props {
  currentDate?: Date;
  noteDates?: string[]; // Array of dates that have notes (YYYY-MM-DD format)
}

const props = withDefaults(defineProps<Props>(), {
  currentDate: () => new Date(),
  noteDates: () => []
});

const emit = defineEmits<{
  dayClick: [date: Date];
}>();

// Current month display
const currentMonth = computed(() => 
  props.currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })
);

// Generate calendar days
const calendarDays = computed((): CalendarDay[] => {
  const year = props.currentDate.getFullYear();
  const month = props.currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days: CalendarDay[] = [];
  const today = new Date();
  
  for (let i = 0; i < 42; i++) {
    const day = new Date(startDate);
    day.setDate(startDate.getDate() + i);
    
    const dateString = day.toISOString().split('T')[0];
    const hasNotes = props.noteDates.includes(dateString);
    
    days.push({
      date: day.getDate(),
      isCurrentMonth: day.getMonth() === month,
      isToday: day.toDateString() === today.toDateString(),
      hasNotes
    });
  }
  return days;
});

const handleDayClick = (dayIndex: number) => {
  const year = props.currentDate.getFullYear();
  const month = props.currentDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const clickedDate = new Date(startDate);
  clickedDate.setDate(startDate.getDate() + dayIndex);
  
  emit('dayClick', clickedDate);
};
</script>

<template>
  <div class="calendar">
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
              @click="handleDayClick(index)"
              class="relative text-center rounded hover:bg-gray-700 transition-colors duration-200"
              :class="[
                'h-8 lg:h-10',
                {
                  'text-gray-500': !day.isCurrentMonth,
                  'text-gray-100': day.isCurrentMonth,
                  'bg-blue-600 text-white hover:bg-blue-500': day.isToday,
                }
              ]">
        {{ day.date }}
        
        <!-- Note indicator -->
        <div v-if="day.hasNotes && day.isCurrentMonth" 
             class="absolute bottom-0.5 lg:bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-400 rounded-full"></div>
      </button>
    </div>
  </div>
</template>

