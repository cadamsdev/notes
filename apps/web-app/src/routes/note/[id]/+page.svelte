<script lang="ts">
	import { onDestroy } from 'svelte';
	import { openModal, closeModal, fetchTags, fetchNotes } from '../../../store';
	import { get, type Unsubscriber } from 'svelte/store';
	import Icon from '@iconify/svelte';
	import TagCombobox from '../../../components/TagCombobox.svelte';
	import type { Tag } from '../../../interfaces/Tag';
	import Dialog from '../../../components/Dialog.svelte';
	import Button from '../../../components/Button.svelte';
	import Chip from '../../../components/Chip.svelte';
	import { MODAL_TAG } from '../../../constants/modal.constants';
	import { page } from '$app/stores';
	import { saveTags } from '$lib/api';
	import Tiptap from '../../../components/Tiptap.svelte';
	import { selectedNote } from '$lib/stores/notes';

	let tempTags: Tag[] = [];
	let selectedTags: Tag[] = [...get(selectedNote)?.tags || []];
	let subscriptions: Unsubscriber[] = [];

	subscriptions.push(
		selectedNote.subscribe((note) => {
			console.log('note changed');
			console.log(note);
			if (note) {
				selectedTags = [...note.tags || []];
			}
		}),
	);

	function handleSelectTag(e: CustomEvent<{ tags: Tag[] }>) {
		const { tags } = e.detail;
		selectedTags = [...tags];
	}

	async function handleSaveTags() {
		const currentPage = get(page);

		if (!currentPage) {
			return;
		}

		const noteId = +currentPage.params.id;

		if (!noteId) {
			return;
		}

		selectedTags = [...selectedTags, ...tempTags];
		const response = await saveTags(noteId, selectedTags);

		if (!response.ok) {
			console.error('failed to save tags');
			return;
		}

		await Promise.all([fetchTags(), fetchNotes()])
		closeModal();
	}

	onDestroy(() => {
		subscriptions.forEach((unsub) => unsub());
		subscriptions = [];
	});
</script>

<div class="relative">
	<div class="px-16 py-4 max-h-screen overflow-y-auto">
		{#if !$selectedNote}
			<div class="flex items-center justify-center h-full">
				<div>No content</div>
			</div>
		{/if}

			<Tiptap />
	</div>

	<div class="fixed bottom-0 p-3 bg-bg border-t border-bg-border text-text-primary w-full z-10 flex items-center gap-2 min-h-[50px]">
		<button on:click={() => openModal(MODAL_TAG)}><Icon icon="fa-solid:tags" /></button>
		{#if selectedTags.length === 0}
			<button on:click={() => openModal(MODAL_TAG)} class="text-sm">Click to add Tags...</button>
		{:else}
			<div class="flex flex-wrap gap-2">
				{#each selectedTags as tag}
					<button on:click={() => openModal(MODAL_TAG)}>
						<Chip text={tag.name} color={tag.color} />
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<Dialog id={MODAL_TAG}>
	<div class="min-w-[300px]">
		<div>
			<div class="font-bold mb-4 text-text-primary">Tags</div>
		</div>
		<div class="mb-4">
			<TagCombobox
				selectedTags={selectedTags}
				on:selectTag={handleSelectTag}
			/>
		</div>

		<div class="flex justify-end gap-2">
			<Button on:click={handleSaveTags}>Save</Button>
			<Button variant="secondary" on:click={() => closeModal()}>Cancel</Button>
		</div>
	</div>
</Dialog>
