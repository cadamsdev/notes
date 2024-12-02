<template>
  <div v-for="tag in newTags" class="flex flex-wrap gap-1 mb-4">
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
  </div>

  <div v-if="filteredTags.length || (!hasMatch && searchText)" ref="popupRef" class="clsx('absolute top-full left-0 mt-2 w-full bg-bg-secondary text-text-secondary',
    { 'hidden' : !showPopup, 'block' : showPopup })">
    <div class="max-h-[12.9375rem] overflow-y-auto p-1">
      <button v-for="tag in filteredTags" @click="(e)=> handleSelectTag(e, tag)" class="block w-full text-left p-3 text-text-secondary
        hover:bg-bg-secondary-hover">
        {{ tag.name }}
      </button>
    </div>

    <button v-if="!hasMatch && searchText" @click="(e)=> handleCreateTag(e, { name: searchText, id: -1 })"
      class="block w-full text-left p-3"
      >
      Create "{{ searchText }}"
    </button>
  </div>
</template>

<script setup lang="ts">
import clsx from 'clsx';
const props = defineProps<{
  tags: Tag[]
}>();
const newTags = ref<Tag[]>([...props.tags]);
const { tags } = useNotes();
const inputRef = ref<HTMLInputElement>();
const popupRef = ref<HTMLDivElement>();
const searchText = ref('');
const showPopup = ref(false);
const filteredTags = ref<Tag[]>([]);
const hasMatch = ref(false);

watch(() => searchText.value, (newValue) => {
  console.log('searchText changed', newValue);
});

function handleRemoveTag(tagId: number) {
  newTags.value = newTags.value.filter(tag => tag.id !== tagId) 
}

function handleTogglePopup(event: Event) {
  if (event.target === inputRef.value) {
    showPopup.value = true;
    return;
  }

  showPopup.value = !showPopup;
}

function handleInputChange() {

}

function handleKeyDown() {

}

function handleSelectTag(event: Event, tag: Tag) {
  newTags.value = [...newTags.value, tag];
  searchText.value = '';
  showPopup.value = false;
}

function handleCreateTag(event: Event, tag: Tag) {
  newTags.value = [...newTags.value, tag];
  searchText.value = '';
  showPopup.value = false;
}
</script>
