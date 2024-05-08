<script lang="ts">
	import Icon from '@iconify/svelte';
	import { notes, selectedNote, type Note, removeNote } from '../store';
	import clsx from 'clsx';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';
	import ContextMenu from './ContextMenu.svelte';
	import ConfirmationDialog from './ConfirmationDialog.svelte';
	import Input from './Input.svelte';

	let filteredNotes: Note[] = [];
	let showConfirmationModal = false;
	let noteToRemove: Note | undefined;
	let searchText = '';

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
		const formData = new FormData();
		formData.append('title', 'A title');
		formData.append('content', '');

		fetch('/', {
			method: 'POST',
			body: formData
		})
		.then((response) => response.json())
		.then((data) => {
			notes.update((items) => {
				items.push(data);
				return items;
			});
		})
		.catch((error) => {
			console.error('Error:', error);
		});
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

		await removeNote(noteToRemove);
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
		<div class="p-4">
			<div class="flex justify-end">
				<button on:click={handleCreateNote} class="bg-slate-200 hover:bg-slate-300 p-2 rounded mb-4"
					><Icon icon="fa-solid:plus" /></button>
			</div>
			<Input on:input={handleSearch} placeholder="Search..." />
		</div>
		<div class="max-h-[434px] overflow-y-auto">
			{#each filteredNotes as note, index}
				<button
					id={`note-${note.id}`}
					class={clsx('block w-full text-left p-4 hover:bg-slate-300', {
						'rounded-t': index === 0,
						'rounded-b': index === get(notes).length - 1
					})}
					on:click={() => selectNote(note)}
				>
					{note.title}

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
