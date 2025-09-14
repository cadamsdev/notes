<template>
  <Teleport to="#teleports">
    <div v-if="isOpen"
      :class="{
        'fixed inset-0 z-50 flex items-center justify-center bg-modal-overlay backdrop-blur-sm': true,
        'pt-8 justify-center items-baseline': position === 'center-top',
        'justify-center items-center': position === 'center'
      }">
      <div ref="modalRef">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { onClickOutside } from '@vueuse/core';
type ModalPosition = 'center' | 'center-top';
const { currentModal, closeModal } = useModal();
const props = withDefaults(defineProps<{
  id: string
  position?: ModalPosition
}>(), {
  position: 'center-top'
});
const modalRef = ref<HTMLDivElement>();
const isOpen = ref(currentModal.value === props.id);

watch(() => currentModal.value, (newValue) => {
  isOpen.value = newValue === props.id;
});

onClickOutside(modalRef, () => {
  closeModal();
});
</script>
