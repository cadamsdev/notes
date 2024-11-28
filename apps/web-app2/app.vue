<template>
  <div class="flex h-full">
    <!-- <Sidebar tagSort={data.tagSort} /> -->

    <!-- <NotesView /> -->

    <div class="flex-grow bg-bg text-text-primary">
      <slot />
    </div>
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
})
</script>
