<script setup lang="ts">
interface Props {
  disabled?: boolean;
  variant?: 'primary' | 'secondary';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  variant: 'primary',
  size: 'md',
  fullWidth: false,
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  if (!props.disabled) {
    emit('click');
  }
};
</script>

<template>
  <button 
    @click="handleClick" 
    :disabled="disabled"
    :class="[
      // Base styles
      'relative inline-flex items-center justify-center',
      'font-semibold uppercase tracking-wider',
      'transition-all duration-200 overflow-hidden group',
      'border-2 rounded-none',
      
      // Size variants
      {
        'px-4 py-2 text-xs': size === 'sm',
        'px-6 py-3 text-sm': size === 'md',
        'px-8 py-4 text-base': size === 'lg',
      },
      
      // Width
      { 'w-full': fullWidth },
      
      // Variant styles
      {
        'bg-[var(--color-btn-primary)] text-[var(--color-btn-primary-text)] border-[var(--color-btn-primary)]': variant === 'primary',
        'hover:bg-[var(--color-btn-primary-hover)] hover:border-[var(--color-btn-primary-hover)]': variant === 'primary' && !disabled,
        
        'bg-transparent text-[var(--color-x-text-primary)] border-[var(--color-x-border)]': variant === 'secondary',
        'hover:border-[var(--color-x-text-primary)] hover:bg-[var(--glass-bg-light)]': variant === 'secondary' && !disabled,
      },
      
      // Disabled state
      {
        'opacity-40 cursor-not-allowed': disabled,
        'hover:shadow-lg active:scale-95': !disabled,
      }
    ]"
  >
    <!-- Shine effect on hover -->
    <span
      v-if="!disabled"
      class="absolute inset-0 w-0 bg-white/10 transition-all duration-300 ease-out group-hover:w-full"
    ></span>
    
    <!-- Content -->
    <span class="relative z-10 flex items-center justify-center gap-2">
      <slot />
    </span>
    
    <!-- Arrow icon for primary buttons -->
    <span
      v-if="variant === 'primary' && !disabled"
      class="relative z-10 ml-2 transition-transform duration-200 group-hover:translate-x-1"
    >
      →
    </span>
  </button>
</template>
