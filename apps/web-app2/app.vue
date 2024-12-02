<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
  const { fetchNotes, fetchTags } = useNotes();
  const { fetchSettings } = useSettings();
  await Promise.all([fetchNotes(), fetchTags(), fetchSettings()]);
</script>
