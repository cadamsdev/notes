<script lang="ts">
	import Icon from '@iconify/svelte';
	import { notes, selectedNote, type Note } from '../store';
	import clsx from 'clsx';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';
	import { onDestroy } from 'svelte';

	let filteredNotes: Note[] = [];

	const unsubscribe = notes.subscribe((value) => {
		filteredNotes = [...value];
	});

	function selectNote(note: Note): void {
		if ($selectedNote?.id !== note.id) {
			selectedNote.update(() => note);
		}
		goto(`/note/${note.id}`);
	}

	async function createNote(): Promise<void> {
		const lastID = await window.electron.createNote('A title', '');
		notes.update((items) => {
			items.push({ id: lastID, title: 'A title', content: '' });
			return items;
		});
	}

	function handleSearch(e: Event) {
		const searchText = (e.target as HTMLInputElement).value.toLowerCase();
		filteredNotes = $notes.filter((note) => note.title.toLowerCase().includes(searchText));
	}

	onDestroy(() => {
		unsubscribe();
	});

</script>

<div class="bg-slate-200 w-[240px] min-w-[240px] max-w-[240px]">
	<div class="p-4">
		<div class="flex justify-end">
			<button on:click={createNote} class="bg-slate-200 hover:bg-slate-300 p-2 rounded mb-4"
				><Icon icon="fa-solid:plus" /></button
			>
		</div>
		<input on:input={handleSearch} class="p-2 rounded mb-4 w-full" placeholder="Search..." />
		<div class="max-h-[434px] overflow-y-auto">
			{#each filteredNotes as note, index}
				<button
					class={clsx('block w-full text-left p-4 bg-slate-300 hover:bg-slate-400', {
						'rounded-t': index === 0,
						'rounded-b': index === get(notes).length - 1
					})}
					on:click={() => selectNote(note)}
				>
					{note.id}
					{note.title}
				</button>
			{/each}
		</div>
	</div>
</div>
