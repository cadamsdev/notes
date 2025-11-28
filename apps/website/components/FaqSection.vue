<template>
  <section id="faq" class="section faq-section">
    <div class="container-custom">
      <div class="section-header">
        <h2 class="section-title">
          Frequently Asked Questions
        </h2>
        <p class="section-description">
          Common questions and answers about NoteX
        </p>
      </div>

      <div class="faq-container">
        <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
          <button 
            class="faq-question" 
            @click="toggleItem(index)"
            :aria-expanded="openItems.has(index)"
          >
            <Icon name="heroicons:question-mark-circle" class="faq-icon" />
            <span class="faq-question-text">{{ item.question }}</span>
            <Icon 
              name="heroicons:chevron-down" 
              :class="['faq-chevron', { 'faq-chevron-open': openItems.has(index) }]" 
            />
          </button>
          <div v-show="openItems.has(index)" class="faq-answer">
            <template v-for="(content, contentIndex) in item.answer" :key="contentIndex">
              <p v-if="content.type === 'text'">{{ content.value }}</p>
              <InlineCodeBlock v-else-if="content.type === 'code'" :code="content.value" />
              <p v-else-if="content.type === 'note'" class="faq-note">
                <Icon name="heroicons:light-bulb" class="faq-note-icon" />
                {{ content.value }}
              </p>
            </template>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface FaqContent {
  type: 'text' | 'code' | 'note'
  value: string
}

interface FaqItem {
  question: string
  answer: FaqContent[]
}

const openItems = ref<Set<number>>(new Set())

function toggleItem(index: number) {
  if (openItems.value.has(index)) {
    openItems.value.delete(index)
  } else {
    openItems.value.add(index)
  }
  // Trigger reactivity
  openItems.value = new Set(openItems.value)
}

const faqItems: FaqItem[] = [
  {
    question: "I'm unable to install the app on macOS",
    answer: [
      {
        type: 'text',
        value: 'Apple charges $99/year for code signing certificates. Since NoteX is a free, open-source app, we don\'t have code signing enabled. macOS may show a warning that the app is "damaged" or from an "unidentified developer."'
      },
      {
        type: 'text',
        value: 'To install the DMG without issues, run this command in Terminal before opening the file:'
      },
      {
        type: 'code',
        value: 'xattr -d com.apple.quarantine ~/Downloads/NoteX_0.7.1_aarch64.dmg'
      },
      {
        type: 'note',
        value: 'Replace the filename with the actual DMG file you downloaded.'
      }
    ]
  }
]
</script>

<style scoped>
.faq-section {
  background-color: var(--color-gray-50);
}

body.dark .faq-section {
  background-color: var(--color-gray-800);
}

.section-header {
  text-align: center;
  margin-bottom: var(--spacing-3xl);
}

.section-title {
  font-size: var(--font-size-4xl);
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: var(--spacing-md);
}

body.dark .section-title {
  color: var(--color-white);
}

.section-description {
  font-size: var(--font-size-xl);
  color: var(--color-gray-600);
  max-width: 42rem;
  margin-left: auto;
  margin-right: auto;
}

body.dark .section-description {
  color: var(--color-gray-300);
}

.faq-container {
  max-width: 48rem;
  margin-left: auto;
  margin-right: auto;
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
}

.faq-item {
  background-color: var(--color-white);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-gray-200);
  overflow: hidden;
}

body.dark .faq-item {
  background-color: var(--color-gray-900);
  border-color: var(--color-gray-700);
}

.faq-question {
  width: 100%;
  padding: var(--spacing-xl);
  font-size: var(--font-size-xl);
  font-weight: 600;
  color: var(--color-gray-900);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  transition: background-color var(--transition-base);
}

.faq-question:hover {
  background-color: var(--color-gray-50);
}

body.dark .faq-question {
  color: var(--color-white);
}

body.dark .faq-question:hover {
  background-color: var(--color-gray-800);
}

.faq-question-text {
  flex: 1;
}

.faq-icon {
  width: 1.5rem;
  height: 1.5rem;
  color: var(--color-primary-600);
  flex-shrink: 0;
}

.faq-chevron {
  width: 1.25rem;
  height: 1.25rem;
  color: var(--color-gray-400);
  flex-shrink: 0;
  transition: transform var(--transition-base);
}

.faq-chevron-open {
  transform: rotate(180deg);
}

.faq-answer {
  padding: 0 var(--spacing-xl) var(--spacing-xl) var(--spacing-xl);
  color: var(--color-gray-600);
  line-height: 1.7;
}

body.dark .faq-answer {
  color: var(--color-gray-300);
}

.faq-answer p {
  margin-bottom: var(--spacing-md);
}

.faq-answer p:last-child {
  margin-bottom: 0;
}

.faq-note {
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-sm);
}

.faq-note-icon {
  width: 1rem;
  height: 1rem;
  flex-shrink: 0;
  margin-top: 0.125rem;
}
</style>
