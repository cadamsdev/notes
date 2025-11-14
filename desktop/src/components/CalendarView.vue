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
  return props.currentMonth.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });
});

const getNotesCountForDay = (day: number | null): number => {
  if (!day) return 0;

  const year = props.currentMonth.getFullYear();
  const month = props.currentMonth.getMonth();
  const date = new Date(year, month, day);

  return props.notes.filter((note) => {
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
  emit(
    'update:currentMonth',
    new Date(
      props.currentMonth.getFullYear(),
      props.currentMonth.getMonth() - 1,
    ),
  );
};

const nextMonth = () => {
  emit(
    'update:currentMonth',
    new Date(
      props.currentMonth.getFullYear(),
      props.currentMonth.getMonth() + 1,
    ),
  );
};
</script>

<template>
  <div class="calendar-container">
    <!-- Calendar Header -->
    <div class="calendar-header">
      <div class="header-title">
        <svg
          class="title-icon"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          stroke-width="2"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          />
        </svg>
        <h2 class="title-text">Calendar</h2>
      </div>

      <!-- Month Navigation -->
      <div class="month-navigation">
        <button @click="previousMonth" class="nav-button">
          <svg
            class="nav-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <h3 class="month-name">{{ monthName }}</h3>

        <button @click="nextMonth" class="nav-button">
          <svg
            class="nav-icon"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Calendar Grid -->
    <div class="calendar-grid">
      <!-- Day Labels -->
      <div class="day-labels">
        <div
          v-for="day in ['S', 'M', 'T', 'W', 'T', 'F', 'S']"
          :key="day"
          class="day-label"
        >
          {{ day }}
        </div>
      </div>

      <!-- Days -->
      <div class="days-grid">
        <button
          v-for="(day, index) in calendarDays"
          :key="index"
          @click="selectDate(day)"
          :disabled="!day"
          :class="[
            'day-cell',
            { 'day-today': isToday(day) && !isSelected(day) },
            { 'day-selected': isSelected(day) },
            {
              'day-has-notes':
                day &&
                !isToday(day) &&
                !isSelected(day) &&
                getNotesCountForDay(day) > 0,
            },
          ]"
        >
          <span>{{ day || '' }}</span>
          <span
            v-if="day && getNotesCountForDay(day) > 0"
            :class="[
              'note-indicator',
              { 'note-indicator-selected': isSelected(day) },
            ]"
          ></span>
        </button>
      </div>

      <!-- Selected Date Info -->
      <div v-if="selectedDate" class="selected-date-info">
        <div class="info-label">Filtering by date</div>
        <div class="info-date">
          {{
            selectedDate.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          }}
        </div>
        <button
          @click="emit('update:selectedDate', null)"
          class="clear-filter-button"
        >
          Clear filter
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.calendar-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-bottom: 1px solid var(--color-border);
}

.calendar-header {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-surface);
}

.header-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
}

.title-icon {
  width: 1rem;
  height: 1rem;
  color: var(--color-text-secondary);
}

.title-text {
  font-size: 0.875rem;
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.month-navigation {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.nav-button {
  padding: 0.375rem;
  border-radius: 0.25rem;
  color: var(--color-text-secondary);
  transition: all 0.2s;
}

.nav-button:hover {
  background-color: var(--color-surface-hover);
  color: var(--color-text-primary);
}

.nav-icon {
  width: 1rem;
  height: 1rem;
}

.month-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.calendar-grid {
  padding: 1rem;
}

.day-labels {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.day-label {
  text-align: center;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.25rem;
}

.day-cell {
  aspect-ratio: 1;
  border-radius: 0.375rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  transition: all 0.2s;
  position: relative;
  color: var(--color-text-primary);
}

.day-cell:not(:disabled) {
  cursor: pointer;
}

.day-cell:not(:disabled):not(.day-selected):hover {
  background-color: var(--color-surface-hover);
}

.day-cell:disabled {
  color: transparent;
  cursor: default;
}

.day-today {
  background-color: var(--color-surface);
  font-weight: var(--font-weight-semibold);
  box-shadow: 0 0 0 1px var(--color-border);
}

.day-selected {
  background-color: var(--color-text-primary);
  color: var(--color-background);
  font-weight: var(--font-weight-semibold);
  box-shadow:
    0 10px 15px -3px rgba(0, 0, 0, 0.1),
    0 4px 6px -2px rgba(0, 0, 0, 0.05);
}

.day-selected:hover {
  background-color: var(--color-text-secondary) !important;
}

.day-has-notes {
  font-weight: 500;
}

.note-indicator {
  width: 0.25rem;
  height: 0.25rem;
  border-radius: 50%;
  margin-top: 0.125rem;
  background-color: var(--color-text-primary);
}

.note-indicator-selected {
  background-color: var(--color-background);
}

.selected-date-info {
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: var(--color-surface);
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
}

.info-label {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-bottom: 0.25rem;
}

.info-date {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
  margin-bottom: 0.5rem;
}

.clear-filter-button {
  width: 100%;
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-primary);
  border-radius: 0.25rem;
  transition: all 0.2s;
}

.clear-filter-button:hover {
  background-color: var(--color-surface-hover);
}
</style>
