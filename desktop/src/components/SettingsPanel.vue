<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import { open } from '@tauri-apps/plugin-dialog';

const isOpen = ref(false);
const appVersion = ref('Loading...');
const databaseDirectory = ref('Loading...');
const isCustomLocation = ref(false);

// Conflict modal state
const showConflictModal = ref(false);
const pendingDirectory = ref<string | null>(null);

// Import modal state
const showImportModal = ref(false);
const pendingImportPath = ref<string | null>(null);

const openSettings = async () => {
  isOpen.value = true;
  await loadDatabaseInfo();
};

const closeSettings = () => {
  isOpen.value = false;
};

const loadDatabaseInfo = async () => {
  try {
    const dbDir = await invoke<string>('get_database_directory_cmd');
    databaseDirectory.value = dbDir;
    
    // Check if it's a custom location (not in default app data dir)
    // This is a simple heuristic - could be improved
    isCustomLocation.value = dbDir.includes('Google Drive') || 
                             dbDir.includes('OneDrive') || 
                             dbDir.includes('Dropbox') ||
                             !dbDir.includes('AppData'); // Windows
  } catch (error) {
    console.error('Failed to get database directory:', error);
    databaseDirectory.value = 'Unknown';
  }
};

const changeDatabaseLocation = async () => {
  try {
    const selected = await open({
      directory: true,
      multiple: false,
      title: 'Select Database Location',
    });
    
    if (selected) {
      // Check if a database already exists at this location
      const dbExists = await invoke<boolean>('check_database_exists_cmd', { directoryPath: selected });
      
      if (dbExists) {
        // Show conflict modal
        pendingDirectory.value = selected;
        showConflictModal.value = true;
      } else {
        // No conflict, proceed with change
        await applyDatabaseLocationChange(selected, false);
      }
    }
  } catch (error) {
    console.error('Failed to change database location:', error);
    alert('Failed to change database location. Please try again.');
  }
};

const applyDatabaseLocationChange = async (directory: string, overwrite: boolean, backup: boolean = false) => {
  try {
    const newPath = await invoke<string>('set_database_directory_cmd', { 
      directoryPath: directory,
      overwrite: overwrite,
      backup: backup
    });
    console.log('Database location changed to:', newPath);
    
    // Reload the app to use new database location
    window.location.reload();
  } catch (error) {
    console.error('Failed to change database location:', error);
    alert('Failed to change database location. Please try again.');
  }
};

const handleOverwriteExisting = async () => {
  if (pendingDirectory.value) {
    showConflictModal.value = false;
    await applyDatabaseLocationChange(pendingDirectory.value, true, false);
    pendingDirectory.value = null;
  }
};

const handleBackupAndOverwrite = async () => {
  if (pendingDirectory.value) {
    showConflictModal.value = false;
    await applyDatabaseLocationChange(pendingDirectory.value, true, true);
    pendingDirectory.value = null;
  }
};

const handleUseExisting = async () => {
  if (pendingDirectory.value) {
    showConflictModal.value = false;
    await applyDatabaseLocationChange(pendingDirectory.value, false, false);
    pendingDirectory.value = null;
  }
};

const handleCancelConflict = () => {
  showConflictModal.value = false;
  pendingDirectory.value = null;
};

const resetDatabaseLocation = async () => {
  if (!confirm('Reset database location to default? The current database will be copied to the default location.')) {
    return;
  }
  
  try {
    await invoke<string>('reset_database_directory_cmd');
    console.log('Database location reset to default');
    
    // Reload the app to use default database location
    window.location.reload();
  } catch (error) {
    console.error('Failed to reset database location:', error);
    alert('Failed to reset database location. Please try again.');
  }
};

const openDatabaseLocation = async () => {
  try {
    await invoke('open_database_location_cmd');
  } catch (error) {
    console.error('Failed to open database location:', error);
  }
};

