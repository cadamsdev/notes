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
        // Primary button - Always black bg/white text in both themes
        'bg-x-black text-white border-x-black': variant === 'primary' && !disabled,
        'hover:bg-white hover:text-x-black hover:border-white': variant === 'primary' && !disabled,
        
        // Primary disabled - muted gray colors instead of opacity
        'bg-x-text-muted text-x-text-secondary border-x-text-muted cursor-not-allowed': variant === 'primary' && disabled,
        
        'bg-transparent text-x-text-primary border-x-border': variant === 'secondary' && !disabled,
        'hover:border-x-text-primary hover:bg-glass-bg-light': variant === 'secondary' && !disabled,
        
        // Secondary disabled - muted gray colors
        'bg-transparent text-x-text-muted border-x-border cursor-not-allowed': variant === 'secondary' && disabled,
        
        // Ghost button - minimal style with hover effect
        'bg-transparent text-x-text-primary border-transparent': variant === 'ghost' && !disabled,
        'hover:bg-white/60 dark:hover:bg-white/20': variant === 'ghost' && !disabled,
        
        // Ghost disabled - muted text
        'bg-transparent text-x-text-muted border-transparent cursor-not-allowed': variant === 'ghost' && disabled,
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
      class="absolute inset-0 w-0 bg-white/10 transition-all duration-300 ease-out group-hover:w-full"
    ></span>
    
    <!-- Content -->
    <span class="relative z-10 flex items-center justify-center gap-2">
      <slot />
    </span>
  </button>
</template>
