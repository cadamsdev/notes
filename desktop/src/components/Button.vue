<script setup lang="ts">
interface Props {
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
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
      'transition-all duration-200 overflow-hidden group/button',
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
        // Primary button - surface background with text
        'bg-text-primary text-background border-text-primary': variant === 'primary' && !disabled,
        'hover:bg-text-secondary hover:border-text-secondary': variant === 'primary' && !disabled,
        
        // Primary disabled
        'bg-surface text-text-secondary border-surface cursor-not-allowed': variant === 'primary' && disabled,
        
        'bg-transparent text-text-primary border-border': variant === 'secondary' && !disabled,
        'hover:border-border-hover hover:bg-surface': variant === 'secondary' && !disabled,
        
        // Secondary disabled
        'bg-transparent text-text-secondary border-border cursor-not-allowed': variant === 'secondary' && disabled,
        
        // Ghost button - minimal style with hover effect
        'bg-transparent text-text-primary border-transparent': variant === 'ghost' && !disabled,
        'hover:bg-surface': variant === 'ghost' && !disabled,
        
        // Ghost disabled
        'bg-transparent text-text-secondary border-transparent cursor-not-allowed': variant === 'ghost' && disabled,
      },
      
      // Active states
      {
        'hover:shadow-lg active:scale-95': !disabled,
      }
    ]"
  >
    <!-- Shine effect on hover -->
    <span
      v-if="!disabled"
      class="absolute inset-0 w-0 bg-surface-hover transition-all duration-300 ease-out group-hover/button:w-full"
    ></span>
    
    <!-- Content -->
    <span class="relative z-10 flex items-center justify-center gap-2">
      <slot />
    </span>
  </button>
</template>
