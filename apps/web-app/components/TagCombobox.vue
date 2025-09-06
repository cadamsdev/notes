<template>
  <!-- Selected tags display -->
  <div v-if="selectedTags.length" class="flex flex-wrap gap-2 mb-4">
    <Chip 
      v-for="tag in selectedTags" 
      :key="tag.id"
      :text="tag.name" 
      :color="tag.color" 
      has-close-btn 
      @close="handleRemoveTag(tag.id)" 
    />
  </div>

  <!-- Tag input combobox -->
  <div class="relative min-w-[13rem]">
    <div class="relative">
      <input 
        ref="inputRef" 
        @input="handleInputChange" 
        @focus.stop="handleFocus" 
        @keydown="handleKeyDown"
        :value="searchText" 
        class="w-full bg-bg-secondary hover:bg-bg-secondary-hover focus:bg-bg-secondary border border-bg-border focus:border-primary rounded-xl px-4 py-3 pr-12 text-text-primary placeholder-text-secondary outline-none transition-all duration-200 text-sm" 
        placeholder="Add tags..."
        autocomplete="off" 
        spellcheck="false" 
      />
      <button 
        @click.stop="handleTogglePopup" 
        class="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-text-secondary hover:text-text-primary transition-colors duration-200"
        tabindex="-1"
      >
        <Icon 
          name="fluent:chevron-down-20-filled" 
          size="16" 
          :class="{ 'rotate-180': showPopup }"
          class="transition-transform duration-200"
        />
      </button>
    </div>

    <!-- Dropdown popup -->
    <div 
      v-if="showPopup" 
      ref="popupRef"
      class="absolute top-full left-0 mt-2 w-full bg-bg-secondary border border-bg-border rounded-xl shadow-2xl z-50 overflow-hidden"
    >
      <!-- Available tags -->
      <div v-if="filteredTags.length" class="max-h-48 overflow-y-auto">
        <button 
          v-for="tag in filteredTags" 
          :key="tag.id"
          @click="() => handleSelectTag(tag)" 
          class="w-full text-left px-4 py-3 text-text-primary hover:bg-bg-hover transition-colors duration-150 border-b border-bg-border last:border-b-0 text-sm flex items-center gap-3"
        >
          <ColorDot :color="tag.color" :size="8" />
          <span>{{ tag.name }}</span>
        </button>
      </div>

      <!-- Create new tag option -->
      <button 
        v-if="!hasMatch && searchText" 
        @click="handleCreateTag"
        class="w-full text-left px-4 py-3 text-primary hover:bg-bg-hover transition-colors duration-150 border-t border-bg-border text-sm flex items-center gap-3"
      >
        <div class="w-2 h-2 rounded-full bg-primary flex-shrink-0"></div>
        <span>Create "<span class="font-medium">{{ searchText }}</span>"</span>
      </button>

      <!-- Empty state -->
      <div 
        v-if="!filteredTags.length && !searchText" 
        class="px-4 py-6 text-center text-text-secondary text-sm"
      >
        <Icon name="fluent:tag-20-regular" size="24" class="mx-auto mb-2 opacity-50" />
        <p>No tags available</p>
      </div>

      <div 
        v-if="!filteredTags.length && searchText && hasMatch" 
        class="px-4 py-6 text-center text-text-secondary text-sm"
      >
        <Icon name="fluent:search-20-regular" size="24" class="mx-auto mb-2 opacity-50" />
        <p>No tags found for "{{ searchText }}"</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
const props = defineProps<{
  tags: Tag[]
}>();
const { tags: allTags } = useNotes();
const selectedTags = ref<Tag[]>([...props.tags]);
const filteredTags = ref<Tag[]>([]);
const inputRef = ref<HTMLInputElement>();
const popupRef = ref<HTMLDivElement>();
const searchText = ref('');
const showPopup = ref(false);
const hasMatch = ref(filteredTags.value.some(tag => tag.name.toLowerCase() === searchText.value.toLowerCase()));

const emits = defineEmits(['selectedTags'])

onClickOutside(popupRef, () => {
  showPopup.value = false;
});

watch([searchText, selectedTags], ([newValue]) => {
  const lowerCaseSearchText = newValue.toLowerCase();
  filteredTags.value = getFilteredTags(newValue);
  hasMatch.value = filteredTags.value.some(tag => tag.name.toLowerCase() === lowerCaseSearchText);
});

onMounted(() => {
  filteredTags.value = getFilteredTags(searchText.value);
  inputRef.value?.focus();
});

function getFilteredTags(searchText: string): Tag[] {
  const searchTextToLower = searchText.toLowerCase();
  if (!searchTextToLower) {
    return [...allTags.value].filter(tag => !selectedTags.value.some(selectedTag => selectedTag.id === tag.id));
  }

  return [...allTags.value]
    .filter(tag => !selectedTags.value.some(selectedTag => selectedTag.id === tag.id) && tag.name.toLowerCase().includes(searchTextToLower));
}

function handleRemoveTag(tagId: number) {
  selectedTags.value = selectedTags.value.filter(tag => tag.id !== tagId);
  emits('selectedTags', selectedTags.value);
}

function handleTogglePopup() {
  showPopup.value = !showPopup.value;
}

function handleInputChange(event: Event) {
  searchText.value = (event.target as HTMLInputElement).value;
}

function handleKeyDown(event: KeyboardEvent) {
  // Close popup on Escape
  if (event.key === 'Escape') {
    showPopup.value = false;
    searchText.value = '';
  }
  // Open popup on ArrowDown
  if (event.key === 'ArrowDown' && !showPopup.value) {
    showPopup.value = true;
  }
  // Create tag on Enter if no match and search text exists
  if (event.key === 'Enter' && !hasMatch.value && searchText.value) {
    event.preventDefault();
    handleCreateTag();
  }
}

function handleFocus() {
  showPopup.value = true;
}

function handleSelectTag(tag: Tag) {
  selectedTags.value = [...selectedTags.value, tag];
  searchText.value = '';
  showPopup.value = false;
  emits('selectedTags', selectedTags.value);
}

function handleCreateTag() {
  const newTag: Tag = { name: searchText.value, id: -1 };
  selectedTags.value = [...selectedTags.value, newTag];
  searchText.value = '';
  showPopup.value = false;
  emits('selectedTags', selectedTags.value);
}
</script>
