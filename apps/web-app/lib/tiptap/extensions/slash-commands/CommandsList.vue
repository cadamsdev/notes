<template>
  <div class="dropdown" @keydown="onKeyDown">
    <div class="search-container">
      <SearchInput ref="searchInputRef" @search="handleSearch" placeholder="Search..." />
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
  onClose: () => void;
}>();

const selectedIndex = ref(0);
const searchText = ref('');
const filteredItems = ref(props.items);
const searchInputRef = ref<any | null>(null);

watch(() => props.items, () => {
  selectedIndex.value = 0;
  filteredItems.value = [...props.items];
});

onMounted(() => {
  setTimeout(() => {
    searchInputRef.value.focus();
  }, 0);
});

function handleSearch(event: any) {
  const tempSearchText = event.text;
  searchText.value = tempSearchText;
  filteredItems.value = searchText ? props.items.filter((item) => item.title.toLowerCase().includes(tempSearchText.toLowerCase())) : [...props.items];
}

function onKeyDown(e: KeyboardEvent) {
  console.log('onKeyDown');
  console.log(e.key);

  if (e.key === 'Escape' || (e.key === 'Backspace' && searchText.value === '')) {
    handleClose();
    return;
  }

  if (e.key === 'Enter') {
    handleEnter();
    return;
  }

  if (e.key === 'ArrowUp') {
    handleUp();
    return true;
  }

  if (e.key === 'ArrowDown') {
    handleDown();
    return true;
  }

  return false;
}

function handleClose() {
  props.onClose();
}

function handleEnter() {
  selectItem(selectedIndex.value);
}

function handleUp() {
  selectedIndex.value = ((selectedIndex.value + filteredItems.value.length) - 1) % filteredItems.value.length;
}

function handleDown() {
  selectedIndex.value = (selectedIndex.value + 1) % filteredItems.value.length;
}

function selectItem(index: number) {
  const item = filteredItems.value[index];

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
