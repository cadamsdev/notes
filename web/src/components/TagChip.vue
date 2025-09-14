<script setup lang="ts">
interface Props {
  name: string;
  color: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'filled' | 'outlined' | 'badge';
  clickable?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  variant: 'filled',
  clickable: true
});

const emit = defineEmits<{
  click: [tagName: string];
}>();

const handleClick = () => {
  if (props.clickable) {
    emit('click', props.name);
  }
};

const sizeClasses = {
  sm: 'px-2 py-1 text-xs',
  md: 'px-3 py-2 text-sm',
  lg: 'px-4 py-3 text-base'
};

const variantClasses = {
  filled: 'text-white',
  outlined: 'border border-gray-600 text-gray-300 bg-transparent',
  badge: 'bg-gray-700 text-gray-300'
};
</script>

<template>
  <button
    v-if="clickable"
    @click="handleClick"
    class="inline-flex items-center rounded-full transition-colors duration-200 hover:opacity-80"
    :class="[
      sizeClasses[size],
      variantClasses[variant],
      {
        'cursor-pointer': clickable,
        'cursor-default': !clickable
      }
    ]"
    :style="variant === 'filled' ? { backgroundColor: color } : {}"
  >
    <div 
      v-if="variant !== 'filled'"
      class="w-2 h-2 rounded-full mr-2" 
      :style="{ backgroundColor: color }"
    ></div>
    <span class="font-medium">{{ name }}</span>
    <span v-if="count !== undefined" class="ml-2 opacity-75">{{ count }}</span>
  </button>
  
  <span
    v-else
    class="inline-flex items-center rounded-full"
    :class="[
      sizeClasses[size],
      variantClasses[variant]
    ]"
    :style="variant === 'filled' ? { backgroundColor: color } : {}"
  >
    <div 
      v-if="variant !== 'filled'"
      class="w-2 h-2 rounded-full mr-2" 
      :style="{ backgroundColor: color }"
    ></div>
    <span class="font-medium">{{ name }}</span>
    <span v-if="count !== undefined" class="ml-2 opacity-75">{{ count }}</span>
  </span>
</template>
