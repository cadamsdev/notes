<template>
  <node-view-wrapper>
    <div class="code-block-wrapper group relative my-4">
      <!-- Header with language selector and copy button -->
      <div class="flex items-center justify-between bg-bg-secondary border border-bg-border border-b-0 rounded-t-lg px-4 py-2">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-error"></div>
          <div class="w-3 h-3 rounded-full bg-warning"></div>
          <div class="w-3 h-3 rounded-full bg-success"></div>
          <span class="ml-2 text-xs text-text-muted font-medium">
            {{ getLanguageDisplayName(node.attrs.language) }}
          </span>
        </div>
        
        <div class="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <select 
            v-model="node.attrs.language"
            @change="changeLanguage"
            class="bg-bg border border-bg-border rounded px-2 py-1 text-xs text-text-primary focus:outline-none focus:ring-1 focus:ring-primary"
          >
            <option v-for="language in popularLanguages" :key="language" :value="language">
              {{ getLanguageDisplayName(language) }}
            </option>
            <optgroup label="All Languages">
              <option v-for="language in allLanguages" :key="language" :value="language">
                {{ getLanguageDisplayName(language) }}
              </option>
            </optgroup>
          </select>
          
          <button 
            @click="copyToClipboard" 
            :class="[
              'flex items-center gap-1 px-2 py-1 rounded text-xs font-medium transition-colors',
              copied 
                ? 'bg-success/20 text-success border border-success/30' 
                : 'bg-bg border border-bg-border text-text-muted hover:text-text-primary hover:bg-bg-hover'
            ]"
            :title="copied ? 'Copied!' : 'Copy to clipboard'"
          >
            <Icon v-if="!copied" name="fluent:copy-20-regular" size="14" />
            <Icon v-else name="fluent:checkmark-20-filled" size="14" />
            <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
          </button>
        </div>
      </div>

      <!-- Code content -->
      <div class="relative bg-bg-tertiary border border-bg-border rounded-b-lg overflow-hidden">
        <node-view-content
          class="absolute inset-0 p-4 caret-primary text-transparent font-mono text-sm leading-relaxed resize-none"
          spellcheck="false" 
        />

        <template v-if="highlightedCode">
          <div 
            v-html="highlightedCode" 
            class="code-content overflow-x-auto p-4 font-mono text-sm leading-relaxed"
          ></div>
        </template>
        
        <template v-else>
          <div class="p-4 font-mono text-sm leading-relaxed text-text-muted">
            {{ code || 'Start typing your code...' }}
          </div>
        </template>
      </div>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps, NodeViewContent } from '@tiptap/vue-3';
import { codeToHtml, bundledLanguages } from 'shiki';
import { v4 as uuid } from 'uuid';

const props = defineProps<NodeViewProps>();

// Language management
const allLanguages = Object.keys(bundledLanguages);
const popularLanguages = ['javascript', 'typescript', 'python', 'html', 'css', 'json', 'markdown', 'bash', 'sql', 'yaml'];

// State
const highlightedCode = ref('');
const copied = ref(false);
const id = uuid();

const code = props.node.textContent;

// Language display names mapping
const languageDisplayNames: Record<string, string> = {
  'javascript': 'JavaScript',
  'typescript': 'TypeScript',
  'python': 'Python',
  'html': 'HTML',
  'css': 'CSS',
  'json': 'JSON',
  'markdown': 'Markdown',
  'bash': 'Bash',
  'sql': 'SQL',
  'yaml': 'YAML',
  'jsx': 'JSX',
  'tsx': 'TSX',
  'vue': 'Vue',
  'php': 'PHP',
  'java': 'Java',
  'cpp': 'C++',
  'c': 'C',
  'go': 'Go',
  'rust': 'Rust',
  'ruby': 'Ruby',
  'swift': 'Swift',
  'kotlin': 'Kotlin',
  'text': 'Plain Text'
};

const getLanguageDisplayName = (lang: string) => {
  return languageDisplayNames[lang] || lang.charAt(0).toUpperCase() + lang.slice(1);
};

props.editor.on('update', async ({ transaction }) => {
  const selectedNode = transaction.selection.$head.node();
  if (selectedNode.type.name === 'codeBlock' && selectedNode.attrs.id === id) {
    const content = selectedNode.textContent;
    await highlightCode(content);
  }
})

onMounted(async () => {
  await highlightCode(code);
});

async function highlightCode(code: string) {
  let result = await codeToHtml(code, {
    lang: props.node.attrs.language || 'text',
    theme: 'vitesse-dark'
  });

  result = result.replace('<code>', '<code spellcheck="false">');

  if (result === highlightedCode.value) {
    return;
  }

  props.updateAttributes({ id: id });
  highlightedCode.value = result;
}

async function changeLanguage(event: Event) {
  const select = event.target as HTMLSelectElement;
  props.updateAttributes({ language: select.value });
  await highlightCode(code);
}

async function copyToClipboard() {
  try {
    await navigator.clipboard.writeText(code);
    copied.value = true;
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Failed to copy code:', err);
  }
}
</script>

<style scoped>
.code-block-wrapper {
  font-family: 'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, 'Courier New', monospace;
}

.code-content :deep(pre) {
  margin: 0 !important;
  padding: 0 !important;
  background: transparent !important;
  border: none !important;
  border-radius: 0 !important;
  overflow: visible !important;
}

.code-content :deep(code) {
  font-family: inherit !important;
  font-size: 0.875rem !important;
  line-height: 1.5 !important;
  background: transparent !important;
  padding: 0 !important;
  color: inherit !important;
}

/* Custom scrollbar for code overflow */
.code-content::-webkit-scrollbar {
  height: 8px;
}

.code-content::-webkit-scrollbar-track {
  background: rgb(33 38 45);
  border-radius: 4px;
}

.code-content::-webkit-scrollbar-thumb {
  background: rgb(55 62 71);
  border-radius: 4px;
}

.code-content::-webkit-scrollbar-thumb:hover {
  background: rgb(68 76 86);
}

/* Ensure proper line height and spacing */
.code-content :deep(.line) {
  min-height: 1.5rem;
}

/* Style for empty lines */
.code-content :deep(.line:empty::before) {
  content: '\00a0';
}
</style>
