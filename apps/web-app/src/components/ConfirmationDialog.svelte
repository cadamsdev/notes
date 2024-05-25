<script lang="ts">
	import Icon from '@iconify/svelte';
	import Modal from './Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';

	export let showModal = false;
	export let description: string = 'Are you sure you want to this?';

	const dispatch = createEventDispatcher();

	function handleCloseModal() {
		dispatch('closeModal');
	}

	function handleAction() {
		dispatch('action');
		dispatch('closeModal');
	}
</script>

<Modal {showModal} on:closeModal={handleCloseModal}>
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div class="rounded bg-bg border border-bg-secondary p-3 shadow-lg inline-block z-20 min-w-[300px]">
		<div class="flex items-center justify-between mb-8">
			<h2 class="text-xl text-text-primary font-bold text-center">Confirm Action</h2>
			<button on:click={handleCloseModal} class="hover:text-gray-600 text-text-secondary">
				<Icon icon="fa-solid:times" width="24" height="24" />
			</button>
		</div>
		<div class="min-w-[250px] max-w-[325px] text-text-secondary">
			{#if description}
				<div class="mb-8">
					{description}
				</div>
			{/if}

			<div class="flex justify-end gap-2">
				<Button on:click={handleAction} variant='primary'>Yes</Button>
				<Button on:click={handleCloseModal} variant='secondary'>No</Button>
			</div>
		</div>
	</div>
</Modal>
