<template>
  <input v-bind="attrs" @input="handleInput" :class="inputClass" />
</template>

<script setup lang="ts">
import clsx from 'clsx';

const attrs = useAttrs()

const inputClass = clsx(
  'block w-full p-2 text-text-secondary rounded text-sm font-normal bg-bg-secondary',
  'placeholder:text-text-secondary',
  'border-solid border-bg-secondary border',
  'focus-visible:outline-2 focus-visible:outline focus-visible:outline-bg-secondary-hover'
);
</script>
