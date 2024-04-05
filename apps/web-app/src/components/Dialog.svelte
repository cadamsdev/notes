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
      class="rounded bg-white p-3 shadow-lg inline-block z-20"
    >
      <div class="flex justify-end mb-3">
        {#if showHeader}
          <button on:click={closeModal} class="hover:text-gray-600 text-black">
            <Icon icon="fa-solid:times" width="24" height="24" />
          </button>
        {/if}
      </div>
      <slot />
    </div>
</Modal>
