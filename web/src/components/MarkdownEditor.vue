<template>
  <div ref="editor" class="editor" tabindex="0" @keydown="handleKeyDown">
    <p data-placeholder="Any thoughts..." contenteditable="true"></p>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";

const editor = ref<HTMLElement | null>(null);

function handleKeyDown(event: KeyboardEvent) {
  const target = event.target as HTMLElement;
  // console.log('Key down event:', event.key, 'on target:', target);

  const isEditor = target === editor.value;
  switch (event.key) {
    case "Enter":
      handleEnter(event);
      break;

    case "Backspace":
      handleBackspace(event, isEditor);
      break;

    case "ArrowUp":
    case "ArrowDown":
      handleArrowKeys(event, isEditor)
      break;
  
    default:
      handleOtherKeys(event);
      break;
  }
}

function handleEnter(event: KeyboardEvent) {
  if (event.key !== 'Enter') {
    return;
  }

  console.log("Enter key pressed");
  event.preventDefault(); // Prevent default Enter behavior
  createParagraph();
}

function handleBackspace(event: KeyboardEvent, isEditor: boolean) {
  if (event.key !== 'Backspace') {
    return;
  }

  console.log("Backspace key pressed");
  if (isEditor) {
    return;
  }

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
}

function handleArrowKeys(event: KeyboardEvent, isEditor: boolean) {
  if (isEditor) {
    return;
  }

  const target = event.target as HTMLElement;

  if (event.key === 'ArrowUp') {
    console.log("UpArrow key pressed");
    const previousSibling = target.previousElementSibling as HTMLElement | null;
    if (previousSibling) {
      // get cursor position in target
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const cursorPosition = range?.startOffset || 0;
      previousSibling.focus();
      event.preventDefault();

      // place cursor at the same position in previousSibling
      const newRange = document.createRange();
      newRange.setStart(
        previousSibling.firstChild || previousSibling,
        Math.min(cursorPosition, (previousSibling.textContent || "").length)
      );
      newRange.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(newRange);
    }
  } else if (event.key === 'ArrowDown') {
    const nextSibling = target.nextElementSibling as HTMLElement | null;
    if (nextSibling) {
      // get cursor position in target
      const selection = window.getSelection();
      const range = selection?.getRangeAt(0);
      const cursorPosition = range?.startOffset || 0;

      nextSibling.focus();
      event.preventDefault();

      // place cursor at the same position in nextSibling
      const newRange = document.createRange();
      newRange.setStart(
        nextSibling.firstChild || nextSibling,
        Math.min(cursorPosition, (nextSibling.textContent || "").length)
      );
      newRange.collapse(true);
      selection?.removeAllRanges();
      selection?.addRange(newRange);
    }
  }
}

function handleOtherKeys(event: KeyboardEvent) {
  const target = event.target as HTMLElement;
  if (!target) {
    return;
  }

  console.log(target.textContent);
  console.log(event);

  const isHeading = target.textContent.match(/^#{1,3}$/) && event.code === "Space";
  if (isHeading) {
    // convert target to heading
    const level = target.textContent.length;
    const heading = document.createElement("h" + level);
    heading.contentEditable = "true";
    heading.textContent = "";
    target.replaceWith(heading);
    heading.focus();
    event.preventDefault();
  }
}

function createParagraph() {
  const paragraph = document.createElement("p");
  // paragraph.addEventListener('keydown', onChildKeyDown);
  paragraph.textContent = "";
  paragraph.contentEditable = "true";
  editor.value?.appendChild(paragraph);
  paragraph.focus();
}
</script>

<style>
.editor[data-placeholder]:empty::before {
  content: attr(data-placeholder);
  color: gray;
  display: block; /* Ensures the placeholder is on its own line */
}
</style>
