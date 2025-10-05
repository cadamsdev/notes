<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/core';

const isOpen = ref(false);
const appVersion = ref('Loading...');

const openSettings = () => {
  isOpen.value = true;
};

const closeSettings = () => {
  isOpen.value = false;
};

const openDatabaseLocation = async () => {
  try {
    await invoke('open_database_location_cmd');
  } catch (error) {
    console.error('Failed to open database location:', error);
  }
};

// Fetch app version on mount
onMounted(async () => {
  try {
    appVersion.value = await invoke('get_app_version');
  } catch (error) {
    console.error('Failed to get app version:', error);
    appVersion.value = 'Unknown';
  }
});

// Expose openSettings for parent components
defineExpose({ openSettings });
</script>

<template>
  <!-- Settings Modal Overlay -->
  <Transition name="modal">
    <div 
      v-if="isOpen" 
      class="fixed inset-0 z-50 flex items-center justify-center p-6"
      @click="closeSettings"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>
      
      <!-- Settings Panel -->
      <div 
        class="glass-panel relative w-full max-w-2xl max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="px-8 py-6 border-b border-white/10">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--color-x-blue)] to-[var(--color-x-blue-hover)] flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-semibold text-x-text-primary tracking-tight">Settings</h2>
                <p class="text-sm text-x-text-secondary mt-0.5">Manage your app preferences</p>
              </div>
            </div>
            <button 
              @click="closeSettings"
              class="w-8 h-8 rounded-lg hover:bg-white/10 transition-colors flex items-center justify-center text-x-text-secondary hover:text-x-text-primary"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"/>
              </svg>
            </button>
          </div>
        </div>
        
        <!-- Settings Content -->
        <div class="px-8 py-6 overflow-y-auto max-h-[calc(80vh-140px)]">
          <!-- Database Section -->
          <div class="mb-8">
            <h3 class="text-sm font-semibold text-x-text-primary uppercase tracking-wider mb-4">Database</h3>
            
            <div class="space-y-3">
              <!-- Open Database Location -->
              <button
                @click="openDatabaseLocation"
                class="w-full px-4 py-3.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all flex items-center justify-between group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg bg-x-blue/10 flex items-center justify-center group-hover:bg-x-blue/20 transition-colors">
                    <svg class="w-5 h-5 text-x-blue" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-medium text-x-text-primary">Open Database Location</p>
                    <p class="text-xs text-x-text-secondary mt-0.5">View the database file in your file explorer</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-x-text-secondary group-hover:text-x-blue transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- About Section -->
          <div class="mb-8">
            <h3 class="text-sm font-semibold text-x-text-primary uppercase tracking-wider mb-4">About</h3>
            
            <div class="px-4 py-3.5 rounded-xl bg-white/5 border border-white/10">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-gradient-to-br from-x-blue to-x-blue-hover flex items-center justify-center shadow-lg">
                  <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-x-text-primary">Cosmic Notes</p>
                  <p class="text-xs text-x-text-secondary mt-0.5">Version {{ appVersion }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .glass-panel,
.modal-leave-active .glass-panel {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .glass-panel,
.modal-leave-to .glass-panel {
  transform: scale(0.95);
  opacity: 0;
}
</style>