const createDatabaseBackup = async () => {
  try {
    const dbPath = await invoke<string>('get_database_path_cmd');
    const backupPath = await invoke<string>('create_database_backup_cmd', { dbPath });
    alert(`Backup created successfully!\n\nBackup location:\n${backupPath}`);
  } catch (error) {
    console.error('Failed to create database backup:', error);
    alert('Failed to create database backup. Please try again.');
  }
};

const importDatabase = async () => {
  try {
    const selected = await open({
      directory: false,
      multiple: false,
      title: 'Select Database File to Import',
      filters: [{
        name: 'Database',
        extensions: ['db']
      }]
    });
    
    if (selected) {
      // Check if current database exists
      const currentDbPath = await invoke<string>('get_database_path_cmd');
      const dbExists = currentDbPath && currentDbPath.length > 0;
      
      if (dbExists) {
        // Show import modal to ask about backup
        pendingImportPath.value = selected;
        showImportModal.value = true;
      } else {
        // No current database, import directly
        await applyDatabaseImport(selected, false);
      }
    }
  } catch (error) {
    console.error('Failed to import database:', error);
    alert('Failed to import database. Please try again.');
  }
};

const applyDatabaseImport = async (sourcePath: string, createBackup: boolean) => {
  try {
    await invoke<string>('import_database_cmd', { 
      sourcePath: sourcePath,
      createBackup: createBackup
    });
    console.log('Database imported successfully');
    
    // Reload the app to use imported database
    window.location.reload();
  } catch (error) {
    console.error('Failed to import database:', error);
    alert('Failed to import database. Please try again.');
  }
};

const handleImportWithBackup = async () => {
  if (pendingImportPath.value) {
    showImportModal.value = false;
    await applyDatabaseImport(pendingImportPath.value, true);
    pendingImportPath.value = null;
  }
};

const handleImportWithoutBackup = async () => {
  if (pendingImportPath.value) {
    showImportModal.value = false;
    await applyDatabaseImport(pendingImportPath.value, false);
    pendingImportPath.value = null;
  }
};

