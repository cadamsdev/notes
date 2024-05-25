<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';

	export let showModal = false;
	export let showHeader= true;

	const dispatch = createEventDispatcher();

	function closeModal() {
		dispatch('closeModal');
	}
</script>

<Modal {showModal} on:closeModal={closeModal}>
  <!-- svelte-ignore a11y-click-events-have-key-events -->
  <!-- svelte-ignore a11y-no-static-element-interactions -->
    <div
      class="dialog"
    >
      <div class="flex justify-end mb-3">
        {#if showHeader}
          <button on:click={closeModal} class="text-text-secondary hover:text-text-secondary-hover">
            <Icon icon="fa-solid:times" width="24" height="24" />
          </button>
        {/if}
      </div>
      <slot />
    </div>
</Modal>

<style>
  .dialog {
    display: inline-block;
    border-radius: 0.4rem;
    background: var(--clr-bg);
    color: var(--clr-text);
    border: 0.1rem solid var(--clr-bg-secondary);
    padding: 2.4rem;
    z-index: 20;
    min-width: 30rem;
  }
</style>
