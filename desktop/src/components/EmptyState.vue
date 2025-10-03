<script setup lang="ts">
interface Props {
  hasDateFilter?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  hasDateFilter: false
});
</script>

<template>
  <div class="p-24 text-center relative">
    <!-- Floating particles background -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute top-10 left-1/4 w-2 h-2 rounded-full bg-[var(--color-x-blue)] opacity-50 animate-pulse"></div>
      <div class="absolute top-32 right-1/3 w-1 h-1 rounded-full bg-[var(--color-x-nebula-purple)] opacity-60 animate-pulse" style="animation-delay: 0.5s;"></div>
      <div class="absolute bottom-20 left-1/3 w-1.5 h-1.5 rounded-full bg-[var(--color-x-rocket)] opacity-40 animate-pulse" style="animation-delay: 1s;"></div>
    </div>
    
    <!-- Icon -->
    <div class="relative w-28 h-28 mx-auto mb-6">
      <div class="absolute inset-0 bg-gradient-to-br from-[var(--color-x-blue)] to-[var(--color-x-nebula-purple)] rounded-full opacity-20 blur-2xl animate-pulse"></div>
      <div class="relative w-full h-full rounded-full bg-gradient-to-br from-[var(--color-x-blue)]/20 to-[var(--color-x-nebula-purple)]/20 flex items-center justify-center border-2 border-[var(--color-x-blue)]/30 shadow-[0_0_30px_rgba(0,168,255,0.3)]">
        <svg class="w-14 h-14 text-[var(--color-x-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
        </svg>
      </div>
    </div>
    
    <!-- Title -->
    <div class="text-[var(--color-x-text-primary)] text-2xl font-bold mb-3 bg-gradient-to-r from-[var(--color-x-text-primary)] via-[var(--color-x-blue)] to-[var(--color-x-nebula-purple)] bg-clip-text text-transparent">
      {{ hasDateFilter ? 'No Signals Detected' : 'Empty Space' }}
    </div>
    
    <!-- Description -->
    <div class="text-[var(--color-x-text-secondary)] text-base max-w-md mx-auto mb-6 leading-relaxed">
      {{ hasDateFilter 
        ? 'No notes found in this timeline. Try exploring a different date or create a new cosmic entry.' 
        : 'Your cosmic journal awaits. Start documenting your journey through space and time.' 
      }}
    </div>
    
    <!-- Keyboard Shortcut Hint -->
    <div v-if="!hasDateFilter" class="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-br from-[var(--color-x-hover)] to-[var(--color-x-dark)] rounded-xl border border-[var(--color-x-blue)]/20 shadow-[0_0_20px_rgba(0,168,255,0.15)]">
      <svg class="w-5 h-5 text-[var(--color-x-blue)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
      </svg>
      <span class="text-sm text-[var(--color-x-text-muted)]">Quick Launch:</span>
      <kbd class="px-3 py-1.5 bg-[var(--color-x-black)]/60 border border-[var(--color-x-blue)]/30 rounded-lg text-xs font-mono font-semibold text-[var(--color-x-blue)] shadow-inner">Ctrl</kbd>
      <span class="text-[var(--color-x-text-muted)]">+</span>
      <kbd class="px-3 py-1.5 bg-[var(--color-x-black)]/60 border border-[var(--color-x-blue)]/30 rounded-lg text-xs font-mono font-semibold text-[var(--color-x-blue)] shadow-inner">Enter</kbd>
    </div>
  </div>
</template>
