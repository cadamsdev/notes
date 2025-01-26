<template>
  <node-view-wrapper>
    <div :class="`language-${node.attrs.language}`" class="relative">
      <pre class="bg-bg-secondary">
        <code><node-view-content /></code>
      </pre>

      <select
        class="absolute top-2 right-2 bg-bg text-text-secondary"
        v-model="node.attrs.language"
        @change="changeLanguage"
      >
        <option v-for="language in languages" :value="language"
          :selected="language === node.attrs.language">{{ language }}</option>
      </select>
    </div>
  </node-view-wrapper>
</template>

<script setup lang="ts">
import { NodeViewWrapper, type NodeViewProps, NodeViewContent } from '@tiptap/vue-3';
const props = defineProps<NodeViewProps>();
const languages = ['javascript', 'html', 'css', 'ts', 'typescript'];

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
