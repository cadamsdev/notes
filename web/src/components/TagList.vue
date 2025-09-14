<script setup lang="ts">
interface Tag {
  name: string;
  color: string;
  count: number;
}

interface Props {
  tags: Tag[];
  selectedTags?: string[];
  showAddButton?: boolean;
  layout?: 'list' | 'grid';
}

const props = withDefaults(defineProps<Props>(), {
  selectedTags: () => [],
  showAddButton: true,
  layout: 'list'
});

const emit = defineEmits<{
  tagClick: [tagName: string];
  addTag: [];
}>();

const handleTagClick = (tagName: string) => {
  emit('tagClick', tagName);
};

const handleAddTag = () => {
  emit('addTag');
};

const isSelected = (tagName: string) => {
  return props.selectedTags.includes(tagName);
};
</script>

<template>
  <div class="tag-list">
    <h3 class="text-lg font-medium text-gray-100 mb-4">Tags</h3>
    
    <!-- List Layout (Desktop) -->
    <div v-if="layout === 'list'" class="space-y-2">
      <button 
        v-for="tag in tags" 
        :key="tag.name"
        @click="handleTagClick(tag.name)"
        class="flex items-center w-full px-3 py-2 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-left"
        :class="{ 'bg-gray-700': isSelected(tag.name) }"
      >
        <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: tag.color }"></div>
        <span class="text-gray-200 flex-1">{{ tag.name }}</span>
        <span class="text-gray-400 text-sm">{{ tag.count }}</span>
      </button>
    </div>
    
    <!-- Grid Layout (Mobile) -->
    <div v-else class="grid grid-cols-2 gap-2">
      <button 
        v-for="tag in tags" 
        :key="tag.name"
        @click="handleTagClick(tag.name)"
        class="flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors duration-200 text-left"
        :class="{ 'bg-gray-700': isSelected(tag.name) }"
      >
        <div class="w-3 h-3 rounded-full mr-3" :style="{ backgroundColor: tag.color }"></div>
        <div class="flex-1 min-w-0">
          <span class="text-gray-200 text-sm block truncate">{{ tag.name }}</span>
          <span class="text-gray-400 text-xs">{{ tag.count }}</span>
        </div>
      </button>
    </div>
    
    <!-- Add Tag Button -->
    <button 
      v-if="showAddButton"
      @click="handleAddTag"
      class="mt-4 w-full px-3 py-2 lg:py-3 border-2 border-dashed border-gray-600 rounded-lg text-gray-400 hover:border-gray-500 hover:text-gray-300 transition-colors duration-200"
    >
      + Add Tag
    </button>
  </div>
</template>
