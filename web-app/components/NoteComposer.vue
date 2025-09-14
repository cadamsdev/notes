<template>
  <div class="border border-divider bg-card-bg rounded-lg p-6">
    <div class="quick-note-editor">
      <editor-content 
        v-if="editor" 
        :editor="editor" 
        class="min-h-[100px] text-text-primary"
      />
      <div v-else class="min-h-[100px] flex items-center text-text-muted">
        Loading editor...
      </div>
    </div>
    
    <!-- Composer Actions -->
    <div class="flex items-center justify-between mt-4">
      <div class="flex items-center gap-2">
        <button 
          @click="showTagSelector = !showTagSelector"
          class="p-2 hover:bg-bg-hover rounded-lg text-text-muted hover:text-text-primary transition-colors"
          title="Add tags"
        >
          <Icon name="fluent:hashtag-20-filled" size="18" />
        </button>
      </div>
      <Button 
        variant="primary" 
        @click="handleSave"
        :disabled="!editor?.getText().trim()"
        class="px-6 flex items-center"
      >
        <Icon name="fluent:save-20-filled" size="16" class="mr-1" />
        Save
      </Button>
    </div>
    
    <!-- Selected tags display -->
    <div v-if="selectedTags.length > 0" class="flex flex-wrap gap-1 mt-3">
      <Chip 
        v-for="tag in selectedTags" 
        :key="tag.id" 
        :text="tag.name" 
        :color="tag.color" 
        hasCloseBtn 
        @close="removeTag(tag.id)" 
      />
    </div>
    
    <!-- Tag selector -->
    <Transition
      enter-active-class="transition-all duration-200 ease-out"
      enter-from-class="opacity-0 scale-95"
      enter-to-class="opacity-100 scale-100"
      leave-active-class="transition-all duration-150 ease-in"
      leave-from-class="opacity-100 scale-100"
      leave-to-class="opacity-0 scale-95"
    >
      <div v-if="showTagSelector" class="mt-4 p-4 bg-bg-secondary border border-bg-border rounded-lg">
        <TagCombobox :tags="selectedTags" @selected-tags="handleTagsUpdate" />
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import type { Tag } from '~/composables/useNotes';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlock from '@/lib/tiptap/extensions/CodeBlock';

interface Props {
  placeholder?: string;
  modelValue?: string;
  tags?: Tag[];
}

interface Emits {
  save: [content: string, tags: Tag[]];
  'update:modelValue': [value: string];
  'update:tags': [tags: Tag[]];
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Any thoughts...',
  modelValue: '',
  tags: () => []
});

const emits = defineEmits<Emits>();

// Reactive state
const selectedTags = ref<Tag[]>([...props.tags]);
const showTagSelector = ref(false);
const editor = ref<Editor>();

// Initialize TipTap editor
onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit.configure({ 
        codeBlock: false
      }),
      CodeBlock,
      Placeholder.configure({
        placeholder: props.placeholder,
        emptyEditorClass: 'is-editor-empty',
        showOnlyWhenEditable: true,
        showOnlyCurrent: true,
      }),
    ],
    content: props.modelValue ? JSON.parse(props.modelValue) : {
      type: 'doc',
      content: [
        {
          type: 'paragraph',
          content: []
        }
      ]
    },
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none text-text-primary bg-transparent p-0 border-none leading-relaxed'
      },
      handleKeyDown: (view, event) => {
        if (event.key === 'Enter' && (event.metaKey || event.ctrlKey)) {
          event.preventDefault();
          handleSave();
          return true;
        }
        return false;
      }
    },
    onUpdate: () => {
      // Update the content when editor changes
      const json = editor.value?.getJSON();
      if (json) {
        emits('update:modelValue', JSON.stringify(json));
      }
    },
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

// Watch for external prop changes
watch(() => props.modelValue, (newValue) => {
  if (editor.value && newValue) {
    const content = JSON.parse(newValue);
    editor.value.commands.setContent(content);
  }
});

