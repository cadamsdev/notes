<script lang="ts">
	import Icon from '@iconify/svelte';
	import { notes, selectedNote, type Note } from '../store';
	import clsx from 'clsx';
	import { get } from 'svelte/store';
	import { goto } from '$app/navigation';

	function selectNote(note: Note): void {
		if ($selectedNote.id !== note.id) {
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
</script>

<div class="bg-slate-200 w-[240px] min-w-[240px] max-w-[240px]">
	<div class="p-4">
		<div class="flex justify-end">
			<button on:click={createNote} class="bg-slate-200 hover:bg-slate-300 p-2 rounded mb-4"
				><Icon icon="fa-solid:plus" /></button
			>
		</div>
		<input class="p-2 rounded mb-4" placeholder="Search..." />
		<div class="max-h-[405px] overflow-y-auto">
			{#each $notes as note, index}
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
