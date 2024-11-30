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

        <div v-if="selectedTags.length" class="mt-2 flex flex-wrap gap-1">
          <Chip v-for="filteredTag in selectedTags" :key="filteredTag.id" :text="filteredTag.name"
            :color="filteredTag.color" hasCloseBtn @close="removeSelectedTag(filteredTag.id)" />
        </div>
      </div>
      <div class="overflow-y-auto min-h-screen">
        <button v-for="(note) in filteredData" :key="note.id" :id="`note-${note.id}`"
          :class="noteClass(note.id)" @click="selectNote(note)">
          <div class="mb-3 text-text-primary-emphasis">{{ note.title }}</div>
          <div class="flex flex-wrap gap-1">
            <Chip v-for="tag in note.tags ?? []" :key="tag.id" :text="tag.name" :color="tag.color" />
          </div>
          <ContextMenu :targetId="`note-${note.id}`"
            :actions="[{ label: 'Remove', action: () => handleShowRemoveNoteDialog(note) }]" />
        </button>
      </div>
    </div>
  </div>

  <ConfirmationDialog :id="MODAL_REMOVE_NOTE" @action="handleRemoveNote" />
</template>

<script setup lang="ts">
import clsx from 'clsx';
const { filteredData, searchNotes, createNote, deleteNote } = useNotes();
const { selectedTags, removeSelectedTag } = useTags();
const { openModal } = useModal();
const router = useRouter();

const searchText = ref<string>('')
const noteToDelete = ref<Note | null>(null)
const route = useRoute()
const MODAL_REMOVE_NOTE = 'MODAL_REMOVE_NOTE';

watch(() => selectedTags.value, () => {
  searchNotes(searchText.value);
});

watch(filteredData.value, (newValue) => {
  console.log('detected filteredData change')
  console.log(newValue)
});

const handleCreateNote = async () => {
  await createNote();
}

const handleSearch = (event: { text: string }) => {
  searchText.value = event.text;
  searchNotes(event.text);
}

const selectNote = (note: any) => {
  router.push(`/note/${note.id}`);
}

const handleShowRemoveNoteDialog = (note: Note) => {
  noteToDelete.value = note;
  openModal(MODAL_REMOVE_NOTE);
}

const handleRemoveNote = async () => {
  const note = noteToDelete.value;
  if (!note) {
    return;
  }

  await deleteNote(note.id);
}

const noteClass = (noteId: number) => {
  return clsx('block w-full text-left p-4 border-b border-bg-secondary text-base', {
    'bg-bg-secondary': +route.params.id === noteId,
    'hover:bg-bg-secondary': +route.params.id !== noteId,
  })
}
</script>

