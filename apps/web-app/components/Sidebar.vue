<template>
  <div class="h-screen sticky top-0 bg-bg border-r border-bg-border flex flex-col">
    <!-- Header -->
    <div class="p-4 border-b border-bg-border">
      <div class="flex items-center gap-3 mb-4">
        <div class="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <Icon name="fluent:note-20-filled" size="20" class="text-white" />
        </div>
        <h1 class="text-lg font-bold text-text-primary-emphasis">Notes</h1>
      </div>
      
      <NuxtLink 
        to="/"
        class="flex items-center gap-3 p-3 rounded-lg hover:bg-bg-hover text-text-primary hover:text-text-primary-emphasis transition-colors"
      >
        <Icon name="fluent:home-20-filled" size="20" />
        <span>Home</span>
      </NuxtLink>
    </div>

    <!-- Quick Stats -->
    <div class="p-4 border-b border-bg-border">
      <div class="grid grid-cols-2 gap-3">
        <div class="bg-bg-secondary rounded-lg p-3">
          <div class="text-2xl font-bold text-text-primary-emphasis">{{ notes.length }}</div>
          <div class="text-xs text-text-secondary">Notes</div>
        </div>
        <div class="bg-bg-secondary rounded-lg p-3">
          <div class="text-2xl font-bold text-text-primary-emphasis">{{ activeTags.length }}</div>
          <div class="text-xs text-text-secondary">Tags</div>
        </div>
      </div>
    </div>

    <!-- Tags Section -->
    <div class="flex-1 overflow-hidden flex flex-col">
      <div class="p-4 border-b border-bg-border">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-medium text-text-primary-emphasis">Tags</h2>
          <button 
            @click="toggleSortTags"
            class="p-1 hover:bg-bg-hover rounded text-text-secondary hover:text-text-primary"
          >
            <Icon v-if="settings.tagSort === TAG_SORT_COUNT" name="mingcute:numbers-90-sort-descending-line" size="16" />
            <Icon v-if="settings.tagSort === TAG_SORT_NAME" name="mingcute:az-sort-ascending-letters-line" size="16" />
          </button>
        </div>
      </div>

      <!-- Tags List -->
      <div class="flex-1 overflow-y-auto p-4">
        <div class="space-y-1">
          <button 
            v-for="tag in filteredTags" 
            :key="tag.id"
            class="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-bg-hover text-left group transition-colors"
            @click="selectTag(tag)"
          >
            <ColorDot :color="tag.color" />
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between">
                <span class="text-sm text-text-primary truncate">{{ tag.name }}</span>
                <span class="text-xs text-text-secondary">{{ tag.count }}</span>
              </div>
            </div>
          </button>
        </div>
        
        <div v-if="filteredTags.length === 0" class="text-center py-8 text-text-secondary">
          <Icon name="fluent:tag-20-regular" size="32" class="mx-auto mb-2 opacity-50" />
          <p class="text-sm">No tags yet</p>
        </div>
      </div>
    </div>

    <!-- Settings -->
    <div class="p-4 border-t border-bg-border">
      <button 
        @click="openModal(MODAL_SETTINGS)" 
        class="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-bg-hover text-text-primary hover:text-text-primary-emphasis transition-colors"
      >
        <Icon name="fluent:settings-20-filled" size="20" />
        <span>Settings</span>
      </button>
    </div>
  </div>

  <!-- Settings Modal -->
  <Dialog :id="MODAL_SETTINGS">
    <div class="max-w-lg">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <div class="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
          <Icon name="fluent:settings-20-filled" size="20" class="text-primary" />
        </div>
        <div>
          <h2 class="text-xl font-bold text-text-primary-emphasis">Settings</h2>
          <p class="text-sm text-text-secondary">Manage your notes and preferences</p>
        </div>
      </div>
      
      <div class="space-y-6">
        <!-- Appearance Section -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Icon name="fluent:paint-brush-20-filled" size="16" class="text-primary" />
            Appearance
          </h3>
          <div class="bg-bg-secondary rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-text-primary">View Mode</div>
                <div class="text-xs text-text-secondary">Choose how notes are displayed</div>
              </div>
              <div class="flex bg-bg-hover rounded-lg p-1">
                <button class="px-3 py-1.5 text-xs rounded-md bg-primary text-white">
                  <Icon name="fluent:grid-20-filled" size="14" />
                </button>
                <button class="px-3 py-1.5 text-xs rounded-md text-text-secondary hover:text-text-primary">
                  <Icon name="fluent:list-20-filled" size="14" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tags Section -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Icon name="fluent:tag-20-filled" size="16" class="text-primary" />
            Tags
          </h3>
          <div class="bg-bg-secondary rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <div>
                <div class="text-sm font-medium text-text-primary">Default Sort</div>
                <div class="text-xs text-text-secondary">How tags are sorted in the sidebar</div>
              </div>
              <div class="flex bg-bg-hover rounded-lg p-1">
                <button 
                  @click="updateSettings(TAG_SORT_COUNT)"
                  :class="[
                    'px-3 py-1.5 text-xs rounded-md transition-colors',
                    settings.tagSort === TAG_SORT_COUNT 
                      ? 'bg-primary text-white' 
                      : 'text-text-secondary hover:text-text-primary'
                  ]"
                >
                  Count
                </button>
                <button 
                  @click="updateSettings(TAG_SORT_NAME)"
                  :class="[
                    'px-3 py-1.5 text-xs rounded-md transition-colors',
                    settings.tagSort === TAG_SORT_NAME 
                      ? 'bg-primary text-white' 
                      : 'text-text-secondary hover:text-text-primary'
                  ]"
                >
                  Name
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Data Management Section -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Icon name="fluent:database-20-filled" size="16" class="text-primary" />
            Data Management
          </h3>
          <div class="bg-bg-secondary rounded-xl p-4 space-y-3">
            <Button variant="secondary" class="w-full justify-start" @click="exportNotes">
              <Icon name="fluent:cloud-arrow-down-20-filled" size="16" class="mr-3" />
              <div class="text-left">
                <div class="text-sm font-medium">Export Notes</div>
                <div class="text-xs text-text-secondary">Download all your notes as JSON</div>
              </div>
            </Button>
            
            <Button variant="secondary" class="w-full justify-start">
              <Icon name="fluent:cloud-arrow-up-20-filled" size="16" class="mr-3" />
              <div class="text-left">
                <div class="text-sm font-medium">Import Notes</div>
                <div class="text-xs text-text-secondary">Upload notes from a JSON file</div>
              </div>
            </Button>
          </div>
        </div>

        <!-- Stats Section -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Icon name="fluent:data-usage-20-filled" size="16" class="text-primary" />
            Statistics
          </h3>
          <div class="bg-bg-secondary rounded-xl p-4">
            <div class="grid grid-cols-2 gap-4">
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">{{ notes.length }}</div>
                <div class="text-xs text-text-secondary">Total Notes</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">{{ activeTags.length }}</div>
                <div class="text-xs text-text-secondary">Active Tags</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">{{ totalWords }}</div>
                <div class="text-xs text-text-secondary">Total Words</div>
              </div>
              <div class="text-center">
                <div class="text-2xl font-bold text-primary">{{ Math.ceil(notes.length / 7) }}</div>
                <div class="text-xs text-text-secondary">Notes/Week</div>
              </div>
            </div>
          </div>
        </div>

        <!-- About Section -->
        <div class="space-y-3">
          <h3 class="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Icon name="fluent:info-20-filled" size="16" class="text-primary" />
            About
          </h3>
          <div class="bg-bg-secondary rounded-xl p-4 space-y-3">
            <div class="flex items-center justify-between">
              <span class="text-sm text-text-secondary">Version</span>
              <span class="text-sm font-medium text-text-primary">1.0.0</span>
            </div>
            <div class="flex items-center justify-between">
              <span class="text-sm text-text-secondary">Last Updated</span>
              <span class="text-sm font-medium text-text-primary">{{ new Date().toLocaleDateString() }}</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="flex items-center justify-between mt-8 pt-6 border-t border-bg-border">
        <Button variant="secondary" @click="resetToDefaults" class="text-text-secondary hover:text-red-400">
          <Icon name="fluent:arrow-reset-20-filled" size="16" class="mr-2" />
          Reset to Defaults
        </Button>
        <div class="flex gap-2">
          <Button variant="secondary" @click="closeModal">Cancel</Button>
          <Button variant="primary" @click="saveAndClose">Save Changes</Button>
        </div>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
