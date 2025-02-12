<template>
  <div class="flex items-center justify-center h-full">
    <Button variant="primary" @click="handleCreateNote">Create Note</Button>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'NoteX',
  meta: [
    {
      name: 'description',
      content: 'A note-taking app for developers'
    }
  ]
});

definePageMeta({
  middleware: [
    async function() {
      const { fetchNotes } = useNotes();
      const router = useRouter();
      const notes = await fetchNotes();
      if (notes.length) {
        router.push(`/note/${notes[0].id}`);
      }
    }
  ]
});

const { createNote } = useNotes();

async function handleCreateNote() {
  await createNote();
}

</script>
