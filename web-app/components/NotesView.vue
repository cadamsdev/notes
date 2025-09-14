<template>
  <div class="bg-bg w-[20rem] min-w-[20rem] border-r border-bg-border">
    <div>
      <div class="p-4">
        <div class="flex justify-end mb-4">
          <button @click="handleCreateNote" class="bg-bg text-text-primary p-2 rounded hover:bg-bg-hover">
            <Icon name="fa-solid:plus" />
          </button>
        </div>
        <SearchInput 
          @search="handleSearch" 
          placeholder="Search notes..." 
          :show-results-count="!!searchText"
          :result-count="searchText ? filteredNotes.length : null"
        />

        <div v-if="selectedTags.length" class="mt-2 flex flex-wrap gap-1">
          <Chip v-for="filteredTag in selectedTags" :key="filteredTag.id" :text="filteredTag.name"
            :color="filteredTag.color" hasCloseBtn @close="removeSelectedTag(filteredTag.id)" />
        </div>
      </div>
      <div class="overflow-y-auto min-h-[calc(100vh-136px)] max-h-[calc(100vh-136px)]">
        <button v-for="(note) in filteredNotes" :key="note.id" :id="`note-${note.id}`"
          :class="{ 'block w-full text-left p-4 border-b border-bg-secondary text-base': true, 'bg-bg-secondary': +route.params.id === note.id, 'hover:bg-bg-secondary': +route.params.id !== note.id }"
          @click="selectNote(note)">
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
const { searchNotes, createNote, deleteNote, selectedTags, removeSelectedTag, tags, notes } = useNotes();
const { openModal } = useModal();
const { settings } = useSettings();
const router = useRouter();

const filteredNotes = ref<Note[]>([]);
const searchText = ref<string>('')
const noteToDelete = ref<Note | null>(null)
const route = useRoute()
const MODAL_REMOVE_NOTE = 'MODAL_REMOVE_NOTE';

watch([searchText, selectedTags, tags, settings, notes], () => {
  filteredNotes.value = searchNotes(searchText.value);
});

onMounted(() => {
  filteredNotes.value = searchNotes(searchText.value);
});

const handleCreateNote = async () => {
  await createNote();
  filteredNotes.value = searchNotes(searchText.value);
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
  filteredNotes.value = searchNotes(searchText.value);
}
</script>
