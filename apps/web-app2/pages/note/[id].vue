<template>
  <div class="relative">
    <div class="overflow-y-auto">
      <!-- <div v-if="!note" class="flex items-center justify-center h-full">
        <div>No content</div>
      </div> -->

      <Editor v-if="note" :note="note" />
    </div>

    <div
      class="fixed bottom-0 p-3 bg-bg border-t border-bg-border text-text-primary w-full z-10 flex items-center gap-2 min-h-[50px]">
      <button @click="openModal(MODAL_TAG)">
        <Icon name="fa-solid:tags" />
      </button>
      <button v-if="note?.tags?.length === 0" @click="openModal(MODAL_TAG)" class="text-sm">Click to add Tags...</button>
      <div v-else class="flex flex-wrap gap-2">
        <button v-for="tag in note?.tags" @click="openModal(MODAL_TAG)">
          <Chip :text="tag.name" :color="tag.color" />
        </button>
      </div>
    </div>
  </div>

  <Dialog :id="MODAL_TAG">
    <div class="min-w-[300px]">
      <div>
        <div class="font-bold mb-4 text-text-primary">Tags</div>
      </div>
      <div class="mb-4">
        <TagCombobox :tags="note?.tags || []" @selected-tags="onSelectedTags" />
      </div>

      <div class="flex justify-end gap-2">
        <Button variant="primary" @click="handleSaveTags">Save</Button>
        <Button variant="secondary" @click="closeModal()">Cancel</Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
const note = ref<Note>();
const tempTags = ref<Tag[]>([]);
const route = useRoute();
const { fetchNote, saveTags, tags } = useNotes();
const { openModal, closeModal } = useModal();
const MODAL_TAG = 'MODAL_TAG';

watch(() => tags.value, async () => {
  note.value = await fetchNote(+route.params.id);
});

onMounted(async () => {
  const noteId = +route.params.id;
  note.value = await fetchNote(noteId);
  tempTags.value = note.value.tags || [];
});

async function handleSaveTags() {
  if (!note.value) {
    return;
  }

  note.value.tags = tempTags.value;
  await saveTags(note.value.id, note.value.tags || []);
  closeModal();
}

function onSelectedTags(tags: Tag[]) {
  tempTags.value = tags;
}
</script>
