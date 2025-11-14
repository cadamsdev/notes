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
    isCustomLocation.value =
      dbDir.includes('Google Drive') ||
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
      const dbExists = await invoke<boolean>('check_database_exists_cmd', {
        directoryPath: selected,
      });

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

const applyDatabaseLocationChange = async (
  directory: string,
  overwrite: boolean,
  backup: boolean = false,
) => {
  try {
    const newPath = await invoke<string>('set_database_directory_cmd', {
      directoryPath: directory,
      overwrite: overwrite,
      backup: backup,
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
  if (
    !confirm(
      'Reset database location to default? The current database will be copied to the default location.',
    )
  ) {
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
    const backupPath = await invoke<string>('create_database_backup_cmd', {
      dbPath,
    });
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
      filters: [
        {
          name: 'Database',
          extensions: ['db'],
        },
      ],
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

const applyDatabaseImport = async (
  sourcePath: string,
  createBackup: boolean,
) => {
  try {
    await invoke<string>('import_database_cmd', {
      sourcePath: sourcePath,
      createBackup: createBackup,
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
    <div v-if="isOpen" class="modal-overlay" @click="closeSettings">
      <!-- Backdrop -->
      <div class="backdrop"></div>

      <!-- Settings Panel -->
      <div class="panel" @click.stop>
        <!-- Header -->
        <div class="panel-header">
          <div class="header-content">
            <div class="header-info">
              <div class="icon-container">
                <svg
                  class="icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
              </div>
              <div>
                <h2 class="title">Settings</h2>
                <p class="subtitle">Manage your app preferences</p>
              </div>
            </div>
            <button @click="closeSettings" class="close-button">
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Settings Content -->
        <div class="panel-content">
          <!-- Database Section -->
          <div class="section">
            <h3 class="section-title">Database</h3>

            <div class="section-items">
              <!-- Database Location Info -->
              <div class="info-card">
                <div class="info-card-content">
                  <div class="info-card-main">
                    <div class="info-icon">
                      <svg
                        class="icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                        />
                      </svg>
                    </div>
                    <div class="info-text">
                      <div class="info-header">
                        <p class="info-label">Database Location</p>
                        <span v-if="isCustomLocation" class="badge"
                          >Custom</span
                        >
                      </div>
                      <p class="info-path">{{ databaseDirectory }}</p>
                    </div>
                  </div>
                  <!-- Create Backup Button -->
                  <button
                    @click="createDatabaseBackup"
                    class="backup-button"
                    title="Create backup"
                  >
                    <svg
                      class="icon-sm"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                      />
                    </svg>
                    <span class="backup-text">Backup</span>
                  </button>
                </div>
              </div>

              <!-- Change Database Location -->
              <button @click="changeDatabaseLocation" class="action-button">
                <div class="action-content">
                  <div class="action-icon">
                    <svg
                      class="icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                      />
                    </svg>
                  </div>
                  <div class="action-text">
                    <p class="action-label">Change Database Location</p>
                    <p class="action-description">
                      Move database to cloud storage (OneDrive, Google Drive)
                    </p>
                  </div>
                </div>
                <svg
                  class="chevron"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <!-- Reset to Default Location -->
              <button
                v-if="isCustomLocation"
                @click="resetDatabaseLocation"
                class="action-button"
              >
                <div class="action-content">
                  <div class="action-icon">
                    <svg
                      class="icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                  </div>
                  <div class="action-text">
                    <p class="action-label">Reset to Default Location</p>
                    <p class="action-description">
                      Move database back to app data directory
                    </p>
                  </div>
                </div>
                <svg
                  class="chevron"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>

              <!-- Open Database Location -->
              <button @click="openDatabaseLocation" class="action-button">
                <div class="action-content">
                  <div class="action-icon">
                    <svg
                      class="icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
                      />
                    </svg>
                  </div>
                  <div class="action-text">
                    <p class="action-label">Open Database Location</p>
                    <p class="action-description">
                      View the database file in your file explorer
                    </p>
                  </div>
                </div>
                <svg
                  class="chevron"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </button>

              <!-- Import Database -->
              <button @click="importDatabase" class="action-button">
                <div class="action-content">
                  <div class="action-icon">
                    <svg
                      class="icon"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      stroke-width="2"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                      />
                    </svg>
                  </div>
                  <div class="action-text">
                    <p class="action-label">Import Database</p>
                    <p class="action-description">
                      Import an existing database file from anywhere
                    </p>
                  </div>
                </div>
                <svg
                  class="chevron"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          </div>

          <!-- About Section -->
          <div class="section">
            <h3 class="section-title">About</h3>

            <div class="about-card">
              <div class="about-content">
                <div class="about-icon">
                  <svg
                    class="icon"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div>
                  <p class="about-name">NoteX</p>
                  <p class="about-version">Version {{ appVersion }}</p>
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
      class="modal-overlay conflict-modal"
      @click="handleCancelConflict"
    >
      <!-- Backdrop -->
      <div class="backdrop"></div>

      <!-- Conflict Dialog -->
      <div class="conflict-dialog" @click.stop>
        <!-- Header -->
        <div class="dialog-header">
          <div class="dialog-header-content">
            <div class="dialog-icon warning">
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <div>
              <h3 class="dialog-title">Database Already Exists</h3>
              <p class="dialog-subtitle">Choose how to proceed</p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="dialog-content">
          <p class="dialog-description">
            A database file already exists in the selected location. What would
            you like to do?
          </p>

          <div class="dialog-options">
            <!-- Use Existing Database -->
            <button @click="handleUseExisting" class="option-button">
              <div class="option-content">
                <div class="option-icon blue">
                  <svg
                    class="icon-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div class="option-text">
                  <p class="option-label">Use Existing Database</p>
                  <p class="option-description">
                    Keep the database that's already there
                  </p>
                </div>
              </div>
            </button>

            <!-- Backup and Overwrite -->
            <button @click="handleBackupAndOverwrite" class="option-button">
              <div class="option-content">
                <div class="option-icon green">
                  <svg
                    class="icon-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                </div>
                <div class="option-text">
                  <p class="option-label">Backup & Replace</p>
                  <p class="option-description">
                    Create backup then overwrite with current notes
                  </p>
                </div>
              </div>
            </button>

            <!-- Overwrite Existing -->
            <button @click="handleOverwriteExisting" class="option-button">
              <div class="option-content">
                <div class="option-icon orange">
                  <svg
                    class="icon-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                </div>
                <div class="option-text">
                  <p class="option-label">Replace with Current Database</p>
                  <p class="option-description">
                    Overwrite with your current notes (cannot be undone)
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="dialog-footer">
          <button @click="handleCancelConflict" class="cancel-button">
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
      class="modal-overlay import-modal"
      @click="handleCancelImport"
    >
      <!-- Backdrop -->
      <div class="backdrop"></div>

      <!-- Import Dialog -->
      <div class="import-dialog" @click.stop>
        <!-- Header -->
        <div class="dialog-header">
          <div class="dialog-header-content">
            <div class="dialog-icon blue">
              <svg
                class="icon"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                stroke-width="2"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
            </div>
            <div>
              <h3 class="dialog-title">Import Database</h3>
              <p class="dialog-subtitle">
                This will replace your current database
              </p>
            </div>
          </div>
        </div>

        <!-- Content -->
        <div class="dialog-content">
          <p class="dialog-description">
            You have an existing database. Would you like to create a backup
            before importing?
          </p>

          <div class="dialog-options">
            <!-- Import with Backup -->
            <button @click="handleImportWithBackup" class="option-button">
              <div class="option-content">
                <div class="option-icon green">
                  <svg
                    class="icon-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                    />
                  </svg>
                </div>
                <div class="option-text">
                  <p class="option-label">Create Backup & Import</p>
                  <p class="option-description">
                    Backup current database before importing (recommended)
                  </p>
                </div>
              </div>
            </button>

            <!-- Import without Backup -->
            <button @click="handleImportWithoutBackup" class="option-button">
              <div class="option-content">
                <div class="option-icon orange">
                  <svg
                    class="icon-sm"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                    />
                  </svg>
                </div>
                <div class="option-text">
                  <p class="option-label">Import Without Backup</p>
                  <p class="option-description">
                    Replace current database (cannot be undone)
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Footer -->
        <div class="dialog-footer">
          <button @click="handleCancelImport" class="cancel-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/* Modal Overlay */
.modal-overlay {
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.modal-overlay.conflict-modal,
.modal-overlay.import-modal {
  z-index: 60;
}

.backdrop {
  position: absolute;
  inset: 0;
  background-color: var(--color-background-overlay);
}

/* Settings Panel */
.panel {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  position: relative;
  width: 100%;
  max-width: 42rem;
  max-height: 80vh;
  overflow: hidden;
}

/* Panel Header */
.panel-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-border);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.header-info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.icon-container {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  background-color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.icon-container .icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-background);
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
}

.close-button {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-secondary);
  transition:
    background-color 0.3s,
    color 0.3s;
}

.close-button:hover {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
}

.close-button .icon {
  width: 1.25rem;
  height: 1.25rem;
}

/* Panel Content */
.panel-content {
  padding: 1.5rem 2rem;
  overflow-y: auto;
  max-height: calc(80vh - 8.75rem);
}

/* Section */
.section {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.section-items {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Info Card */
.info-card {
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.info-card-content {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.75rem;
}

.info-card-main {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  flex: 1;
  min-width: 0;
}

.info-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 0.125rem;
}

.info-icon .icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-primary);
}

.info-text {
  flex: 1;
  min-width: 0;
}

.info-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.badge {
  padding: 0.125rem 0.5rem;
  border-radius: 0.375rem;
  background-color: var(--color-surface-active);
  color: var(--color-text-primary);
  font-size: 0.75rem;
  font-weight: 500;
}

.info-path {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  word-break: break-all;
  font-family: var(--font-family-mono);
}

.backup-button {
  padding: 0.5rem 0.75rem;
  border-radius: 0.5rem;
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-shrink: 0;
  transition: all 0.3s;
}

.backup-button:hover {
  background-color: var(--color-surface-active);
  border-color: var(--color-border-hover);
}

.icon-sm {
  width: 1rem;
  height: 1rem;
  color: var(--color-text-primary);
}

.backup-text {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

/* Action Button */
.action-button {
  width: 100%;
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: all 0.3s;
}

.action-button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-border-hover);
}

.action-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.action-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: colors 0.3s;
}

.action-icon .icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-primary);
}

.action-text {
  text-align: left;
}

.action-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.action-description {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
}

.chevron {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-text-secondary);
  transition: color 0.3s;
}

.action-button:hover .chevron {
  color: var(--color-text-primary);
}

/* About Card */
.about-card {
  padding: 0.875rem 1rem;
  border-radius: 0.75rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
}

.about-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.about-icon {
  width: 2.25rem;
  height: 2.25rem;
  border-radius: 0.5rem;
  background-color: var(--color-text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.about-icon .icon {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-background);
}

.about-name {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.about-version {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
}

/* Dialog */
.conflict-dialog,
.import-dialog {
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 1rem;
  position: relative;
  width: 100%;
  max-width: 28rem;
}

.dialog-header {
  padding: 1.25rem 1.5rem;
  border-bottom: 1px solid var(--color-border);
}

.dialog-header-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.dialog-icon {
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
}

.dialog-icon.warning {
  background-color: #f59e0b;
}

.dialog-icon.blue {
  background-color: #3b82f6;
}

.dialog-icon .icon {
  width: 1.25rem;
  height: 1.25rem;
  color: white;
}

.dialog-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
}

.dialog-subtitle {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
}

.dialog-content {
  padding: 1.25rem 1.5rem;
}

.dialog-description {
  font-size: 0.875rem;
  color: var(--color-text-primary);
  margin-bottom: 1rem;
}

.dialog-options {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

/* Option Button */
.option-button {
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  background-color: var(--color-surface);
  border: 2px solid var(--color-border);
  text-align: left;
  transition: all 0.3s;
}

.option-button:hover {
  background-color: var(--color-surface-hover);
  border-color: var(--color-border-hover);
}

.option-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.option-icon {
  width: 2rem;
  height: 2rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.option-icon.blue {
  background-color: #3b82f6;
}

.option-icon.green {
  background-color: #10b981;
}

.option-icon.orange {
  background-color: #f97316;
}

.option-icon .icon-sm {
  width: 1rem;
  height: 1rem;
  color: white;
}

.option-text {
  flex: 1;
}

.option-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.option-description {
  font-size: 0.75rem;
  color: var(--color-text-secondary);
  margin-top: 0.125rem;
}

.dialog-footer {
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--color-border);
}

.cancel-button {
  width: 100%;
  padding: 0.625rem 1rem;
  border-radius: 0.75rem;
  background-color: var(--color-surface-hover);
  border: 1px solid var(--color-border);
  transition: all 0.3s;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
}

.cancel-button:hover {
  background-color: var(--color-surface-active);
}

/* Modal transition animations */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .panel,
.modal-leave-active .panel,
.modal-enter-active .conflict-dialog,
.modal-leave-active .conflict-dialog,
.modal-enter-active .import-dialog,
.modal-leave-active .import-dialog {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal-enter-from .panel,
.modal-leave-to .panel,
.modal-enter-from .conflict-dialog,
.modal-leave-to .conflict-dialog,
.modal-enter-from .import-dialog,
.modal-leave-to .import-dialog {
  transform: scale(0.95);
  opacity: 0;
}
</style>
