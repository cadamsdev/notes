<template>
  <div class="custom-title-bar glass-header">
    <div class="title-bar-content" data-tauri-drag-region @mousedown="startDrag" @dblclick="toggleMaximize">
      <!-- App Icon and Title -->
      <div class="title-section">
        <div class="app-icon">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" 
                  stroke="currentColor" 
                  stroke-width="2" 
                  stroke-linecap="round" 
                  stroke-linejoin="round"/>
          </svg>
        </div>
        <span class="app-title">Cosmic Notes</span>
      </div>

      <!-- Window Controls -->
      <div class="window-controls">
        <button 
          @click="minimizeWindow"
          class="control-button minimize-btn"
          title="Minimize"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 6h8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
        
        <button 
          @click="toggleMaximize"
          class="control-button maximize-btn"
          :title="isMaximized ? 'Restore' : 'Maximize'"
        >
          <svg v-if="!isMaximized" width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="2" width="8" height="8" stroke="currentColor" stroke-width="1.5" fill="none" rx="1"/>
          </svg>
          <svg v-else width="12" height="12" viewBox="0 0 12 12" fill="none">
            <rect x="2" y="3" width="6" height="6" stroke="currentColor" stroke-width="1.5" fill="none" rx="1"/>
            <path d="M4 3V2a1 1 0 011-1h5a1 1 0 011 1v5a1 1 0 01-1 1H9" stroke="currentColor" stroke-width="1.5" fill="none"/>
          </svg>
        </button>
        
        <button 
          @click="closeWindow"
          class="control-button close-btn"
          title="Close"
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M3 3l6 6M9 3l-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getCurrentWindow } from '@tauri-apps/api/window'

const isMaximized = ref(false)
const appWindow = getCurrentWindow()

const startDrag = (e: MouseEvent) => {
  // Prevent dragging when clicking on buttons
  if ((e.target as HTMLElement).closest('.control-button')) {
    return
  }
  appWindow.startDragging()
}

const minimizeWindow = async () => {
  await appWindow.minimize()
}

const toggleMaximize = async () => {
  const maximized = await appWindow.isMaximized()
  
  if (maximized) {
    await appWindow.unmaximize()
    isMaximized.value = false
  } else {
    await appWindow.maximize()
    isMaximized.value = true
  }
}

const closeWindow = async () => {
  await appWindow.close()
}

const checkMaximized = async () => {
  isMaximized.value = await appWindow.isMaximized()
}

onMounted(async () => {
  await checkMaximized()
  
  // Listen for window state changes
  const unlisten = await appWindow.onResized(async () => {
    await checkMaximized()
  })
  
  // Cleanup on unmount
  return () => {
    unlisten()
  }
})
</script>

<style scoped>
.custom-title-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 40px;
  z-index: 9999;
  user-select: none;
  -webkit-user-select: none;
}

.title-bar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 16px;
  cursor: move;
  cursor: -webkit-grab;
  cursor: grab;
}

.title-bar-content:active {
  cursor: -webkit-grabbing;
  cursor: grabbing;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
  min-width: 0;
}

.app-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  color: var(--color-x-blue);
  flex-shrink: 0;
}

.app-title {
  font-size: var(--font-size-x-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-x-text-primary);
  letter-spacing: -0.01em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.window-controls {
  display: flex;
  align-items: center;
  gap: 1px;
  flex-shrink: 0;
}

.control-button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: transparent;
  color: var(--color-x-text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
  border-radius: var(--radius-x-sm);
  position: relative;
}

.control-button:hover {
  background: var(--glass-bg-light);
  color: var(--color-x-text-primary);
  transform: scale(1.05);
}

.control-button:active {
  transform: scale(0.95);
}

.minimize-btn:hover {
  background: rgba(255, 193, 7, 0.15);
  color: #ffc107;
}

.maximize-btn:hover {
  background: rgba(40, 167, 69, 0.15);
  color: #28a745;
}

.close-btn:hover {
  background: rgba(220, 53, 69, 0.15);
  color: #dc3545;
}

/* Add space for the title bar in the main content */
:global(body) {
  padding-top: 40px;
}

/* Dark mode adjustments */
body.dark .custom-title-bar {
  backdrop-filter: blur(30px) saturate(200%) brightness(0.8);
  -webkit-backdrop-filter: blur(30px) saturate(200%) brightness(0.8);
}

body.dark .control-button:hover {
  background: var(--glass-bg-medium);
}

body.dark .minimize-btn:hover {
  background: rgba(255, 193, 7, 0.2);
}

body.dark .maximize-btn:hover {
  background: rgba(40, 167, 69, 0.2);
}

body.dark .close-btn:hover {
  background: rgba(220, 53, 69, 0.2);
}
</style>
