<template>
  <node-view-wrapper>
    <div :class="`language-${node.attrs.language}`" class="relative">
      <node-view-content
        class="absolute top-0 left-0 right-0 bottom-0 p-4 caret-text-secondary text-transparent font-['JetBrains_Mono_Variable',_monospace] z-20"
        @input="handleInput" spellcheck="false" />

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
import { codeToHtml } from 'shiki';
const props = defineProps<NodeViewProps>();
const languages = ['javascript', 'html', 'css', 'ts', 'typescript'];
const highlightedCode = ref('');

const code = props.node.textContent;
props.editor.on('update', async (e) => {
  const currentNode = props.editor.view.state.selection.$from.node();
  if (currentNode.type.name === 'codeBlock') {
    const content = currentNode.textContent;

    let result = await codeToHtml(content, {
      lang: 'javascript',
      theme: 'vitesse-dark'
    });

    result = result.replace('<code>', '<code spellcheck="false">');
    highlightedCode.value = result;
  }
})

onMounted(async () => {
  let result = await codeToHtml(code, {
    lang: 'javascript',
    theme: 'vitesse-dark'
  });
  result = result.replace('<code>', '<code spellcheck="false">');
  highlightedCode.value = result;
});

function handleInput(event: Event) {
  const content = (event.target as HTMLDivElement).textContent || '';
  console.log(content)
}

function changeLanguage(event: Event) {
  const select = event.target as HTMLSelectElement;
  props.updateAttributes({ language: select.value });
}
</script>

<style scoped>
pre {
  margin: 0;
}
</style>