const { selectTag, filteredTags, notes } = useNotes();
const { openModal, closeModal } = useModal();
const { updateSettings, settings } = useSettings();

const MODAL_SETTINGS = 'modal-settings';
const TAG_SORT_COUNT = 0;
const TAG_SORT_NAME = 1;

// Computed
const activeTags = computed(() => {
  return filteredTags.value.filter(tag => tag.count && tag.count > 0);
});

const totalWords = computed(() => {
  return notes.value.reduce((total, note) => {
    if (!note.content) return total;
    try {
      // Extract text from TipTap JSON and count words
      const parsed = JSON.parse(note.content);
      const extractText = (node: any): string => {
        if (node?.type === 'text' && node.text) return node.text;
        if (node?.content && Array.isArray(node.content)) {
          return node.content.map(extractText).join(' ');
        }
        return '';
      };
      const text = extractText(parsed);
      const wordCount = text.trim().split(/\s+/).filter(word => word.length > 0).length;
      return total + wordCount;
    } catch {
      return total;
    }
  }, 0);
});

// Methods
const toggleSortTags = () => {
  const newSort = settings.value.tagSort === TAG_SORT_COUNT ? TAG_SORT_NAME : TAG_SORT_COUNT;
  updateSettings(newSort);
};

const exportNotes = async () => {
  try {
    const dataStr = JSON.stringify(notes.value, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `notes-export-${new Date().toISOString().split('T')[0]}.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  } catch (error) {
    console.error('Error exporting notes:', error);
  }
};

const resetToDefaults = async () => {
  if (confirm('Are you sure you want to reset all settings to defaults? This cannot be undone.')) {
    try {
      await updateSettings(TAG_SORT_COUNT);
    } catch (error) {
      console.error('Error resetting settings:', error);
    }
  }
};

const saveAndClose = () => {
  // Settings are saved automatically when changed
  closeModal();
};
</script>
