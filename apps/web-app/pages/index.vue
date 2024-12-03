<template>
  <div class="flex items-center justify-center h-full">
    <div>Loading...</div>
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
})

</script>
