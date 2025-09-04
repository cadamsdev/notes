<template>
  <article 
    :class="[
      'group cursor-pointer transition-all duration-200',
      isGridView 
        ? 'bg-bg-secondary hover:bg-bg-hover rounded-xl p-4 border border-bg-border hover:border-primary/20' 
        : 'border-b border-bg-border hover:bg-bg-secondary/50 p-4'
    ]"
    @click="$emit('click', note)"
  >
    <!-- Header -->
    <div class="flex items-start justify-between mb-3">
      <div class="flex items-center gap-2 flex-1 min-w-0">
        <div class="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
          <Icon name="fluent:note-20-filled" size="16" class="text-primary" />
        </div>
        <div class="flex-1 min-w-0">
          <h3 class="text-text-primary-emphasis font-medium text-sm line-clamp-1">
            {{ note.title || 'Untitled' }}
          </h3>
          <p class="text-text-secondary text-xs">
            {{ formatDate(note.created_at) }}
          </p>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          @click.stop="$emit('edit-tags', note)"
          class="p-1 hover:bg-bg-hover rounded text-text-secondary hover:text-text-primary"
          title="Edit tags"
        >
          <Icon name="fluent:tag-20-regular" size="16" />
        </button>
        <button 
          @click.stop="$emit('delete', note)"
          class="p-1 hover:bg-red-500/10 rounded text-text-secondary hover:text-red-400"
          title="Delete note"
        >
          <Icon name="fluent:delete-20-regular" size="16" />
        </button>
      </div>
    </div>

    <!-- Content preview -->
    <div class="mb-3">
      <div 
        class="text-gray-200 text-sm leading-relaxed"
        :class="isGridView ? 'line-clamp-4' : 'line-clamp-2'"
      >
        {{ getContentPreview(note.content) }}
      </div>
    </div>

    <!-- Tags -->
    <div v-if="note.tags && note.tags.length > 0" class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="tag in note.tags.slice(0, isGridView ? 4 : 3)"
        :key="tag.id"
        class="inline-flex items-center gap-1 px-2 py-1 bg-bg-hover rounded-full text-xs text-text-secondary"
      >
        <ColorDot :color="tag.color" :size="6" />
        {{ tag.name }}
      </span>
      <span 
        v-if="note.tags.length > (isGridView ? 4 : 3)" 
        class="px-2 py-1 text-xs text-text-secondary"
      >
        +{{ note.tags.length - (isGridView ? 4 : 3) }} more
      </span>
    </div>

    <!-- Footer stats -->
    <div class="flex items-center justify-between text-xs text-text-secondary">
      <div class="flex items-center gap-3">
        <span class="flex items-center gap-1">
          <Icon name="fluent:text-character-count-20-regular" size="12" />
          {{ getWordCount(note.content) }} words
        </span>
        <span v-if="hasCodeBlocks(note.content)" class="flex items-center gap-1">
          <Icon name="fluent:code-20-regular" size="12" />
          Code
        </span>
      </div>
      <time :datetime="note.updated_at">
        {{ formatRelativeTime(note.updated_at) }}
      </time>
    </div>
  </article>
</template>

<script setup lang="ts">
interface Props {
  note: Note;
  isGridView?: boolean;
}

defineProps<Props>();

defineEmits<{
  click: [note: Note];
  delete: [note: Note];
  'edit-tags': [note: Note];
}>();

// Helper functions
const getContentPreview = (content?: string) => {
  if (!content) return 'No content';
  
  // If content is just whitespace or empty
  if (!content.trim()) return 'No content';
  
  try {
    const parsed = JSON.parse(content);
    
    // Simple recursive function to extract all text
    const extractAllText = (obj: any): string => {
      if (!obj) return '';
      
      let text = '';
      
      // If this is a text node, return its text
      if (obj.type === 'text' && obj.text) {
        return obj.text;
      }
      
      // If this object has content array, process it
      if (obj.content && Array.isArray(obj.content)) {
        for (const item of obj.content) {
          text += extractAllText(item) + ' ';
        }
      }
      
      // If this is an object, check all its properties
      if (typeof obj === 'object' && obj !== null) {
        for (const key in obj) {
          if (key !== 'type' && obj[key]) {
            text += extractAllText(obj[key]);
          }
        }
      }
      
      return text;
    };
    
    const extractedText = extractAllText(parsed).trim();
    
    if (extractedText && extractedText.length > 0) {
      // Limit preview length
      return extractedText.length > 300 ? extractedText.substring(0, 300) + '...' : extractedText;
    }
    
    return 'Start writing...';
  } catch (error) {
    // If JSON parsing fails, treat as plain text
    console.log('JSON parse error, treating as plain text:', error);
    const plainText = content.trim();
    if (plainText.length > 0) {
      return plainText.length > 300 ? plainText.substring(0, 300) + '...' : plainText;
    }
    return 'No content';
  }
};

const getWordCount = (content?: string) => {
  const text = getContentPreview(content);
  return text.split(/\s+/).filter(word => word.length > 0).length;
};

const hasCodeBlocks = (content?: string) => {
  if (!content) return false;
  try {
    const parsed = JSON.parse(content);
    const hasCode = (node: any): boolean => {
      if (node.type === 'codeBlock') return true;
      if (node.content) {
        return node.content.some(hasCode);
      }
      return false;
    };
    return parsed.content?.some(hasCode) || false;
  } catch {
    return content.includes('```');
  }
};

const formatDate = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString();
};

const formatRelativeTime = (dateString?: string) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffHours < 1) return 'now';
  if (diffHours < 24) return `${diffHours}h`;
  if (diffDays < 7) return `${diffDays}d`;
  return date.toLocaleDateString();
};
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-4 {
  display: -webkit-box;
  -webkit-line-clamp: 4;
  line-clamp: 4;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
