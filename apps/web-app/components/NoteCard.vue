<template>
  <article 
    class="group transition-all duration-200 bg-card-bg hover:bg-card-hover rounded-lg p-4 border border-card-border"
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
          class="p-1 hover:bg-bg-hover rounded text-text-muted hover:text-text-primary relative"
          title="More options"
          @click="toggleDropdown"
          ref="moreOptionsButton"
        >
          <Icon name="fluent:more-horizontal-20-filled" size="14" />
          
          <!-- Dropdown Menu -->
          <Transition
            enter-active-class="transition-all duration-150 ease-out"
            enter-from-class="opacity-0 scale-95 translate-y-1"
            enter-to-class="opacity-100 scale-100 translate-y-0"
            leave-active-class="transition-all duration-100 ease-in"
            leave-from-class="opacity-100 scale-100 translate-y-0"
            leave-to-class="opacity-0 scale-95 translate-y-1"
          >
            <div 
              v-if="showDropdown" 
              class="absolute right-0 top-full mt-1 w-32 bg-bg-secondary border border-bg-border rounded-lg shadow-lg z-10"
              @click.stop
            >
              <button 
                @click="handleEdit"
                class="w-full px-3 py-2 text-left text-sm text-text-primary hover:bg-bg-hover rounded-t-lg flex items-center gap-2"
              >
                <Icon name="fluent:edit-20-regular" size="14" />
                Edit
              </button>
              <button 
                @click="handleDelete"
                class="w-full px-3 py-2 text-left text-sm text-red-400 hover:bg-bg-hover rounded-b-lg flex items-center gap-2"
              >
                <Icon name="fluent:delete-20-regular" size="14" />
                Delete
              </button>
            </div>
          </Transition>
        </button>
      </div>
    </div>

    <!-- Content -->
    <div class="mb-3">
      <div v-if="!isEditing" class="text-text-primary text-sm leading-relaxed">
        <editor-content v-if="editor" :editor="editor" class="note-content" />
        <div v-else class="text-text-muted">Loading content...</div>
      </div>
      
      <!-- Inline editor when editing -->
      <div v-else class="text-text-primary text-sm leading-relaxed">
        <editor-content v-if="editEditor" :editor="editEditor" class="note-content-editor" />
        <div v-else class="text-text-muted">Loading editor...</div>
        
        <!-- Edit actions -->
        <div class="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-bg-border">
          <button 
            @click="cancelEdit"
            class="px-3 py-1.5 text-xs bg-bg-secondary hover:bg-bg-hover text-text-muted hover:text-text-primary rounded transition-colors"
          >
            Cancel
          </button>
          <button 
            @click="saveEdit"
            class="px-3 py-1.5 text-xs bg-primary hover:bg-primary/90 text-white rounded transition-colors"
          >
            Save
          </button>
        </div>
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
    
    <!-- Delete Confirmation Modal -->
    <ConfirmationDialog 
      :id="`delete-note-${note.id}`"
      description="Are you sure you want to delete this note? This action cannot be undone."
      @action="confirmDelete"
    />
  </article>
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'
import CodeBlock from '@/lib/tiptap/extensions/CodeBlock';
import { nextTick } from 'vue';
import ConfirmationDialog from './ConfirmationDialog.vue';

interface Props {
  note: Note;
  isGridView?: boolean;
}

const props = defineProps<Props>();

// Get emit function
const emit = defineEmits<{
  click: [note: Note];
  delete: [note: Note];
  'edit-tags': [note: Note];
  edit: [note: Note];
  save: [note: Note];
}>();

// Modal functionality
const { openModal } = useModal();

// TipTap editor for read-only display
const editor = ref<Editor>();
const editEditor = ref<Editor>();

// Dropdown state
const showDropdown = ref(false);
const moreOptionsButton = ref<HTMLElement>();

// Edit state
const isEditing = ref(false);
const originalContent = ref('');

// Computed
const hasReferences = computed(() => false); // TODO: Implement reference tracking

// Dropdown functions
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const handleEdit = () => {
  showDropdown.value = false;
  startEditing();
};

const handleDelete = () => {
  showDropdown.value = false;
  openModal(`delete-note-${props.note.id}`);
};

