<template>
  <node-view-wrapper>
    <div :class="`language-${node.attrs.language}`" class="relative">
      <node-view-content @input="handleInput" />

      <template v-if="highlightedCode">
        <div v-html="highlightedCode"></div>
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

    const result = await codeToHtml(content, {
      lang: 'javascript',
      theme: 'vitesse-dark'
    });

    highlightedCode.value = result;
  }
})

onMounted(async () => {
  const result = await codeToHtml(code, {
    lang: 'javascript',
    theme: 'vitesse-dark'
  });

  console.log(highlightedCode);
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
