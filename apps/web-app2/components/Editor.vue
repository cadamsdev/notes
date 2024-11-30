<template>
  <editor-content v-if="editor" :editor="editor" />
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'

const props = defineProps<{
  content: string;
}>();

const editor = ref<Editor>();

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
    ],
    content: props.content,
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>
