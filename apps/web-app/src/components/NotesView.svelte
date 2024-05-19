<script lang="ts">
	import Icon from '@iconify/svelte';
	import { notes, selectedNote, type Note, deleteNote, createNote, tags, fetchTags } from '../store';
	import clsx from 'clsx';
	import { get, type Unsubscriber } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import ContextMenu from './ContextMenu.svelte';
	import ConfirmationDialog from './ConfirmationDialog.svelte';
	import Input from './Input.svelte';

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

<div class="bg-slate-200 w-[240px] min-w-[240px] max-w-[240px]">
	<div>
		<div bind:this={searchSection} class="p-4">
			<div class="flex justify-end">
				<button on:click={async () => await handleCreateNote()} class="bg-slate-200 hover:bg-slate-300 p-2 rounded mb-4"
					><Icon icon="fa-solid:plus" /></button>
			</div>
			<Input on:input={handleSearch} placeholder="Search..." />
		</div>
		<div class="overflow-y-auto" style="height: calc(100vh - {searchSectionHeight}px);">
			{#each filteredNotes as note, index}
				<button
					id={`note-${note.id}`}
					class={clsx('block w-full text-left p-4 hover:bg-slate-300', {
						'rounded-t': index === 0,
						'rounded-b': index === get(notes).length - 1,
						'bg-slate-300': $selectedNote?.id === note.id,
					})}
					on:click={() => selectNote(note)}
				>
					<div>{note.title}</div>
					<div class="flex gap-1">
						{#each (note.tags ?? []) as tag}
							<div class="inline-block px-2 py-1 text-xs bg-gray-300 rounded-sm">
								#{tag.name}
							</div>
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
