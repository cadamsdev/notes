<template>
  <div class="relative">
    <div class="absolute text-text-primary top-1/2 -translate-y-1/2 left-3">
      <Icon name="fa-solid:search" width="20" height="20" />
    </div>
    <input ref="inputEl" v-bind="attrs" placeholder="Search..."
      class="block w-full py-3 pl-11 pr-8 bg-bg-secondary text-text-secondary rounded text-base leading-normal placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-bg"
      v-model="searchText" @input="handleInput" autocomplete="off" spellcheck="false" />
    <button v-if="searchText" class="absolute top-0 right-2 bottom-0 text-secondary p-0" @click="clearSearch"
      title="Clear search">
      <Icon name="fa-solid:times" width="20" height="20" />
    </button>
  </div>
</template>

<script setup lang="ts">
const searchText = ref('')
const inputEl: Ref<HTMLInputElement | null> = ref(null)
const emits = defineEmits(['search'])
const attrs = useAttrs()

function clearSearch() {
  searchText.value = '';
  emits('search', { text: searchText.value });
}

function handleInput() {
  emits('search', { text: searchText.value.toLowerCase() });
}

function focus() {
  console.log('calling focus');
  inputEl.value?.focus()
} 

defineExpose({ focus })
</script>
