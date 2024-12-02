<template>
  <div v-for="tag in selectedTags" class="flex flex-wrap gap-1 mb-4">
    <Chip :text="tag.name" :color="tag.color" has-close-btn @close="handleRemoveTag(tag.id)" />
  </div>

  <div class="relative min-w-[13rem]">
    <div @click="handleTogglePopup" class="flex items-center justify-between bg-bg rounded p-2 border border-bg-border">
      <input ref="inputRef" @input="handleInputChange" @keydown="handleKeyDown" :value="searchText"
        class="flex-grow mr-2 bg-bg text-text-primary outline-none" />
      <div>
        <button @click.stop="handleTogglePopup" class="p-2 flex items-center justify-center text-text-primary"
          tabindex="-1">
          <Icon name="fa-solid:chevron-down" />
        </button>
      </div>
    </div>

    <div v-if="showPopup && filteredTags.length" ref="popupRef"
      :class="{ 'absolute top-full left-0 mt-2 w-full bg-bg-secondary text-text-secondary': true, 'hidden': !showPopup, 'block': showPopup }">
      <div class="max-h-[12.9375rem] overflow-y-auto p-1">
        <button v-for="tag in filteredTags" @click="() => handleSelectTag(tag)" class="block w-full text-left p-3 text-text-secondary
        hover:bg-bg-secondary-hover">
          {{ tag.name }}
        </button>
      </div>

      <button v-if="!hasMatch && searchText" @click="() => handleCreateTag({ name: searchText, id: -1 })"
        class="block w-full text-left p-3">
        Create "{{ searchText }}"
      </button>
    </div>

  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tags: Tag[]
}>();
const selectedTags = ref<Tag[]>([...props.tags]);
const { tags } = useNotes();
const inputRef = ref<HTMLInputElement>();
const popupRef = ref<HTMLDivElement>();
const searchText = ref('');
const showPopup = ref(false);
const filteredTags = ref<Tag[]>([...tags.value]);
const hasMatch = ref(false);

const emits = defineEmits(['selectedTags'])

watch(() => searchText.value, (newValue) => {
  if (!newValue) {
    filteredTags.value = [];
    hasMatch.value = false;
    return;
  }

  const lowerCaseSearchText = newValue.toLowerCase();
  const matchedTags = tags.value.filter(tag => tag.name.toLowerCase().includes(lowerCaseSearchText));
  filteredTags.value = matchedTags;
  hasMatch.value = matchedTags.length > 0;
});

function handleRemoveTag(tagId: number) {
  selectedTags.value = selectedTags.value.filter(tag => tag.id !== tagId) 
}

function handleTogglePopup(event: Event) {
  if (event.target === inputRef.value) {
    showPopup.value = true;
    return;
  }

  filteredTags.value = [...tags.value];
  showPopup.value = !showPopup.value;
}

function handleInputChange(event: Event) {
  searchText.value = (event.target as HTMLInputElement).value;
}

function handleKeyDown() {

}

function handleSelectTag(tag: Tag) {
  selectedTags.value = [...selectedTags.value, tag];
  searchText.value = '';
  showPopup.value = false;
  emits('selectedTags', selectedTags.value);
}

function handleCreateTag(tag: Tag) {
  selectedTags.value = [...selectedTags.value, tag];
  searchText.value = '';
  showPopup.value = false;
}
</script>
