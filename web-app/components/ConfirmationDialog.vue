<template>
  <Modal :id="id">
    <div class="relative inline-block rounded-lg bg-bg-elevated/95 backdrop-blur-sm shadow-2xl ring-1 ring-white/5 z-20 min-w-[22rem] max-w-md mx-4">
      <!-- Header with dynamic gradient accent -->
      <div class="relative px-6 pt-6 pb-4">
        <div 
          class="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
          :class="{
            'bg-gradient-to-r from-amber-500/20 via-amber-500 to-amber-500/20': variant === 'warning',
            'bg-gradient-to-r from-red-500/20 via-red-500 to-red-500/20': variant === 'danger',
            'bg-gradient-to-r from-primary/20 via-primary to-primary/20': variant === 'info'
          }"
        ></div>
        
        <div class="flex items-start justify-between">
          <div class="flex items-center space-x-3">
            <div 
              class="flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center"
              :class="{
                'bg-amber-500/10': variant === 'warning',
                'bg-red-500/10': variant === 'danger',
                'bg-primary/10': variant === 'info'
              }"
            >
              <Icon 
                :name="variant === 'danger' ? 'fa-solid:exclamation-circle' : variant === 'info' ? 'fa-solid:info-circle' : 'fa-solid:exclamation-triangle'" 
                size="20" 
                :class="{
                  'text-amber-500': variant === 'warning',
                  'text-red-500': variant === 'danger',
                  'text-primary': variant === 'info'
                }"
              />
            </div>
            <h2 class="text-lg font-semibold text-text-primary leading-6">Confirm Action</h2>
          </div>
          
          <button 
            @click="closeModal" 
            class="flex-shrink-0 w-8 h-8 rounded-md flex items-center justify-center text-text-secondary hover:text-text-primary hover:bg-bg-hover transition-colors duration-200"
          >
            <Icon name="fa-solid:times" size="16" />
          </button>
        </div>
      </div>
      
      <!-- Content -->
      <div class="px-6 pb-6">
        <div class="mb-6 text-text-secondary leading-relaxed">
          {{ description }}
        </div>
        
        <!-- Action Buttons -->
        <div class="flex justify-end gap-3">
          <Button 
            @click="closeModal" 
            variant="secondary"
            class="px-4 py-2 text-sm font-medium"
          >
            {{ cancelText }}
          </Button>
          <Button 
            @click="handleAction" 
            :variant="variant === 'danger' ? 'primary' : 'primary'"
            :class="{
              'bg-red-600 hover:bg-red-700 focus:ring-red-500': variant === 'danger',
              'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500': variant === 'warning'
            }"
            class="px-4 py-2 text-sm font-medium"
          >
            {{ confirmText }}
          </Button>
        </div>
        
        <!-- Keyboard shortcuts hint -->
        <div class="mt-3 pt-3 border-t border-white/5">
          <p class="text-xs text-text-secondary/70 text-center">
            Press <kbd class="px-1.5 py-0.5 text-xs bg-bg-hover rounded border border-white/5">Esc</kbd> to cancel or 
            <kbd class="px-1.5 py-0.5 text-xs bg-bg-hover rounded border border-white/5">⌘+Enter</kbd> to confirm
          </p>
        </div>
      </div>
    </div>
  </Modal>
</template>

<script setup lang="ts">
interface Props {
  id: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
}

const props = withDefaults(defineProps<Props>(), {
  description: 'Are you sure you want to perform this action?',
  confirmText: 'Confirm',
  cancelText: 'Cancel',
  variant: 'warning'
});

const { closeModal } = useModal();
const emits = defineEmits(['action']);

// Handle keyboard shortcuts
const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    closeModal();
  } else if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
    handleAction();
  }
};

const handleAction = () => {
  closeModal();
  emits('action');
};

// Add keyboard listeners when component mounts
onMounted(() => {
  document.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown);
});
</script>
