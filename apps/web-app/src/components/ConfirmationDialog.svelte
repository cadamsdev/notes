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
	<div class="dialog">
		<div class="dialog-top">
			<h2 class="heading">Confirm Action</h2>
			<button on:click={handleCloseModal} class="close-btn">
				<Icon icon="fa-solid:times" width="24" height="24" />
			</button>
		</div>
		<div class="dialog-content">
			{#if description}
				<div class="dialog-description">
					{description}
				</div>
			{/if}

			<div class="dialog-footer">
				<Button on:click={handleAction} variant='primary'>Yes</Button>
				<Button on:click={handleCloseModal} variant='secondary'>No</Button>
			</div>
		</div>
	</div>
</Modal>

<style>
	.dialog {
		display: inline-block;
		border-radius: 0.4rem;
		background: var(--clr-bg);
		border: 0.1rem solid var(--clr-bg-secondary);
		padding: 1.2rem;
		color: var(--clr-text-primary);
		box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
		z-index: 20;
		min-width: 30rem;
	}

	.dialog-top {
		display: flex;
		align-items: center;
		justify-content: space-between;
		margin-bottom: 3.2rem;
	}

	.dialog-description {
		margin-bottom: 2.4rem;
	}

	.heading {
		font-size: 2rem;
		color: var(--clr-text-primary);
		font-weight: 700;
		text-align: center;
	}

	.close-btn {
		color: var(--clr-text-secondary);
	}

	.close-btn:hover {
		color: var(--clr-text-secondary-hover);
	}

	.dialog-content {
		min-width: 25rem;
		max-width: 35rem;
		color: var(--clr-text-secondary);
	}

	.dialog-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.8rem;
	}
</style>
