<script setup lang="ts">
import { ref, computed } from 'vue';

interface Props {
  title?: string;
  content?: string;
  tags?: string[];
  autoSave?: boolean;
  autoSaveDelay?: number;
  placeholder?: string;
  titlePlaceholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: '',
  tags: () => [],
  autoSave: true,
  autoSaveDelay: 500,
  placeholder: 'Start writing your note...',
  titlePlaceholder: 'Note title...'
});

const emit = defineEmits<{
  titleChange: [title: string];
  contentChange: [content: string];
  save: [data: { title: string; content: string; tags: string[] }];
  tagAdd: [tagName: string];
  tagRemove: [tagName: string];
}>();

const titleValue = ref(props.title);
const contentValue = ref(props.content);
const selectedTags = ref([...props.tags]);
const isAutoSaving = ref(false);
const saveTimeout = ref<number | null>(null);

const handleTitleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  titleValue.value = target.value;
  emit('titleChange', titleValue.value);
  
  if (props.autoSave) {
    scheduleAutoSave();
  }
};

const handleContentChange = (event: Event) => {
  const target = event.target as HTMLDivElement;
  contentValue.value = target.textContent || '';
  emit('contentChange', contentValue.value);
  
  if (props.autoSave) {
    scheduleAutoSave();
  }
};

const scheduleAutoSave = () => {
  if (saveTimeout.value) {
    clearTimeout(saveTimeout.value);
  }
  
  isAutoSaving.value = true;
  
  saveTimeout.value = window.setTimeout(() => {
    handleSave();
    isAutoSaving.value = false;
  }, props.autoSaveDelay);
};

const handleSave = () => {
  emit('save', {
    title: titleValue.value,
    content: contentValue.value,
    tags: selectedTags.value
  });
};

const handleTagAdd = () => {
  // In a real app, this would open a tag selector modal
  const newTag = 'work'; // Placeholder
  if (!selectedTags.value.includes(newTag)) {
    selectedTags.value.push(newTag);
    emit('tagAdd', newTag);
  }
};

const handleTagRemove = (tagName: string) => {
  selectedTags.value = selectedTags.value.filter(tag => tag !== tagName);
  emit('tagRemove', tagName);
};

// Auto-save status message
const autoSaveStatus = computed(() => {
  if (isAutoSaving.value) {
    return 'Auto-saving...';
  }
  return 'Saved';
});
</script>

<template>
  <div class="bg-gray-800 border-b border-gray-700 p-4 lg:p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Title Input -->
      <input 
        v-model="titleValue"
        @input="handleTitleChange"
        type="text" 
        :placeholder="titlePlaceholder"
        class="w-full bg-transparent text-lg lg:text-xl font-medium text-gray-100 placeholder-gray-500 border-none outline-none mb-3 lg:mb-4"
      />
      
      <!-- Content Editor -->
      <div class="min-h-24 lg:min-h-32 p-3 lg:p-4 bg-gray-750 rounded-lg border border-gray-600 focus-within:border-blue-500 transition-colors duration-200">
        <div 
          contenteditable="true"
          @input="handleContentChange"
          class="outline-none text-gray-200 placeholder-gray-500 leading-relaxed text-sm lg:text-base"
          :data-placeholder="placeholder"
        >{{ contentValue }}</div>
      </div>
      
      <!-- Editor Toolbar -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0">
        <div class="flex items-center space-x-4">
          <!-- Tag Selector -->
          <div class="flex items-center space-x-2">
            <span class="text-sm text-gray-400 hidden sm:inline">Tags:</span>
            <div class="flex flex-wrap gap-1">
              <span 
                v-for="tag in selectedTags" 
                :key="tag"
                class="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded-full"
              >
                {{ tag }}
                <button 
                  @click="handleTagRemove(tag)"
                  class="ml-1 hover:text-gray-300 transition-colors duration-200"
                >
                  ×
                </button>
              </span>
              <button 
                @click="handleTagAdd"
                class="px-2 py-1 border border-gray-600 text-gray-400 text-xs rounded-full hover:border-gray-500 transition-colors duration-200"
              >
                + Add
              </button>
            </div>
          </div>
        </div>
        
        <div class="flex items-center justify-between sm:justify-end space-x-3">
          <span 
            v-if="autoSave"
            class="text-sm text-gray-400"
          >
            {{ autoSaveStatus }}
          </span>
          <button 
            @click="handleSave"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 text-sm"
          >
            Save Note
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
/* Contenteditable placeholder styling */
[contenteditable][data-placeholder]:empty:before {
  content: attr(data-placeholder);
  color: #9ca3af;
}

[contenteditable]:focus {
  outline: none;
}
</style>
