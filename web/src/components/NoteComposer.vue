<script setup lang="ts">
import { onBeforeUnmount, ref, watch } from "vue";
import MarkdownEditor from './MarkdownEditor.vue';

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

const selectedTags = ref([...props.tags]);

watch(
  () => props.tags,
  (newTags) => {
    selectedTags.value = [...newTags];
  }
);

const handleSave = () => {
  emit("save", {
    content: '',
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
        <MarkdownEditor />
      </div>

      <!-- Editor Toolbar -->
      <div
        class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 space-y-3 sm:space-y-0"
      >
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
.tiptap {
  min-height: 128px;
}
</style>
