<template>
  <Teleport to="#teleports">
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black opacity-50" @click="handleClose"></div>
      <div class="relative z-10">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { currentModal, closeModal } = useModal();
const props = defineProps<{
  id: string
}>();

const isOpen = ref(currentModal.value === props.id);

watch(() => currentModal.value, (newValue) => {
  console.log(`modal value changed: ${newValue}`)
  isOpen.value = newValue === props.id;
});

const handleClose = () => {
  closeModal();
}
</script>
