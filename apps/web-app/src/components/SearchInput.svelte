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

<div class="relative">
  <div class="absolute text-text-primary top-1/2 -translate-y-1/2 left-3">
    <Icon icon="fa-solid:search" width="20" height="20" />
  </div>
  <input
    {...$$restProps}
    class="block w-full py-3 pl-11 pr-8 bg-bg-secondary text-text-secondary rounded text-base leading-normal placeholder-text-secondary focus:outline-none focus:ring-2 focus:ring-focus focus:ring-offset-2 focus:ring-offset-bg"
    value={searchText}
    on:input={handleInput}
    autocomplete="off"
    spellcheck="false"
  >
  {#if searchText}
    <button 
      class="absolute top-0 right-2 bottom-0 text-secondary p-0"
      on:click={clearSearch} 
      title="Clear search"
    >
      <Icon icon="fa-solid:times" width="20" height="20" />
    </button>
  {/if}
</div>
