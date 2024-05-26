<script lang="ts">
	import Icon from '@iconify/svelte';
	import { notes, selectedNote, type Note, deleteNote, createNote, tags, fetchTags } from '../store';
	import clsx from 'clsx';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import ContextMenu from './ContextMenu.svelte';
	import ConfirmationDialog from './ConfirmationDialog.svelte';
	import Input from './Input.svelte';
	import Chip from './Chip.svelte';
	import SearchInput from './SearchInput.svelte';

	let filteredNotes: Note[] = [];
	let showConfirmationModal = false;
	let noteToRemove: Note | undefined;
	let searchText = '';
	let searchSection: HTMLDivElement;

	$: searchSectionHeight = searchSection?.clientHeight;

	const unsubscribe = notes.subscribe((value) => {
			filteredNotes = [...value].filter((note) => note.title.toLowerCase().includes(searchText));
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
		searchText = (e.target as HTMLInputElement).value.toLowerCase();
		filteredNotes = $notes.filter((note) => note.title.toLowerCase().includes(searchText));
	}

	function handleShowRemoveNoteDialog(note: Note): void {
		noteToRemove = note;
		showConfirmationModal = true;
	}

	async function handleRemoveNote(): Promise<void> {
		if (!noteToRemove) {
			return;
		}

		await deleteNote(noteToRemove);
		await fetchTags();

		noteToRemove = undefined;
	}

	function handleCloseConfirmationDialog() {
		showConfirmationModal = false;
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
			<SearchInput on:input={handleSearch} placeholder="Search..." />
		</div>
		<div class="scroll-container" style="height: calc(100vh - {searchSectionHeight}px);">
			{#each filteredNotes as note}
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
							<Chip text={tag.name} />
						{/each}
					</div>
					
					<ContextMenu
						targetId={`note-${note.id}`}
						actions={[{ label: 'Remove', action: () => handleShowRemoveNoteDialog(note) }]}
					/>
				</button>
			{/each}
		</div>
	</div>
</div>

<ConfirmationDialog
	showModal={showConfirmationModal}
	on:closeModal={handleCloseConfirmationDialog}
	on:action={async () => await handleRemoveNote()}
/>

<style>
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
