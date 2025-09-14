<template>
  <div class="calendar-component">
    <!-- Calendar Header -->
    <div class="flex items-center justify-between mb-3">
      <h2 v-if="showTitle" class="font-medium text-text-primary-emphasis">{{ title }}</h2>
      <div class="flex items-center gap-1" :class="{ 'ml-auto': !showTitle }">
        <button
          @click="previousMonth"
          class="p-1 hover:bg-bg-hover rounded transition-colors text-text-secondary hover:text-text-primary"
        >
          <Icon name="fluent:chevron-left-20-filled" size="14" />
        </button>
        <button
          @click="nextMonth"
          class="p-1 hover:bg-bg-hover rounded transition-colors text-text-secondary hover:text-text-primary"
        >
          <Icon name="fluent:chevron-right-20-filled" size="14" />
        </button>
      </div>
    </div>
    
    <div class="text-xs font-medium text-text-primary text-center mb-2">
      {{ currentMonthYear }}
    </div>
    
    <!-- Calendar Grid -->
    <div class="grid grid-cols-7 gap-0.5 text-xs">
      <div 
        v-for="day in dayHeaders" 
        :key="day" 
        class="p-1 text-center text-text-secondary font-medium"
      >
        {{ day.slice(0, 1) }}
      </div>
      
      <button
        v-for="dayObj in calendarDays"
        :key="dayObj.key"
        @click="selectDate(dayObj)"
        :class="[
          'p-1 text-center rounded transition-colors relative aspect-square flex items-center justify-center',
          {
            'text-text-secondary': !dayObj.isCurrentMonth,
            'text-text-primary hover:bg-bg-hover': dayObj.isCurrentMonth,
            'bg-primary text-white': selectedDate && isSameDay(dayObj.date, selectedDate),
            'bg-bg-secondary': !selectedDate && dayObj.isToday,
            'font-semibold': dayObj.isToday
          }
        ]"
      >
        {{ dayObj.day }}
        <div 
          v-if="dayObj.hasNotes" 
          class="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-0.5 bg-primary rounded-full"
          :class="{ '!bg-white': selectedDate && isSameDay(dayObj.date, selectedDate) }"
        ></div>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title?: string;
  showTitle?: boolean;
  notes?: Array<{ created_at?: string }>;
  modelValue?: Date | null;
}

interface CalendarDay {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  hasNotes: boolean;
  key: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Calendar',
  showTitle: true,
  notes: () => [],
  modelValue: null
});

const emit = defineEmits<{
  'update:modelValue': [date: Date | null];
  'date-selected': [date: Date | null];
}>();

// Calendar state
const currentDate = ref(new Date());
const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Selected date from v-model
const selectedDate = computed({
  get: () => props.modelValue,
  set: (value) => {
    emit('update:modelValue', value);
    emit('date-selected', value);
  }
});

// Computed properties
const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', { 
    month: 'long', 
    year: 'numeric' 
  });
});

const calendarDays = computed((): CalendarDay[] => {
  const year = currentDate.value.getFullYear();
  const month = currentDate.value.getMonth();
  
  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);
  // First day of the week (Sunday = 0)
  const startDate = new Date(firstDay);
  startDate.setDate(startDate.getDate() - firstDay.getDay());
  
  const days: CalendarDay[] = [];
  const currentDateObj = new Date(startDate);
  
  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    const date = new Date(currentDateObj);
    const isCurrentMonth = date.getMonth() === month;
    const isToday = isSameDay(date, new Date());
    const hasNotes = props.notes.some(note => 
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

// Helper functions
const isSameDay = (date1: Date, date2: Date): boolean => {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
};

// Methods
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

const selectDate = (dayObj: CalendarDay) => {
  if (selectedDate.value && isSameDay(dayObj.date, selectedDate.value)) {
    selectedDate.value = null;
  } else {
    selectedDate.value = dayObj.date;
  }
};

// Expose methods for external use
defineExpose({
  previousMonth,
  nextMonth,
  selectDate: (date: Date) => {
    selectedDate.value = date;
  },
  clearSelection: () => {
    selectedDate.value = null;
  },
  getCurrentMonth: () => currentDate.value,
  setCurrentMonth: (date: Date) => {
    currentDate.value = new Date(date);
  }
});
</script>
