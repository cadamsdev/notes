<script lang="ts">
	import Icon from '@iconify/svelte';
	import { notes, selectedNote, type Note } from '../store';

	function selectNote(note: Note): void {
		selectedNote.update(() => note);
	}

	async function createNote(): Promise<void> {
		const lastID = await window.electron.createNote('A title', 'A note');
		console.log(lastID);

		notes.update((items) => {
			items.push({ id: lastID, title: 'A title', content: 'A note' });
			return items;
		});
	}
</script>

<div class="bg-slate-200">
	<div class="p-4">
		<div class="flex justify-end">
			<button on:click={createNote} class="bg-slate-200 hover:bg-slate-300 p-2 rounded mb-4"
				><Icon icon="fa-solid:plus" /></button
			>
		</div>
		<input class="p-2 rounded mb-4" placeholder="Search..." />

			{#each $notes as note}
		<button
			class="block rounded w-full text-left p-4 bg-slate-300 hover:bg-slate-400"
			on:click={() => selectNote(note)}
		>
			{note.id}
			{note.title}
		</button>
	{/each}
	</div>
</div>
