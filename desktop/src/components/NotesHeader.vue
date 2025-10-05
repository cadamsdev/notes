<script setup lang="ts">
interface Props {
  noteCount: number;
}

defineProps<Props>();

const emit = defineEmits<{
  'open-settings': [];
}>();

const handleSettingsClick = () => {
  emit('open-settings');
};
</script>

<template>
  <header class="glass-header rounded-2xl mb-6">
    <div class="px-8 py-6">
      <div class="flex items-center gap-4">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-x-blue to-x-blue-hover flex items-center justify-center shadow-lg">
          <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
          </svg>
        </div>
        <div class="flex-1">
          <h1 class="text-xl font-semibold text-x-text-primary tracking-tight">
            Notes
          </h1>
          <p class="text-sm text-x-text-secondary mt-0.5">
            {{ noteCount }} {{ noteCount === 1 ? 'note' : 'notes' }}
          </p>
        </div>
        <div class="flex items-center gap-2">
          <!-- Settings Button -->
          <button
            @click="handleSettingsClick"
            class="w-9 h-9 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center text-x-text-secondary hover:text-x-text-primary"
            title="Settings"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
            </svg>
          </button>
          <slot name="theme-toggle" />
        </div>
      </div>
    </div>
  </header>
</template>
