<script lang="ts">
	import Icon from '@iconify/svelte';
	import { createEventDispatcher } from 'svelte';
	import Modal from './Modal.svelte';
	import { closeModal } from '../store';

	let { id, showHeader = true, children }: { id: string, showHeader?: boolean, children: any } = $props();

	const dispatch = createEventDispatcher();

	function handleCloseModal() {
		dispatch('closeModal');
		closeModal();
	}
</script>

<Modal {id} on:closeModal={handleCloseModal}>
	<div class="inline-block rounded bg-bg text-text border border-bg-border p-6 z-20 min-w-[18.75rem] max-w-[31.25rem]">
		<div class="flex justify-end mb-3">
			{#if showHeader}
				<button onclick={handleCloseModal} class="text-text-secondary hover:text-text-secondary-hover">
					<Icon icon="fa-solid:times" width="24" height="24" />
				</button>
			{/if}
		</div>
		{@render children?.()}
	</div>
</Modal>
