<template>
  <div class="layout">
    <AppHeader />
    <main>
      <slot />
    </main>
    <AppFooter />
  </div>
</template>

<script setup lang="ts">
useHead({
  bodyAttrs: {
    class: 'antialiased'
  }
})
</script>

<style scoped>
.layout {
  min-height: 100vh;
  background-color: var(--color-white);
}

body.dark .layout {
  background-color: var(--color-gray-900);
}
</style>
