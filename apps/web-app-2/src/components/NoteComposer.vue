<script setup lang="ts">
import { ref, watch, onMounted } from 'vue';

interface Props {
  title?: string;
  content?: string;
  tags?: string[];
  placeholder?: string;
  titlePlaceholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  content: '',
  tags: () => [],
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
const contentEditor = ref<HTMLDivElement | null>(null);

// Watch for prop changes to update local state
watch(() => props.title, (newTitle) => {
  titleValue.value = newTitle;
});

watch(() => props.content, (newContent) => {
  contentValue.value = newContent;
  // Only update the editor if it's not currently focused (to avoid interfering with typing)
  if (contentEditor.value && document.activeElement !== contentEditor.value) {
    contentEditor.value.textContent = newContent;
  }
});

watch(() => props.tags, (newTags) => {
  selectedTags.value = [...newTags];
});

// Set initial content when component mounts
onMounted(() => {
  if (contentEditor.value) {
    contentEditor.value.textContent = props.content;
  }
});

const handleTitleChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  titleValue.value = target.value;
  emit('titleChange', titleValue.value);
};

const handleContentChange = (event: Event) => {
  const target = event.target as HTMLDivElement;
  contentValue.value = target.textContent || '';
  emit('contentChange', contentValue.value);
};

const handleSave = () => {
  emit('save', {
    title: titleValue.value,
    content: contentValue.value,
    tags: selectedTags.value
  });
};

const handleTagAdd = () => {
  // For demo purposes, cycle through available tags
  const availableTags = ['work', 'personal', 'ideas', 'meetings', 'tasks', 'writing'];
  const unusedTags = availableTags.filter(tag => !selectedTags.value.includes(tag));
  
  if (unusedTags.length > 0) {
    const newTag = unusedTags[0];
    selectedTags.value.push(newTag);
    emit('tagAdd', newTag);
  }
};

const handleTagRemove = (tagName: string) => {
  selectedTags.value = selectedTags.value.filter(tag => tag !== tagName);
  emit('tagRemove', tagName);
};
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
          ref="contentEditor"
          contenteditable="true"
          @input="handleContentChange"
          class="outline-none text-gray-200 placeholder-gray-500 leading-relaxed text-sm lg:text-base"
          :data-placeholder="placeholder"
        ></div>
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
        
        <div class="flex items-center justify-end space-x-3">
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
