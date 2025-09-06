<template>
  <article 
    class="group cursor-pointer transition-all duration-200 bg-card-bg hover:bg-card-hover rounded-lg p-4 border border-card-border"
    @click="$emit('click', note)"
  >
    <!-- Header with timestamp and actions -->
    <div class="flex items-center justify-between mb-3">
      <div class="flex items-center gap-2 text-xs text-text-muted">
        <span>{{ formatTimeAgo(note.created_at) }}</span>
        <span v-if="note.updated_at && note.updated_at !== note.created_at">
          • edited
        </span>
      </div>
      
      <!-- Actions -->
      <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button 
          @click.stop="$emit('edit-tags', note)"
          class="p-1 hover:bg-bg-hover rounded text-text-muted hover:text-text-primary"
          title="Edit tags"
        >
          <Icon name="fluent:tag-20-regular" size="14" />
        </button>
        <button 
          @click.stop
          class="p-1 hover:bg-bg-hover rounded text-text-muted hover:text-text-primary"
          title="More options"
        >
          <Icon name="fluent:more-horizontal-20-filled" size="14" />
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="mb-3">
      <div class="text-text-primary text-sm leading-relaxed whitespace-pre-wrap">
        {{ getContentPreview(note.content) }}
      </div>
    </div>

    <!-- Tags and footer -->
    <div class="flex items-center justify-between">
      <div class="flex flex-wrap gap-1">
        <span 
          v-for="tag in note.tags?.slice(0, 3)" 
          :key="tag.id"
          class="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs"
          :style="{ 
            backgroundColor: tag.color + '20', 
            color: tag.color 
          }"
        >
          <span class="text-xs">#</span>{{ tag.name }}
        </span>
        <span 
          v-if="note.tags && note.tags.length > 3"
          class="text-xs text-text-muted"
        >
          +{{ note.tags.length - 3 }} more
        </span>
      </div>
      
      <!-- Referenced indicator -->
      <div v-if="hasReferences" class="flex items-center gap-1 text-xs text-text-muted">
        <Icon name="fluent:arrow-reply-20-filled" size="12" />
        <span>Referenced by (1)</span>
      </div>
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

// Computed
const hasReferences = computed(() => false); // TODO: Implement reference tracking

// Helper functions
const formatTimeAgo = (dateString?: string) => {
  if (!dateString) return 'Unknown';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString();
};

const getContentPreview = (content?: string) => {
  if (!content) return 'No content';
  
  // If content is just whitespace or empty
  if (!content.trim()) return 'No content';
  
  try {
    const parsed = JSON.parse(content);
    
    // TipTap JSON structure: { type: "doc", content: [{ type: "paragraph", content: [{ type: "text", text: "..." }] }] }
    const extractTextFromTipTap = (node: any): string => {
      let text = '';
      
      // If this is a text node, return its text
      if (node && node.type === 'text' && node.text) {
        return node.text;
      }
      
      // If this node has content array, process each item
      if (node && node.content && Array.isArray(node.content)) {
        for (const child of node.content) {
          const childText = extractTextFromTipTap(child);
          if (childText) {
            text += childText + ' ';
          }
        }
      }
      
      return text;
    };
    
    const fullText = extractTextFromTipTap(parsed);
    const preview = fullText.trim().substring(0, 200);
    return preview || 'No content';
  } catch (error) {
    // If parsing fails, treat as plain text
    return content.substring(0, 200);
  }
};
</script>