watch(() => props.tags, (newTags) => {
  selectedTags.value = [...newTags];
}, { deep: true });

// Methods
const handleSave = () => {
  if (!editor.value) return;
  
  const editorContent = editor.value.getJSON();
  const editorText = editor.value.getText().trim();
  
  if (!editorText) return;
  
  emits('save', JSON.stringify(editorContent), selectedTags.value);
  
  // Clear the editor after save
  editor.value.commands.clearContent();
  selectedTags.value = [];
  showTagSelector.value = false;
};

const removeTag = (tagId: number) => {
  selectedTags.value = selectedTags.value.filter(tag => tag.id !== tagId);
  emits('update:tags', selectedTags.value);
};

const handleTagsUpdate = (tags: Tag[]) => {
  selectedTags.value = tags;
  emits('update:tags', tags);
};

// Expose methods for parent components
defineExpose({
  clearContent: () => {
    editor.value?.commands.clearContent();
    selectedTags.value = [];
    showTagSelector.value = false;
  },
  focus: () => {
    editor.value?.commands.focus();
  }
});
</script>

<style scoped>
.quick-note-editor :deep(.ProseMirror) {
  outline: none;
  font-size: 1rem;
  line-height: 1.6;
  color: rgb(248 249 250);
  background: transparent;
  border: none;
  padding: 0;
  min-height: 100px;
  resize: none;
}

.quick-note-editor :deep(.ProseMirror p) {
  margin: 0 0 1rem 0;
}

.quick-note-editor :deep(.ProseMirror p:last-child) {
  margin-bottom: 0;
}

.quick-note-editor :deep(.ProseMirror.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: rgb(95 99 104);
  pointer-events: none;
  height: 0;
  font-style: normal;
}

.quick-note-editor :deep(.ProseMirror .is-empty::before) {
  content: attr(data-placeholder);
  float: left;
  color: rgb(95 99 104);
  pointer-events: none;
  height: 0;
  font-style: normal;
}

/* Alternative placeholder selector for TipTap */
.quick-note-editor :deep(.ProseMirror p.is-editor-empty:first-child::before) {
  content: attr(data-placeholder);
  float: left;
  color: rgb(95 99 104);
  pointer-events: none;
  height: 0;
  font-style: normal;
}

.quick-note-editor :deep(.ProseMirror h1) {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: rgb(255 255 255);
}

.quick-note-editor :deep(.ProseMirror h2) {
  font-size: 1.125rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: rgb(255 255 255);
}

.quick-note-editor :deep(.ProseMirror h3) {
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 0.75rem 0;
  color: rgb(255 255 255);
}

.quick-note-editor :deep(.ProseMirror ul),
.quick-note-editor :deep(.ProseMirror ol) {
  margin: 0 0 1rem 0;
  padding-left: 1.5rem;
}

.quick-note-editor :deep(.ProseMirror li) {
  margin-bottom: 0.25rem;
}

.quick-note-editor :deep(.ProseMirror blockquote) {
  border-left: 3px solid rgb(88 166 255);
  padding-left: 1rem;
  margin: 1rem 0;
  color: rgb(154 160 166);
  font-style: italic;
}

.quick-note-editor :deep(.ProseMirror code) {
  background-color: rgb(33 38 45);
  color: rgb(88 166 255);
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

.quick-note-editor :deep(.ProseMirror pre) {
  background-color: rgb(13 17 23);
  border: 1px solid rgb(33 38 45);
  border-radius: 0.5rem;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
  font-size: 0.875rem;
  line-height: 1.4;
}

.quick-note-editor :deep(.ProseMirror pre code) {
  background: none;
  padding: 0;
  color: rgb(248 249 250);
}

.quick-note-editor :deep(.ProseMirror strong) {
  font-weight: 600;
  color: rgb(255 255 255);
}

.quick-note-editor :deep(.ProseMirror em) {
  font-style: italic;
}

/* Focus states */
.quick-note-editor :deep(.ProseMirror:focus) {
  outline: none;
}
</style>
