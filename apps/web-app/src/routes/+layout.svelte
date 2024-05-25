<script lang="ts">
	import '../styles/styles.css';
	import NotesView from '../components/NotesView.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import { notes, selectedNote } from '../store';
	import type { LayoutData } from './$types';

	export let data: LayoutData;

	notes.set(data.notes);
	selectedNote.set(data.notes[0]);
</script>

<svelte:head>
	<title>Block Notes</title>
</svelte:head>

<div class="flex h-full">
	<Sidebar />

	<NotesView />

	<div class="flex-grow bg-bg text-text-secondary">
		<slot />
	</div>
</div>

<div id="teleport"></div>

