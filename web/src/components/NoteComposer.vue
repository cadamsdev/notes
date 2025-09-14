<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { Editor, EditorContent, useEditor } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from '@tiptap/extension-placeholder'
import Document from '@tiptap/extension-document'
import Paragraph from '@tiptap/extension-paragraph'
import Text from '@tiptap/extension-text'
import Heading from '@tiptap/extension-heading'

interface Props {
  content?: string;
  tags?: string[];
  placeholder?: string;
}

const props = withDefaults(defineProps<Props>(), {
  content: "",
  tags: () => [],
  placeholder: "Any thoughts...",
});

const emit = defineEmits<{
  contentChange: [content: string];
  save: [data: { content: string; tags: string[] }];
  tagAdd: [tagName: string];
  tagRemove: [tagName: string];
}>();

const contentValue = ref(props.content);
const selectedTags = ref([...props.tags]);
const contentEditor = ref<HTMLDivElement | null>(null);
const content = ref('');

const editor = useEditor({
  content: content.value,
  extensions: [StarterKit],
});

watch(
  () => props.content,
  (newContent) => {
    contentValue.value = newContent;
    // Only update the editor if it's not currently focused (to avoid interfering with typing)
    if (contentEditor.value && document.activeElement !== contentEditor.value) {
      contentEditor.value.textContent = newContent;
    }
  }
);

watch(
  () => props.tags,
  (newTags) => {
    selectedTags.value = [...newTags];
  }
);

onMounted(() => {
  if (contentEditor.value) {
    contentEditor.value.textContent = props.content;
  }

  editor.value = new Editor({
    content: '',
    extensions: [
      Document,
      Paragraph,
      Text,
      Placeholder.configure({
        placeholder: 'Any thoughts...',
        emptyEditorClass: 'is-editor-empty',
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
    ],
    autofocus: true,
    onUpdate: () => {
      console.log("Editor content updated:", editor.value?.getHTML());
    },
  });
});

const handleContentChange = (event: Event) => {
  const target = event.target as HTMLDivElement;
  contentValue.value = target.textContent || "";
  emit("contentChange", contentValue.value);
};

const handleSave = () => {
  emit("save", {
    content: contentValue.value,
    tags: selectedTags.value,
  });
};

const handleTagAdd = () => {
  // For demo purposes, cycle through available tags
  const availableTags = ["work", "personal", "ideas", "meetings", "tasks", "writing"];
  const unusedTags = availableTags.filter((tag) => !selectedTags.value.includes(tag));

  if (unusedTags.length > 0) {
    const newTag = unusedTags[0];
    selectedTags.value.push(newTag);
    emit("tagAdd", newTag);
  }
};

const handleTagRemove = (tagName: string) => {
  selectedTags.value = selectedTags.value.filter((tag) => tag !== tagName);
  emit("tagRemove", tagName);
};
</script>

<template>
  <div class="bg-gray-800 border-b border-gray-700 p-4 lg:p-6">
    <div class="max-w-4xl mx-auto">
      <!-- Content Editor -->
      <div
        class="p-3 lg:p-4 bg-gray-750 rounded-lg border border-gray-600 focus-within:border-blue-500 transition-colors duration-200 outline-none text-gray-200 placeholder-gray-500 leading-relaxed text-sm lg:text-base"
      >
        <EditorContent :editor="editor" v-model="content" />
    </div>

    <!-- Editor Toolbar -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0">
      <div class="flex items-center space-x-4">
        <!-- Tag Selector -->
        <div class="flex items-center space-x-2">
          <span class="text-sm text-gray-400 hidden sm:inline">Tags:</span>
          <div class="flex flex-wrap gap-1">
            <span v-for="tag in selectedTags" :key="tag"
              class="inline-flex items-center px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
              {{ tag }}
              <button @click="handleTagRemove(tag)" class="ml-1 hover:text-gray-300 transition-colors duration-200">
                ×
              </button>
            </span>
            <button @click="handleTagAdd"
              class="px-2 py-1 border border-gray-600 text-gray-400 text-xs rounded-full hover:border-gray-500 transition-colors duration-200">
              + Add
            </button>
          </div>
        </div>
      </div>

      <div class="flex items-center justify-end space-x-3">
        <button @click="handleSave"
          class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors duration-200 text-sm">
          Save Note
        </button>
      </div>
    </div>
  </div>
  </div>
</template>

<style>
.tiptap {
  min-height: 128px;
}
</style>
