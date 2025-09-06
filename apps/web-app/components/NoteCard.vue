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
      <div class="text-text-primary text-sm leading-relaxed">
        <editor-content v-if="editor" :editor="editor" class="note-content" />
        <div v-else class="text-text-muted">Loading content...</div>
      </div>
    </div>

    <!-- Tags and footer -->
    <div class="flex items-center justify-between">
      <div class="flex flex-wrap gap-1.5">
        <span 
          v-for="tag in note.tags?.slice(0, 3)" 
          :key="tag.id"
          class="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors hover:opacity-90 bg-bg-secondary border border-bg-border text-text-primary"
        >
          <div 
            class="w-1.5 h-1.5 rounded-full flex-shrink-0" 
            :style="{ backgroundColor: tag.color }"
          ></div>
          {{ tag.name }}
        </span>
        <span 
          v-if="note.tags && note.tags.length > 3"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs text-text-muted bg-bg-secondary border border-bg-border"
        >
          +{{ note.tags.length - 3 }}
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
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'
import CodeBlock from '@/lib/tiptap/extensions/CodeBlock';

interface Props {
  note: Note;
  isGridView?: boolean;
}

const props = defineProps<Props>();

defineEmits<{
  click: [note: Note];
  delete: [note: Note];
  'edit-tags': [note: Note];
}>();

// TipTap editor for read-only display
const editor = ref<Editor>();

// Computed
const hasReferences = computed(() => false); // TODO: Implement reference tracking

// Initialize read-only editor
onMounted(() => {
  let initialContent;
  
  try {
    // Try to parse existing content
    if (props.note.content && props.note.content.trim()) {
      initialContent = JSON.parse(props.note.content);
    } else {
      // Default empty content structure
      initialContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'No content'
              }
            ]
          }
        ]
      };
    }
  } catch (error) {
    // If parsing fails (e.g., content is plain text), create paragraph with that text
    if (props.note.content && props.note.content.trim()) {
      initialContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: props.note.content
              }
            ]
          }
        ]
      };
    } else {
      initialContent = {
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: 'No content'
              }
            ]
          }
        ]
      };
    }
  }

  editor.value = new Editor({
    extensions: [
      StarterKit.configure({ 
        codeBlock: false
      }),
      CodeBlock,
    ],
    content: initialContent,
    editable: false, // Read-only
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none note-card-content'
      }
    },
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

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

<style scoped>
.note-content :deep(.ProseMirror) {
  outline: none;
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgb(248 249 250);
  padding: 0;
}

.note-content :deep(.ProseMirror p) {
  margin: 0 0 0.75rem 0;
}

.note-content :deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}

.note-content :deep(.ProseMirror h1) {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgb(255 255 255);
}

.note-content :deep(.ProseMirror h2) {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgb(255 255 255);
}

.note-content :deep(.ProseMirror h3) {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgb(255 255 255);
}

.note-content :deep(.ProseMirror ul),
.note-content :deep(.ProseMirror ol) {
  margin: 0 0 0.75rem 0;
  padding-left: 1.25rem;
}

.note-content :deep(.ProseMirror li) {
  margin-bottom: 0.25rem;
}

.note-content :deep(.ProseMirror blockquote) {
  border-left: 3px solid rgb(88 166 255);
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: rgb(154 160 166);
  font-style: italic;
}

.note-content :deep(.ProseMirror code) {
  background-color: rgb(33 38 45);
  color: rgb(88 166 255);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

.note-content :deep(.ProseMirror pre) {
  background-color: rgb(13 17 23);
  border: 1px solid rgb(33 38 45);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 0.75rem 0;
  overflow-x: auto;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.8rem;
  line-height: 1.4;
}

.note-content :deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
  color: rgb(248 249 250);
}

.note-content :deep(.ProseMirror strong) {
  font-weight: 600;
  color: rgb(255 255 255);
}

.note-content :deep(.ProseMirror em) {
  font-style: italic;
}
</style>
