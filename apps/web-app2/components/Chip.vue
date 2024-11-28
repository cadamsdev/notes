<template>
  <div
    class="chip inline-flex items-center gap-1 py-[0.125rem] px-1 rounded-sm bg-bg-on-secondary text-tag-default-text text-xs">
    <div v-if="color" :class="colorClass"></div>
    <span>{{ text }}</span>
    <button v-if="hasCloseBtn" @click="handleClose" class="ml-1">
      <Icon icon="fa-solid:times" width="12" height="12" />
    </button>
  </div>
</template>

<script setup lang="ts">
import { computed, defineProps, defineEmits } from 'vue'
import Icon from '@iconify/vue'

const props = defineProps<{
  text: string
  color?: string
  hasCloseBtn?: boolean
}>()

const emit = defineEmits(['close'])

const colorClass = computed(() => {
  return {
    'w-3 h-3 rounded-[0.625rem]': true,
    'bg-tag-red': props.color === 'red',
    'bg-tag-green': props.color === 'green',
    'bg-tag-blue': props.color === 'blue',
    'bg-tag-purple': props.color === 'purple',
    'bg-tag-yellow': props.color === 'yellow',
    'bg-tag-orange': props.color === 'orange',
  }
})

function handleClose() {
  emit('close')
}
</script>
