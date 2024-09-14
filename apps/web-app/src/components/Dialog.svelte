<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import { closeModal } from '../store';

	export let id: string;
	export let showHeader = true;

	const dispatch = createEventDispatcher();

	function handleCloseModal() {
		dispatch('closeModal');
		closeModal();
	}
</script>

<Modal {id} on:closeModal={handleCloseModal}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="inline-block rounded bg-bg text-text border border-bg-border p-6 z-20 min-w-[18.75rem] max-w-[31.25rem]">
		<div class="flex justify-end mb-3">
			{#if showHeader}
				<button on:click={handleCloseModal} class="text-text-secondary hover:text-text-secondary-hover">
					<Icon icon="fa-solid:times" width="24" height="24" />
				</button>
			{/if}
		</div>
		<slot />
	</div>
</Modal>
