<template>
  <input v-bind="attrs" :class="{
    'block w-full p-2 text-text-secondary rounded text-sm font-normal bg-bg-secondary': true,
    'placeholder:text-text-secondary': true,
    'border-solid border-bg-secondary border': true,
    'focus-visible:outline-2 focus-visible:outline focus-visible:outline-bg-secondary-hover': true
  }" />
</template>

<script setup lang="ts">
const attrs = useAttrs();
</script>
