<template>
  <div ref="editor" tabindex="0" @keydown="handleKeyDown">
    <span id="placeholder">Any thoughts...</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const editor = ref<HTMLElement | null>(null);

function handleKeyDown(event: KeyboardEvent) {
  if (event.key === 'Enter') {
    console.log('Enter key pressed');
    createParagraph();
  }
}

function createParagraph() {
  const paragraph = document.createElement('p');
  paragraph.textContent = '';
  paragraph.contentEditable = "true";
  editor.value?.appendChild(paragraph);
  paragraph.focus();
}

</script>
