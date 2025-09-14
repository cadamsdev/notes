<template>
  <div class="min-h-screen bg-bg">
    <div class="max-w-7xl mx-auto flex">
      <!-- Sidebar -->
      <div class="hidden lg:block lg:w-64 xl:w-80">
        <Sidebar />
      </div>
      
      <!-- Main content -->
      <div class="flex-1 min-w-0">
        <slot />
      </div>
    </div>
    
    <!-- Mobile bottom navigation -->
    <div class="lg:hidden fixed bottom-0 left-0 right-0 bg-bg-secondary border-t border-bg-border">
      <div class="flex items-center justify-around py-2">
        <NuxtLink to="/" class="p-3">
          <Icon name="fluent:home-20-filled" size="24" />
        </NuxtLink>
        <button @click="handleCreateNote" class="p-3">
          <Icon name="fluent:add-20-filled" size="24" />
        </button>
        <button class="p-3">
          <Icon name="fluent:navigation-20-filled" size="24" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { createNote } = useNotes();

const handleCreateNote = async () => {
  await createNote();
};
</script>
