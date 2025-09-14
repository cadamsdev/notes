<template>
  <div ref="editor" class="editor" tabindex="0" @keydown="handleKeyDown">
    <span id="placeholder">Any thoughts...</span>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const editor = ref<HTMLElement | null>(null);

function handleKeyDown(event: KeyboardEvent) {
  const target = event.target as HTMLElement;
  // console.log('Key down event:', event.key, 'on target:', target);

  if (event.key === 'Enter') {
    console.log('Enter key pressed');
    event.preventDefault(); // Prevent default Enter behavior
    createParagraph();
  } else if (event.key === 'Backspace' && target !== editor.value) {
    console.log('Backspace key pressed');

    const target = event.target as HTMLElement;
    if (target && target.textContent.length === 0) {

      const previousSibling = target.previousElementSibling as HTMLElement | null;    

      if (previousSibling) {
        previousSibling.focus();
        // place cursor at the end
        const range = document.createRange();
        range.selectNodeContents(previousSibling);
        range.collapse(false);
        const sel = window.getSelection();
        sel?.removeAllRanges();
        sel?.addRange(range);
      }

      target.remove();
      event.preventDefault();

      if (!previousSibling) {
        editor.value?.focus();  
      }
    }
  } else {

    console.log(target.textContent)
    console.log(event);

    const isHeading = target.textContent.match(/^#{1,3}$/) && event.code === 'Space';
    if (isHeading) {
      // convert target to heading
      const level = target.textContent.length;
      const heading = document.createElement('h' + level);
      heading.contentEditable = "true";
      heading.textContent = '';
      target.replaceWith(heading);
      heading.focus();
      event.preventDefault();
    }
  }
}

function createParagraph() {
  const paragraph = document.createElement('p');
  // paragraph.addEventListener('keydown', onChildKeyDown);
  paragraph.textContent = '';
  paragraph.contentEditable = "true";
  editor.value?.appendChild(paragraph);
  paragraph.focus();
}

</script>

<style>
.editor h1 {
  font-size: 2em;
  font-weight: bold;
  margin: 0.67em 0;
}

.editor h2 {
  font-size: 1.5em;
  font-weight: bold;
  margin: 0.75em 0;
}

.editor h3 {
  font-size: 1.17em;
  font-weight: bold;
  margin: 0.83em 0;
}

</style>
