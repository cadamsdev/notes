<template>
  <component :is="href ? 'a' : 'button'" :href="href || undefined"
    :class="{
      'bg-primary hover:bg-primary-hover': props.variant === 'primary',
      'bg-secondary hover:bg-secondary-hover': props.variant === 'secondary',
      'py-2 px-4 text-btn-text text-base': true
    }"
    v-bind="attrs" @click="handleClick">
    <slot />
  </component>
</template>

<script setup lang="ts">
type ButtonType = 'primary' | 'secondary'

const props = withDefaults(defineProps<{
  variant: ButtonType
  href?: string
}>(), {
  variant: 'primary'
});

const attrs = useAttrs()

// TODO fix
const handleClick = (event: Event) => {
  if (!props.href) {
    // Handle button click
  }
}
</script>
