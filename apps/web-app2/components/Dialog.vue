<template>
  <Modal :id="id" @closeModal="handleCloseModal">
    <div
      class="inline-block rounded bg-bg text-text border border-bg-border p-6 z-20 min-w-[18.75rem] max-w-[31.25rem]">
      <slot />
    </div>
  </Modal>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  showHeader?: boolean
}>()

const emit = defineEmits(['closeModal'])

const handleCloseModal = () => {
  emit('closeModal')
  // closeModal()
}
</script>

