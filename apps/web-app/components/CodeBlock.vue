<template>
  <node-view-wrapper>
    <div :class="`language-${node.attrs.language}`" class="relative">
      <node-view-content
        class="absolute top-0 left-0 right-0 bottom-0 p-4 caret-text-secondary text-transparent font-['JetBrains_Mono_Variable',_monospace]"
        spellcheck="false" />

      <template v-if="highlightedCode">
        <div class="" v-html="highlightedCode"></div>
      </template>

      <select class="absolute top-2 right-2 bg-bg text-text-secondary" v-model="node.attrs.language"
        @change="changeLanguage">
        <option v-for="language in languages" :value="language" :selected="language === node.attrs.language">{{ language
          }}</option>
      </select>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps, NodeViewContent } from '@tiptap/vue-3';
import { codeToHtml, bundledLanguages } from 'shiki';
import { v4 as uuid } from 'uuid';
const props = defineProps<NodeViewProps>();
const languages = Object.keys(bundledLanguages);
const highlightedCode = ref('');
const id = uuid();

const code = props.node.textContent;

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
</script>

<style scoped>
pre {
  margin: 0;
}
</style>
