<script lang="ts">
	import { teleport } from '../actions/teleport';
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';

	type ModalPosition = 'center' | 'center-top';

	export let showModal = false;
	export let position: ModalPosition = 'center-top';

	const dispatch = createEventDispatcher();

	let overlayRef: HTMLDivElement;

	function handleCloseModal(e: Event) {
		if (e.target === overlayRef) {
			dispatch('closeModal');
		}
	}

	function getPositionClass(): string {
		if (position === 'center-top') {
			return 'modal-center-top';
		}

		return 'modal-center';
	}
</script>

{#if showModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		bind:this={overlayRef}
		class={clsx('modal-overlay', getPositionClass())}
		use:teleport={'teleport'}
		on:click={handleCloseModal}
	>
		<slot />
	</div>
{/if}

<style>
	.modal-center-top {
		padding-top: 3.2rem;
		justify-content: center;
		align-items: baseline;
	}

	.modal-center {
		justify-content: center;
		align-items: center;
	
	}

	.modal-overlay {
		display: flex;
		position: fixed;
		width: 100%;
		height: 100%;
		background: var(--clr-modal-overlay);
		z-index: 10;
		inset: 0px;
	}
</style>
