<template>
  <div class="relative group">
    <!-- Search Icon -->
    <div class="absolute left-4 top-1/2 -translate-y-1/2 z-10 transition-colors duration-200"
         :class="[
           isFocused || searchText 
             ? 'text-primary' 
             : 'text-text-muted group-hover:text-text-secondary'
         ]">
      <Icon name="fluent:search-20-filled" size="20" />
    </div>
    
    <!-- Search Input -->
    <input 
      ref="inputRef"
      v-model="searchText" 
      v-bind="attrs"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      @keydown.escape="handleEscape"
      placeholder="Search notes..."
      autocomplete="off" 
      spellcheck="false"
      class="w-full h-12 pl-12 pr-12 bg-bg-secondary border border-bg-border rounded-full text-text-primary placeholder-text-muted transition-all duration-200 ease-out focus:outline-none focus:ring-2 focus:ring-primary-soft focus:border-primary/50 focus:bg-bg-tertiary hover:bg-bg-tertiary hover:border-bg-border-hover"
    />
    
    <!-- Clear Button -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-75"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-75"
    >
      <button 
        v-if="searchText"
        @click="clearSearch"
        class="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-secondary-soft hover:bg-text-muted/20 text-text-muted hover:text-text-secondary transition-all duration-200 ease-out hover:scale-110 active:scale-95"
        title="Clear search"
        tabindex="-1"
      >
        <Icon name="fluent:dismiss-20-filled" size="16" />
      </button>
    </Transition>
    
    <!-- Search Results Count (when searching) -->
    <Transition
      enter-active-class="transition-all duration-300 ease-out delay-100"
      enter-from-class="opacity-0 translate-y-2"
      enter-to-class="opacity-100 translate-y-0"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 translate-y-0"
      leave-to-class="opacity-0 translate-y-2"
    >
      <div 
        v-if="searchText && showResultsCount"
        class="absolute top-full left-0 right-0 mt-2 px-4 py-2 bg-card-bg border border-card-border rounded-lg shadow-lg z-20"
      >
        <div class="flex items-center gap-2 text-sm text-text-muted">
          <Icon name="fluent:info-20-filled" size="16" />
          <span v-if="resultCount !== null">
            {{ resultCount }} {{ resultCount === 1 ? 'note' : 'notes' }} found
          </span>
          <span v-else class="flex items-center gap-1">
            <Icon name="fluent:spinner-ios-20-filled" size="16" class="animate-spin" />
            Searching...
          </span>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
interface Props {
  showResultsCount?: boolean;
  resultCount?: number | null;
}

const props = withDefaults(defineProps<Props>(), {
  showResultsCount: false,
  resultCount: null
});

const emits = defineEmits(['search']);
const attrs = useAttrs();

// Reactive state
const searchText = ref('');
const isFocused = ref(false);
const inputRef = ref<HTMLInputElement>();

// Methods
function clearSearch() {
  searchText.value = '';
  emits('search', { text: searchText.value });
  inputRef.value?.focus();
}

function handleInput() {
  emits('search', { text: searchText.value.toLowerCase() });
}

function handleFocus() {
  isFocused.value = true;
}

function handleBlur() {
  isFocused.value = false;
}

function handleEscape() {
  if (searchText.value) {
    clearSearch();
  } else {
    inputRef.value?.blur();
  }
}

// Expose focus method for parent components
defineExpose({
  focus: () => inputRef.value?.focus(),
  blur: () => inputRef.value?.blur(),
  clear: clearSearch
});
</script>
