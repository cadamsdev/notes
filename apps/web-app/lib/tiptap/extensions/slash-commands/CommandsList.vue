<template>
  <div class="dropdown">
    <div class="search-container">
      <SearchInput @search="handleSearch" placeholder="Search..." />
    </div>
    <div class="dropdown-menu">
      <template v-if="filteredItems.length">
        <button class="flex gap-1 text-sm" :class="{ 'is-selected': index === selectedIndex }"
          v-for="(item, index) in filteredItems" :key="index" @click="selectItem(index)">
          <Icon v-if="item.icon" :name="item.icon" size="24" />
          {{ item.title }}
        </button>
      </template>
      <div class="item" v-else>
        No result
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchInput from '~/components/SearchInput.vue';

const props = defineProps<{
  items: { title: string; icon?: string }[];
  command: (item: { title: string; icon?: string }) => void;
}>();

const selectedIndex = ref(0);
const searchText = ref('');
const filteredItems = ref(props.items);

watch(() => props.items, () => {
  selectedIndex.value = 0;
  filteredItems.value = [...props.items];
});


function handleSearch(event: any) {
  const searchText = event.text;
  searchText.value = searchText;
  filteredItems.value = searchText ? props.items.filter((item) => item.title.toLowerCase().includes(searchText.toLowerCase())) : [...props.items];
}

function onKeyDown({ event }: { event: KeyboardEvent }) {  
  if (event.key === 'ArrowUp') {
    upHandler();
    return true;
  }

  if (event.key === 'ArrowDown') {
    downHandler();
    return true;
  }

  if (event.key === 'Enter') {
    enterHandler();
    return true;
  }

  return false;
}

function upHandler() {
  selectedIndex.value = ((selectedIndex.value + props.items.length) - 1) % props.items.length;
}

function downHandler() {
  selectedIndex.value = (selectedIndex.value + 1) % props.items.length;
}

function enterHandler() {
  selectItem(selectedIndex.value);
}

function selectItem(index: number) {
  const item = props.items[index];

  if (item) {
    props.command(item);
  }
}

defineExpose({
  onKeyDown,
}); 
</script>

<style>
.dropdown {
  border-width: 1px;
  border-style: solid;
  @apply border-bg-border;
  @apply rounded;
}

.search-container {
  @apply p-2;
}

.dropdown-menu {
  background: #FFF;
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
}

.dropdown-menu button {
  align-items: center;
  display: flex;
  text-align: left;
  width: 100%;
  padding: 12px 8px;
  @apply bg-bg;
  @apply text-text-primary;
}

.dropdown-menu button:hover,
.dropdown-menu button:hover.is-selected {
  @apply bg-bg-hover;
}

.dropdown-menu button.is-selected {
  @apply bg-bg-secondary;
}
</style>
