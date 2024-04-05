<script lang="ts">
	import Icon from '@iconify/svelte';
	import Modal from './Modal.svelte';
	import { createEventDispatcher } from 'svelte';

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
	<div class="rounded bg-white p-3 shadow-lg inline-block z-20">
		<div class="flex items-center justify-between mb-8">
			<h2 class="text-xl font-bold text-center">Confirm Action</h2>
			<button on:click={handleCloseModal} class="hover:text-gray-600 text-black">
				<Icon icon="fa-solid:times" width="24" height="24" />
			</button>
		</div>
		<div class="min-w-[250px] max-w-[325px]">
			{#if description}
				<div class="mb-8">
					{description}
				</div>
			{/if}

			<div class="flex justify-end gap-2">
				<button on:click={handleCloseModal} class="py-2 px-3 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer">No</button>
				<buttom on:click={handleAction} class="py-2 px-3 bg-red-700 hover:bg-red-800 text-white rounded cursor-pointer">Yes</buttom>
			</div>
		</div>
	</div>
</Modal>
