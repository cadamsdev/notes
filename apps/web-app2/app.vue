<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  const { fetchNotes, fetchTags } = useNotes();
  await Promise.all([fetchNotes(), fetchTags()]);
</script>
