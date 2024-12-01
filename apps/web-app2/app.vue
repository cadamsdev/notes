<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  const { fetchNotes } = useNotes();
  const { fetchTags } = useTags();
  await Promise.all([fetchNotes(), fetchTags()]);
</script>