const confirmDelete = () => {
  emit('delete', props.note);
};

// Edit functions
const startEditing = () => {
  isEditing.value = true;
  originalContent.value = props.note.content || '';
  
  // Initialize edit editor
  nextTick(() => {
    let initialContent;
    
    try {
      if (props.note.content && props.note.content.trim()) {
        initialContent = JSON.parse(props.note.content);
      } else {
        initialContent = {
          type: 'doc',
          content: [
            {
              type: 'paragraph',
              content: []
            }
          ]
        };
      }
    } catch (error) {
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
              content: []
            }
          ]
        };
      }
    }

    editEditor.value = new Editor({
      extensions: [
        StarterKit.configure({ 
          codeBlock: false
        }),
        CodeBlock,
      ],
      content: initialContent,
      editable: true,
      editorProps: {
        attributes: {
          class: 'prose prose-invert max-w-none focus:outline-none note-card-content-editor'
        }
      },
    });
  });
};

const cancelEdit = () => {
  isEditing.value = false;
  editEditor.value?.destroy();
  editEditor.value = undefined;
};

const saveEdit = () => {
  if (!editEditor.value) return;
  
  const content = JSON.stringify(editEditor.value.getJSON());
  const updatedNote = {
    ...props.note,
    content: content
  };
  
  emit('save', updatedNote);
  isEditing.value = false;
  
  // Update the read-only editor with new content
  editor.value?.commands.setContent(editEditor.value.getJSON());
  
  editEditor.value?.destroy();
  editEditor.value = undefined;
};

// Close dropdown when clicking outside
const closeDropdown = (event: MouseEvent) => {
  if (moreOptionsButton.value && !moreOptionsButton.value.contains(event.target as Node)) {
    showDropdown.value = false;
  }
};

// Initialize read-only editor
onMounted(() => {
  // Add click listener to close dropdown when clicking outside
  document.addEventListener('click', closeDropdown);
  
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
  editEditor.value?.destroy();
  document.removeEventListener('click', closeDropdown);
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

/* Edit mode styles */
.note-content-editor :deep(.ProseMirror) {
  outline: none;
  font-size: 0.875rem;
  line-height: 1.5;
  color: rgb(248 249 250);
  padding: 0.75rem;
  border: 1px solid rgb(88 166 255);
  border-radius: 0.375rem;
  background-color: rgb(13 17 23);
  min-height: 100px;
}

.note-content-editor :deep(.ProseMirror:focus) {
  border-color: rgb(88 166 255);
  box-shadow: 0 0 0 2px rgb(88 166 255 / 0.1);
}

.note-content-editor :deep(.ProseMirror p) {
  margin: 0 0 0.75rem 0;
}

.note-content-editor :deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}

.note-content-editor :deep(.ProseMirror h1) {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgb(255 255 255);
}

.note-content-editor :deep(.ProseMirror h2) {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgb(255 255 255);
}

.note-content-editor :deep(.ProseMirror h3) {
  font-size: 0.9rem;
  font-weight: 600;
  margin: 0 0 0.5rem 0;
  color: rgb(255 255 255);
}

.note-content-editor :deep(.ProseMirror ul),
.note-content-editor :deep(.ProseMirror ol) {
  margin: 0 0 0.75rem 0;
  padding-left: 1.25rem;
}

.note-content-editor :deep(.ProseMirror li) {
  margin-bottom: 0.25rem;
}

.note-content-editor :deep(.ProseMirror blockquote) {
  border-left: 3px solid rgb(88 166 255);
  padding-left: 1rem;
  margin: 0.75rem 0;
  color: rgb(154 160 166);
  font-style: italic;
}

.note-content-editor :deep(.ProseMirror code) {
  background-color: rgb(33 38 45);
  color: rgb(88 166 255);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

.note-content-editor :deep(.ProseMirror pre) {
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

.note-content-editor :deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
  color: rgb(248 249 250);
}

.note-content-editor :deep(.ProseMirror strong) {
  font-weight: 600;
  color: rgb(255 255 255);
}

.note-content-editor :deep(.ProseMirror em) {
  font-style: italic;
}
</style>
