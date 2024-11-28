<template>
  <component :is="href ? 'a' : 'button'" :href="href || undefined" :class="buttonClass" v-bind="attrs"
    @click="handleClick">
    <slot />
  </component>
</template>

<script setup lang="ts">
import { computed, defineProps, useAttrs } from 'vue'
import clsx from 'clsx'

type ButtonType = 'primary' | 'secondary'

const props = withDefaults(defineProps<{
  variant: ButtonType
  href?: string
}>(), {
  variant: 'primary'
});

const attrs = useAttrs()

const buttonClass = computed(() => {
  return clsx({
    'bg-primary hover:bg-primary-hover': props.variant === 'primary',
    'bg-secondary hover:bg-secondary-hover': props.variant === 'secondary',
  }, 'py-2 px-4 text-btn-text text-base')
})

const handleClick = (event: Event) => {
  if (!props.href) {
    // Handle button click
  }
}
</script>
