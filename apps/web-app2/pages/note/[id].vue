<template>
  <Editor v-if="note" :note="note" class="p-6" />
</template>

<script setup lang="ts">
const note = ref<Note>();
const route = useRoute();
const { fetchNote } = useNotes();

onMounted(async () => {
  const noteId = +route.params.id;
  note.value = await fetchNote(noteId);
});
</script>
