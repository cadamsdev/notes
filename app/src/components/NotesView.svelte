<script lang="ts">
	import { notes, selectedNote, type Note } from '../store';

	const items = [
		{
			id: 1,
			title: 'A title',
			content: 'A note'
		},
		{
			id: 2,
			title: 'A title',
			content: 'A note'
		},
		{
			id: 3,
			title: 'A title',
			content: 'A note'
		},
		{
			id: 4,
			title: 'A title',
			content: 'A note'
		},
		{
			id: 5,
			title: 'A title',
			content: 'A note'
		}
	];

	function selectNote(note: Note): void {
		selectedNote.update(() => note);
	}
</script>

<div class=" bg-slate-200">
	<div class="p-6">
		<h2 class="text-lg font-bold mb-6">Some folder</h2>
		<input class="p-2 rounded mb-4" placeholder="Search..." />
	</div>

	{#each $notes as note}
		<button class="block w-full text-left p-4 bg-slate-300 hover:bg-slate-400" on:click={() => selectNote(note)}>
			{note.id}
			{note.title}
		</button>
	{/each}
</div>
