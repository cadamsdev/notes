<template>
  <editor-content class="editor" v-if="editor" :editor="editor" />
</template>

<script setup lang="ts">
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { useDebounceFn } from '@vueuse/core'
import CodeBlock from '@/lib/tiptap/extensions/CodeBlock';
// import CodeBlockShiki from 'tiptap-extension-code-block-shiki'

const { saveNote } = useNotes();

const props = defineProps<{
  note: Note;
}>();

const editor = ref<Editor>();

const handleUpdate = useDebounceFn(async (editor: Editor) => {
  const content = editor.getJSON();
  props.note.content = JSON.stringify(content);

  if (content.content?.length) {
    props.note.title = content.content?.[0]?.content?.[0]?.text || 'A title'
  }

  await saveNote(props.note);
}, 500);

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
            content: []
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
      // Fallback to empty structure
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

  editor.value = new Editor({
    extensions: [
      StarterKit.configure({ 
        codeBlock: false
      }),
      CodeBlock,
      Placeholder.configure({
        placeholder: 'Start writing your note...',
        emptyEditorClass: 'is-editor-empty',
      }),
      // CodeBlockShiki.configure({
      //   defaultTheme: 'one-dark-pro'
      // }),
    ],
    content: initialContent,
    editorProps: {
      attributes: {
        class: 'prose prose-invert max-w-none focus:outline-none'
      }
    },
    onUpdate: () => handleUpdate(editor.value!),
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});
</script>
