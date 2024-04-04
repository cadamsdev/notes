<script lang="ts">
	import Icon from '@iconify/svelte';
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
			return 'justify-center items-baseline pt-8';
		}

		return 'justify-center items-center';
	}
</script>

{#if showModal}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		bind:this={overlayRef}
		class={clsx('fixed w-full h-full bg-black z-10 inset-0 bg-opacity-25 flex', getPositionClass())}
		use:teleport={'teleport'}
		on:click={handleCloseModal}
	>
		<slot />
	</div>
{/if}
