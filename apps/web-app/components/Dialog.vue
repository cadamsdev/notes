<template>
  <Modal :id="id">
    <div
      class="inline-block rounded bg-bg text-text border border-bg-border p-6 z-20 min-w-[18.75rem] max-w-[31.25rem]">
      <button v-if="props.showHeader" @click="handleCloseModal"
        class="text-text-secondary hover:text-text-secondary-hover w-6 h-6 flex items-center justify-center absolute top-3 right-3">
        <Icon name="fa-solid:times" size="24" />
      </button>
      <slot />
    </div>
  </Modal>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string
  showHeader?: boolean
}>();
const { closeModal } = useModal();

const handleCloseModal = () => {
  closeModal()
}
</script>

