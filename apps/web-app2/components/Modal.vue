<template>
  <Teleport to="#teleports">
    {{ modal }}
    <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center">
      <div class="fixed inset-0 bg-black opacity-50" @click="handleClose"></div>
      <div class="relative z-10">
        <slot />
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
const { modal, closeModal } = useModal();

const props = defineProps<{
  id: string
}>();

const emit = defineEmits(['closeModal'])
const isOpen = ref(modal.value === props.id);

watch(() => modal, (newValue) => {
  console.log(`modal value changed: ${newValue.value}`)
  isOpen.value = newValue.value === props.id;
});

const handleClose = () => {
  closeModal();
  emit('closeModal')
}
</script>
