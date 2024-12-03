<template>
  <div class="flex h-full">
    <Sidebar />
    <NotesView />
    <div class="flex-grow bg-bg text-text-primary">
      <slot />
    </div>
  </div>
</template>
