<script lang="ts">
	import Icon from '@iconify/svelte';
	import { notes, selectedNote, type Note, deleteNote, createNote, fetchTags, openModal, selectedTags, searchNotes, filteredNotes } from '../store';
	import clsx from 'clsx';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import ContextMenu from './ContextMenu.svelte';
	import ConfirmationDialog from './ConfirmationDialog.svelte';
	import Chip from './Chip.svelte';
	import SearchInput from './SearchInput.svelte';
	import { MODAL_REMOVE_NOTE } from '../constants/modal.constants';

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

		await deleteNote(noteToRemove, noteToSelect);
		await fetchTags();
		searchNotes(searchText);

		noteToRemove = undefined;
	}

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div class="notes-view">
	<div>
		<div bind:this={searchSection} class="search-container">
			<div class="flex justify-end">
				<button on:click={async () => await handleCreateNote()} class="add-btn"
					><Icon icon="fa-solid:plus" /></button>
			</div>
			<SearchInput on:search={handleSearch} placeholder="Search..." />

			<div class="filter-tag-container">
				{#each $selectedTags as filteredTag}
					<Chip
						text={filteredTag.name}
						color={filteredTag.color}
						hasCloseBtn
						on:close={() => selectedTags.update((tags) => tags.filter((tag) => tag.id !== filteredTag.id))}
					/>
				{/each}
			</div>
		</div>
		<div class="scroll-container" style="height: calc(100vh - {searchSectionHeight}px);">
			{#each $filteredNotes as note, index}
				<button
					id={`note-${note.id}`}
					class={clsx('note', {
						'active': $selectedNote?.id === note.id,
					})}
					on:click={() => selectNote(note)}
				>
					<div class="title">{note.title}</div>
					<div class="tags-container">
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

<style>
	.filter-tag-container {
		margin-top: 0.8rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}

	.notes-view {
		background: var(--clr-bg);
		width: 32rem;
		border-right: 0.1rem solid var(--clr-bg-border);
	}

	.search-container {
		padding: 1.6rem;
	}

	.add-btn {
		background: var(--clr-bg);
		color: var(--clr-text-primary);
		padding: 0.8rem;
		border-radius: 0.4rem;
		margin-bottom: 1.6rem;
	}

	.add-btn:hover {
		background: var(--clr-bg-hover);
	}

	.scroll-container {
		overflow-y: auto;
		padding-top: 0.4rem;
	}

	.note {
		display: block;
		width: 100%;
		text-align: left;
		padding: 1.6rem;
		border-bottom: 0.1rem solid var(--clr-bg-secondary);
		font-size: 1.6rem;
	}

	.note:hover {
		background: var(--clr-bg-secondary);
	}

	.note.active {
		background: var(--clr-bg-secondary);
	}

	.note .title {
		margin-bottom: 1.2rem;
		color: var(--clr-text-primary-emphasis);
	}

	.tags-container {
		display: flex;
		gap: 0.4rem;
		flex-wrap: wrap;
	}
</style>
