<script lang="ts">
  import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';

  const dispatch = createEventDispatcher();

  let searchText = '';

  function clearSearch() {
    searchText = '';
    dispatch('search', {
      text: searchText,
    });
  }

  function handleInput(e: Event) {
    searchText = (e.target as HTMLInputElement).value.toLowerCase();
    dispatch('search', {
      text: searchText,
    });
  }

</script>

<div class="search-container">
  <div class="icon-container">
    <Icon icon="fa-solid:search" width="20" height="20" />
  </div>
  <input
    {...$$restProps}
    value={searchText}
    on:input={handleInput}
  >
  {#if searchText}
    <button class="clear-btn" on:click={clearSearch} title="Clear search">
      <Icon icon="fa-solid:times" width="20" height="20" />
    </button>
  {/if}
</div>

<style>
  .clear-btn {
    position: absolute;
    top: 0;
    right: 0.8rem;
    bottom: 0;
    color: var(--clr-secondary);
    padding: 0;
  }

  .search-container {
    position: relative;
  }
  
  .icon-container {
    position: absolute;
    color: var(--clr-text-primary);
    top: 50%;
    transform: translateY(-50%);
    left: 1.2rem;
  }

  input {
    display: block;
    padding: 1.2rem 3.2rem 1.2rem 4.4rem;
    background: var(--clr-bg-secondary);
    border: none;
    color: var(--clr-text-secondary);
    border-radius: 0.4rem;
    width: 100%;
    font-size: 1.6rem;
    line-height: 1.5;
  }

  input::placeholder {
    color: var(--clr-text-secondary);
  }

  input:focus-visible {
    outline: 0.2rem solid var(--clr-bg-secondary-hover);
  }
</style>
