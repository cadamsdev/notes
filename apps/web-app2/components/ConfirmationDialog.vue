<template>
  <Modal :id="id">
    <div
      class="inline-block rounded-[0.25rem] bg-bg border border-bg-border p-3 text-text-primary shadow-md z-20 min-w-[18.75rem]">
      <div class="flex items-center justify-between mb-8">
        <h2 class="text-[1.25rem] text-text-primary font-bold text-center">Confirm Action</h2>
        <button @click="closeModal" class="text-text-secondary hover:text-text-primary-hover">
          <Icon name="fa-solid:times" size="24" />
        </button>
      </div>
      <div class="min-w-[15.625rem] max-w-[21.875rem] text-text-secondary">
        <div v-if="description" class="mb-6">
          {{ description }}
        </div>
        <div class="flex justify-end gap-2">
          <Button @click="handleAction" variant="primary">Yes</Button>
          <Button @click="closeModal" variant="secondary">No</Button>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
const props = defineProps<{
  id: string;
  description?: string;
}>();

const { closeModal } = useModal();
const emits = defineEmits(['action']);

const description = ref(props.description || 'Are you sure you want to do this?');

const handleAction = () => {
  closeModal();
  emits('action');
};
</script>
