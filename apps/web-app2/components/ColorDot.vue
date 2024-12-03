<template>
  <div :class="{
    'w-3 h-3 rounded-full': true,
    'bg-tag-red': props.color === 'red',
    'bg-tag-green': props.color === 'green',
    'bg-tag-blue': props.color === 'blue',
    'bg-tag-purple': props.color === 'purple',
    'bg-tag-yellow': props.color === 'yellow',
    'bg-tag-orange': props.color === 'orange',
    'bg-tag-pink': props.color === 'pink',
    'bg-tag-brown': props.color === 'brown',
    'bg-tag-light-gray': props.color === 'light-gray',
    'bg-tag-dark-gray': props.color === 'dark-gray'
  }"></div>
</template>

<script setup lang="ts">
const props = defineProps<{
  color?: string
}>();
</script>
