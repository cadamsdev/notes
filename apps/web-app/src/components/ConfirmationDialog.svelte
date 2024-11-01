<script lang="ts">
	import Icon from '@iconify/svelte';
	import Modal from './Modal.svelte';
	import { createEventDispatcher } from 'svelte';
	import Button from './Button.svelte';
	import { closeModal } from '../store';

    let { id, description = 'Are you sure you want to this?' }: { id: string, description?: string } = $props();

	const dispatch = createEventDispatcher();

	function handleCloseModal() {
		dispatch('closeModal');
		closeModal();
	}

	function handleAction() {
		dispatch('action');
		dispatch('closeModal');
		closeModal();
	}
</script>

<Modal {id} on:closeModal={handleCloseModal}>
    <div class="inline-block rounded-[0.25rem] bg-bg border border-bg-border p-3 text-text-primary shadow-md z-20 min-w-[18.75rem]">
        <div class="flex items-center justify-between mb-8">
            <h2 class="text-[1.25rem] text-text-primary font-bold text-center">Confirm Action</h2>
            <button onclick={handleCloseModal} class="text-text-secondary hover:text-text-primary-hover">
                <Icon icon="fa-solid:times" width="24" height="24" />
            </button>
        </div>
        <div class="min-w-[15.625rem] max-w-[21.875rem] text-text-secondary">
            {#if description}
                <div class="mb-6">
                    {description}
                </div>
            {/if}

            <div class="flex justify-end gap-2">
                <Button onclick={handleAction} variant='primary'>Yes</Button>
                <Button onclick={handleCloseModal} variant='secondary'>No</Button>
            </div>
        </div>
    </div>
</Modal>