const handleCancelImport = () => {
  showImportModal.value = false;
  pendingImportPath.value = null;
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
      <div class="absolute inset-0 bg-background-overlay"></div>
      
      <!-- Settings Panel -->
      <div 
        class="bg-surface border border-border rounded-2xl relative w-full max-w-2xl max-h-[80vh] overflow-hidden"
        @click.stop
      >
        <!-- Header -->
        <div class="px-8 py-6 border-b border-border">
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-text-primary flex items-center justify-center shadow-lg">
                <svg class="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                </svg>
              </div>
              <div>
                <h2 class="text-2xl font-semibold text-text-primary tracking-tight">Settings</h2>
                <p class="text-sm text-text-secondary mt-0.5">Manage your app preferences</p>
              </div>
            </div>
            <button 
              @click="closeSettings"
              class="w-8 h-8 rounded-lg hover:bg-surface transition-colors flex items-center justify-center text-text-secondary hover:text-text-primary"
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
            <h3 class="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Database</h3>
            
            <div class="space-y-3">
              <!-- Database Location Info -->
              <div class="px-4 py-3.5 rounded-xl bg-surface border border-border">
                <div class="flex items-start justify-between gap-3">
                  <div class="flex items-start gap-3 flex-1 min-w-0">
                    <div class="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                      <svg class="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                      </svg>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <p class="text-sm font-medium text-text-primary">Database Location</p>
                        <span 
                          v-if="isCustomLocation" 
                          class="px-2 py-0.5 rounded-md bg-surface-active text-text-primary text-xs font-medium"
                        >
                          Custom
                        </span>
                      </div>
                      <p class="text-xs text-text-secondary break-all font-mono">{{ databaseDirectory }}</p>
                    </div>
                  </div>
                  <!-- Create Backup Button -->
                  <button
                    @click="createDatabaseBackup"
                    class="px-3 py-2 rounded-lg bg-surface-hover hover:bg-surface-active border border-border hover:border-border-hover transition-all flex items-center gap-2 flex-shrink-0"
                    title="Create backup"
                  >
                    <svg class="w-4 h-4 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                    </svg>
                    <span class="text-xs font-medium text-text-primary">Backup</span>
                  </button>
                </div>
              </div>

              <!-- Change Database Location -->
              <button
                @click="changeDatabaseLocation"
                class="w-full px-4 py-3.5 rounded-xl bg-surface hover:bg-surface-hover border border-border hover:border-border-hover transition-all flex items-center justify-between group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-medium text-text-primary">Change Database Location</p>
                    <p class="text-xs text-text-secondary mt-0.5">Move database to cloud storage (OneDrive, Google Drive)</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              
              <!-- Reset to Default Location -->
              <button
                v-if="isCustomLocation"
                @click="resetDatabaseLocation"
                class="w-full px-4 py-3.5 rounded-xl bg-surface hover:bg-surface-hover border border-border hover:border-border-hover transition-all flex items-center justify-between group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-medium text-text-primary">Reset to Default Location</p>
                    <p class="text-xs text-text-secondary mt-0.5">Move database back to app data directory</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
              
              <!-- Open Database Location -->
              <button
                @click="openDatabaseLocation"
                class="w-full px-4 py-3.5 rounded-xl bg-surface hover:bg-surface-hover border border-border hover:border-border-hover transition-all flex items-center justify-between group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-medium text-text-primary">Open Database Location</p>
                    <p class="text-xs text-text-secondary mt-0.5">View the database file in your file explorer</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </button>
              
              <!-- Import Database -->
              <button
                @click="importDatabase"
                class="w-full px-4 py-3.5 rounded-xl bg-surface hover:bg-surface-hover border border-border hover:border-border-hover transition-all flex items-center justify-between group"
              >
                <div class="flex items-center gap-3">
                  <div class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors">
                    <svg class="w-5 h-5 text-text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                    </svg>
                  </div>
                  <div class="text-left">
                    <p class="text-sm font-medium text-text-primary">Import Database</p>
                    <p class="text-xs text-text-secondary mt-0.5">Import an existing database file from anywhere</p>
                  </div>
                </div>
                <svg class="w-5 h-5 text-text-secondary group-hover:text-text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/>
                </svg>
              </button>
            </div>
          </div>

          <!-- About Section -->
          <div class="mb-8">
            <h3 class="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">About</h3>
            
            <div class="px-4 py-3.5 rounded-xl bg-surface border border-border">
              <div class="flex items-center gap-3">
                <div class="w-9 h-9 rounded-lg bg-text-primary flex items-center justify-center shadow-lg">
                  <svg class="w-5 h-5 text-background" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                  </svg>
                </div>
                <div>
                  <p class="text-sm font-medium text-text-primary">NoteX</p>
                  <p class="text-xs text-text-secondary mt-0.5">Version {{ appVersion }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Database Conflict Modal -->
  <Transition name="modal">
    <div 
      v-if="showConflictModal" 
      class="fixed inset-0 z-[60] flex items-center justify-center p-6"
      @click="handleCancelConflict"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-background-overlay"></div>
      
      <!-- Conflict Dialog -->
      <div 
        class="bg-surface border border-border rounded-2xl relative w-full max-w-md"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 py-5 border-b border-border">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-text-primary">Database Already Exists</h3>
              <p class="text-xs text-text-secondary mt-0.5">Choose how to proceed</p>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="px-6 py-5">
          <p class="text-sm text-text-primary mb-4">
            A database file already exists in the selected location. What would you like to do?
          </p>
          
          <div class="space-y-3">
            <!-- Use Existing Database -->
            <button
              @click="handleUseExisting"
              class="w-full px-4 py-3 rounded-xl bg-surface hover:bg-surface-hover border-2 border-border hover:border-border-hover transition-all text-left"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-text-primary">Use Existing Database</p>
                  <p class="text-xs text-text-secondary mt-0.5">Keep the database that's already there</p>
                </div>
              </div>
            </button>
            
            <!-- Backup and Overwrite -->
            <button
              @click="handleBackupAndOverwrite"
              class="w-full px-4 py-3 rounded-xl bg-surface hover:bg-surface-hover border-2 border-border hover:border-border-hover transition-all text-left"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-text-primary">Backup & Replace</p>
                  <p class="text-xs text-text-secondary mt-0.5">Create backup then overwrite with current notes</p>
                </div>
              </div>
            </button>
            
            <!-- Overwrite Existing -->
            <button
              @click="handleOverwriteExisting"
              class="w-full px-4 py-3 rounded-xl bg-surface hover:bg-surface-hover border-2 border-border hover:border-border-hover transition-all text-left"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-text-primary">Replace with Current Database</p>
                  <p class="text-xs text-text-secondary mt-0.5">Overwrite with your current notes (cannot be undone)</p>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-6 py-4 border-t border-border">
          <button
            @click="handleCancelConflict"
            class="w-full px-4 py-2.5 rounded-xl bg-surface-hover hover:bg-surface-active border border-border transition-all text-sm font-medium text-text-primary"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Transition>

  <!-- Database Import Modal -->
  <Transition name="modal">
    <div 
      v-if="showImportModal" 
      class="fixed inset-0 z-[60] flex items-center justify-center p-6"
      @click="handleCancelImport"
    >
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-background-overlay"></div>
      
      <!-- Import Dialog -->
      <div 
        class="bg-surface border border-border rounded-2xl relative w-full max-w-md"
        @click.stop
      >
        <!-- Header -->
        <div class="px-6 py-5 border-b border-border">
          <div class="flex items-center gap-3">
            <div class="w-10 h-10 rounded-xl bg-blue-500 flex items-center justify-center shadow-lg">
              <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
              </svg>
            </div>
            <div>
              <h3 class="text-lg font-semibold text-text-primary">Import Database</h3>
              <p class="text-xs text-text-secondary mt-0.5">This will replace your current database</p>
            </div>
          </div>
        </div>
        
        <!-- Content -->
        <div class="px-6 py-5">
          <p class="text-sm text-text-primary mb-4">
            You have an existing database. Would you like to create a backup before importing?
          </p>
          
          <div class="space-y-3">
            <!-- Import with Backup -->
            <button
              @click="handleImportWithBackup"
              class="w-full px-4 py-3 rounded-xl bg-surface hover:bg-surface-hover border-2 border-border hover:border-border-hover transition-all text-left"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-text-primary">Create Backup & Import</p>
                  <p class="text-xs text-text-secondary mt-0.5">Backup current database before importing (recommended)</p>
                </div>
              </div>
            </button>
            
            <!-- Import without Backup -->
            <button
              @click="handleImportWithoutBackup"
              class="w-full px-4 py-3 rounded-xl bg-surface hover:bg-surface-hover border-2 border-border hover:border-border-hover transition-all text-left"
            >
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center flex-shrink-0">
                  <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" stroke-width="2">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"/>
                  </svg>
                </div>
                <div class="flex-1">
                  <p class="text-sm font-medium text-text-primary">Import Without Backup</p>
                  <p class="text-xs text-text-secondary mt-0.5">Replace current database (cannot be undone)</p>
                </div>
              </div>
            </button>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="px-6 py-4 border-t border-border">
          <button
            @click="handleCancelImport"
            class="w-full px-4 py-2.5 rounded-xl bg-surface-hover hover:bg-surface-active border border-border transition-all text-sm font-medium text-text-primary"
          >
            Cancel
          </button>
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

.modal-enter-active .bg-surface,
.modal-leave-active .bg-surface {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from .bg-surface,
.modal-leave-to .bg-surface {
  transform: scale(0.95);
  opacity: 0;
}
</style>
