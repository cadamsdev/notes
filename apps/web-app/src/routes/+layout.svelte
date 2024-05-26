<script lang="ts">
	import '../styles/styles.css';
	import '@fontsource-variable/inter';
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

<div class="page">
	<Sidebar />

	<NotesView />

	<div class="page-content">
		<slot />
	</div>
</div>

<div id="teleport"></div>

<style>
	.page {
		display: flex;
		height: 100%;
	}

	.page-content {
		flex-grow: 1;
		background: var(--clr-bg);
		color: var(--clr-text-primary);
	}
</style>

