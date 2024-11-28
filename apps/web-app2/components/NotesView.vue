<template>
  <div class="bg-bg w-[20rem] border-r border-bg-border">
    <div>
      <div class="p-4">
        <div class="flex justify-end mb-4">
          <button @click="handleCreateNote" class="bg-bg text-text-primary p-2 rounded hover:bg-bg-hover">
            <Icon name="fa-solid:plus" />
          </button>
        </div>
        <SearchInput @search="handleSearch" placeholder="Search..." />

        <!-- <div v-if="selectedTags.length" class="mt-2 flex flex-wrap gap-1">
          <Chip v-for="filteredTag in selectedTags" :key="filteredTag.id" :text="filteredTag.name"
            :color="filteredTag.color" hasCloseBtn @close="removeTag(filteredTag.id)" />
        </div> -->
      </div>
      <div class="overflow-y-auto min-h-screen">
        <button v-for="(note, index) in filteredNotes" :key="note.id" :id="`note-${note.id}`"
          :class="noteClass(note.id)" @click="selectNote(note)">
          <div class="mb-3 text-text-primary-emphasis">{{ note.title }}</div>
          <div class="flex flex-wrap gap-1">
            <Chip v-for="tag in note.tags ?? []" :key="tag.id" :text="tag.name" :color="tag.color" />
          </div>
          <!-- <ContextMenu :targetId="`note-${note.id}`"
            :actions="[{ label: 'Remove', action: () => handleShowRemoveNoteDialog(note, index) }]" /> -->
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import clsx from 'clsx';
const { data } = useNotes();

const selectedTags = ref([])
const filteredNotes = ref([])
const route = useRoute()

watch(data, (newValue) => {
  filteredNotes.value = newValue;
});

const handleCreateNote = async () => {
  // Implement your note creation logic here
}

const handleSearch = (event: { text: string }) => {
  // Implement your search logic here
}

const removeTag = (tagId: number) => {
  selectedTags.value = selectedTags.value.filter(tag => tag.id !== tagId)
}

const selectNote = (note: any) => {
  // Implement your note selection logic here
}

const handleShowRemoveNoteDialog = (note: any, index: number) => {
  // Implement your remove note dialog logic here
}

const noteClass = (noteId: number) => {
  return clsx('block w-full text-left p-4 border-b border-bg-secondary text-base', {
    'bg-bg-secondary': +route.params.id === noteId,
    'hover:bg-bg-secondary': +route.params.id !== noteId,
  })
}
</script>

