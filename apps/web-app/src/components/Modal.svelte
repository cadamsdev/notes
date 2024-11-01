<script lang="ts">
	import { teleport } from '../actions/teleport';
	import clsx from 'clsx';
	import { currentModal } from '../store';
	import { clickOutside } from '../directives/clickOutside';
	import { createEventDispatcher, onDestroy } from 'svelte';

	type ModalPosition = 'center' | 'center-top';

	let { id, position = 'center-top', children }: { id: string, position?: ModalPosition, children: any } = $props();

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
	<div
		class={clsx(
			'fixed inset-0 w-full h-full z-10 bg-modal-overlay flex',
			position === 'center-top' ? 'pt-8 justify-center items-baseline' : 'justify-center items-center'
		)}
		use:teleport={'teleport'}
		use:clickOutside={handleCloseModal}
	>
		{@render children?.()}
	</div>
{/if}
