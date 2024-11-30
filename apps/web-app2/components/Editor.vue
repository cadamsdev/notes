<template>
  <editor-content class="editor" v-if="editor" :editor="editor" />
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'
import { useDebounceFn } from '@vueuse/core'
const { saveNote } = useNotes();

const props = defineProps<{
  note: Note;
}>();

const editor = ref<Editor>();

const handleUpdate = useDebounceFn(async (editor: Editor) => {
  const content = editor.getJSON();
  props.note.content = JSON.stringify(content);
  await saveNote(props.note);
}, 500);

onMounted(() => {
  editor.value = new Editor({
    extensions: [
      StarterKit,
    ],
    content: JSON.parse(props.note.content || ''),
    onUpdate: () => handleUpdate(editor.value!),
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>
