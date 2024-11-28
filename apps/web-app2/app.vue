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
  title: 'Web App 2',
  meta: [
    {
      name: 'description',
      content: 'Web App 2'
    }
  ]
})
</script>
