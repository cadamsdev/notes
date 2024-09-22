<script lang="ts">
	import Icon from '@iconify/svelte';
	import { notes, selectedNote, type Note, createNote, openModal, selectedTags, searchNotes, filteredNotes, deleteNote, fetchTags } from '../store';
	import clsx from 'clsx';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import ContextMenu from './ContextMenu.svelte';
	import ConfirmationDialog from './ConfirmationDialog.svelte';
	import Chip from './Chip.svelte';
	import SearchInput from './SearchInput.svelte';
	import { MODAL_REMOVE_NOTE } from '../constants/modal.constants';
	import { page } from '$app/stores';

	let noteToRemove: Note | undefined;
	let noteToSelect: Note | undefined;
	let searchText = '';
	let searchSection: HTMLDivElement;

	$: searchSectionHeight = searchSection?.clientHeight;

	const unsubscribe = notes.subscribe(() => {
		searchNotes(searchText);
	});

	selectedTags.subscribe(() => {
		searchNotes(searchText);
	});

	function selectNote(note: Note): void {
		if ($selectedNote?.id !== note.id) {
			selectedNote.update(() => note);
		}
		goto(`/note/${note.id}`);
	}

	async function handleCreateNote(): Promise<void> {
		const note = await createNote();
		if (note) {
			selectedNote.set(note);
			goto(`/note/${note.id}`);
		}
	}

	function handleSearch(e: Event) {
		if (e instanceof CustomEvent) {
			searchText = e.detail.text.toLowerCase();	
		}

		searchNotes(searchText);
	}

	function handleShowRemoveNoteDialog(note: Note, index: number): void {
		noteToRemove = note;
		noteToSelect = $filteredNotes[index + 1] ?? $filteredNotes[index - 1];
		openModal(MODAL_REMOVE_NOTE);
	}

	async function handleRemoveNote(): Promise<void> {
		if (!noteToRemove) {
			return;
		}

		await deleteNote(noteToRemove.id, noteToSelect);
		await fetchTags();
		// searchNotes(searchText);

		noteToRemove = undefined;
	}

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="bg-bg w-[20rem] border-r border-bg-border">
    <div>
        <div bind:this={searchSection} class="p-4">
            <div class="flex justify-end mb-4">
                <button on:click={async () => await handleCreateNote()} class="bg-bg text-text-primary p-2 rounded hover:bg-bg-hover">
                    <Icon icon="fa-solid:plus" />
                </button>
            </div>
            <SearchInput on:search={handleSearch} placeholder="Search..." />

						{#if $selectedTags.length}
							<div class="mt-2 flex flex-wrap gap-1">
									{#each $selectedTags as filteredTag}
											<Chip
													text={filteredTag.name}
													color={filteredTag.color}
													hasCloseBtn
													on:close={() => selectedTags.update((tags) => tags.filter((tag) => tag.id !== filteredTag.id))}
											/>
									{/each}
							</div>
						{/if}
        </div>
        <div class="overflow-y-auto" style="height: calc(100vh - {searchSectionHeight}px);">
            {#each $filteredNotes as note, index}
                <button
                    id={`note-${note.id}`}
                    class={clsx('block w-full text-left p-4 border-b border-bg-secondary text-base', {
                        'bg-bg-secondary': +$page.params.id === note.id,
                        'hover:bg-bg-secondary': +$page.params.id !== note.id,
									})}
                    on:click={() => selectNote(note)}
                >
                    <div class="mb-3 text-text-primary-emphasis">{note.title}</div>
                    <div class="flex flex-wrap gap-1">
                        {#each (note.tags ?? []) as tag}
                            <Chip text={tag.name} color={tag.color} />
                        {/each}
                    </div>
                    
                    <ContextMenu
                        targetId={`note-${note.id}`}
                        actions={[{ label: 'Remove', action: () => handleShowRemoveNoteDialog(note, index) }]}
                    />
                </button>
            {/each}
        </div>
    </div>
</div>

<ConfirmationDialog
    id={MODAL_REMOVE_NOTE}
    on:action={async () => await handleRemoveNote()}
/>
