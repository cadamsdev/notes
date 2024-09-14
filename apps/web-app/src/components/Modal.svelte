<script lang="ts">
	import { teleport } from '../actions/teleport';
	import clsx from 'clsx';
	import { currentModal } from '../store';
	import { clickOutside } from '../directives/clickOutside';
	import { createEventDispatcher, onDestroy } from 'svelte';

	type ModalPosition = 'center' | 'center-top';

	export let id: string;
	export let position: ModalPosition = 'center-top';

	let dispatcher = createEventDispatcher();

	function handleCloseModal() {
		dispatcher('closeModal');
	}

	const unsubscribe = currentModal.subscribe((value) => {
		if (!value) {
			handleCloseModal();
		}
	});

	onDestroy(() => {
		unsubscribe();
	});	

</script>

{#if $currentModal === id}
	<!-- svelte-ignore a11y-click-events-have-key-events -->
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class={clsx(
			'fixed inset-0 w-full h-full z-10 bg-modal-overlay flex',
			position === 'center-top' ? 'pt-8 justify-center items-baseline' : 'justify-center items-center'
		)}
		use:teleport={'teleport'}
		use:clickOutside={handleCloseModal}
	>
		<slot />
	</div>
{/if}
