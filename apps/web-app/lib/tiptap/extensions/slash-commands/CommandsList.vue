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
.dropdown-menu {
  background: #FFF;
  border: 1px solid rgba(61, 37, 20, .05);
  border-radius: 4px;
  box-shadow: 0px 12px 33px 0px rgba(0, 0, 0, .06),
    0px 3.618px 9.949px 0px rgba(0, 0, 0, .04);
  display: flex;
  flex-direction: column;
  overflow: auto;
  position: relative;
}

.dropdown-menu button {
  align-items: center;
  background-color: transparent;
  display: flex;
  text-align: left;
  width: 100%;
  padding: 12px 8px;
}

.dropdown-menu button:hover,
.dropdown-menu button:hover.is-selected {
  background-color: rgba(61, 37, 20, .12);
}

.dropdown-menu button.is-selected {
  background-color: rgba(61, 37, 20, .08);
}
</style>
