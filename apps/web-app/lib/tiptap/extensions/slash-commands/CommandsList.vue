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

<script>
import SearchInput from '~/components/SearchInput.vue';

export default {
  props: {
    items: {
      type: Array,
      required: true,
    },

    command: {
      type: Function,
      required: true,
    },
  },

  data() {
    return {
      selectedIndex: 0,
      searchText: '',
      filteredItems: [...this.items],
    };
  },

  watch: {
    items() {
      this.selectedIndex = 0;
    },
  },

  methods: {
    handleSearch(event) {
      const searchText = event.text;
      this.searchText = searchText;
      this.filteredItems = searchText ? this.items.filter((item) => item.title.toLowerCase().includes(this.searchText.toLowerCase())) : [...this.items];
    },

    onKeyDown({ event }) {
      if (event.key === 'ArrowUp') {
        this.upHandler();
        return true;
      }

      if (event.key === 'ArrowDown') {
        this.downHandler();
        return true;
      }

      if (event.key === 'Enter') {
        this.enterHandler();
        return true;
      }

      return false;
    },

    upHandler() {
      this.selectedIndex = ((this.selectedIndex + this.items.length) - 1) % this.items.length;
    },

    downHandler() {
      this.selectedIndex = (this.selectedIndex + 1) % this.items.length;
    },

    enterHandler() {
      this.selectItem(this.selectedIndex);
    },

    selectItem(index) {
      const item = this.items[index];

      if (item) {
        this.command(item);
      }
    },
  },
};
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
