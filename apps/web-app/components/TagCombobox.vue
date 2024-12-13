<template>
  <div v-if="selectedTags.length" class="flex flex-wrap gap-1 mb-4">
    <Chip v-for="tag in selectedTags" :text="tag.name" :color="tag.color" has-close-btn @close="handleRemoveTag(tag.id)" />
  </div>

  <div class="relative min-w-[13rem]">
    <div class="flex items-center justify-between bg-bg rounded p-2 border border-bg-border">
      <input ref="inputRef" @input="handleInputChange" @focus.stop="handleFocus" @keydown="handleKeyDown"
        :value="searchText" class="flex-grow mr-2 bg-bg text-text-primary outline-none" autocomplete="off" spellcheck="false" />
      <div>
        <button @click.stop="handleTogglePopup" class="p-2 flex items-center justify-center text-text-primary"
          tabindex="-1">
          <Icon name="fa-solid:chevron-down" />
        </button>
      </div>
    </div>

    <div v-if="showPopup" ref="popupRef"
      :class="{ 'absolute top-full left-0 mt-2 w-full bg-bg-secondary text-text-secondary': true, 'hidden': !showPopup, 'block': showPopup }">
      <div v-if="filteredTags.length" class="max-h-[12.9375rem] overflow-y-auto p-1">
        <button v-for="tag in filteredTags" @click="() => handleSelectTag(tag)" class="block w-full text-left p-3 text-text-secondary
        hover:bg-bg-secondary-hover">
          {{ tag.name }}
        </button>
      </div>

      <button v-if="!hasMatch && searchText" @click="handleCreateTag"
        class="block w-full text-left p-3">
        Create "{{ searchText }}"
      </button>
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

function handleKeyDown() {

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
