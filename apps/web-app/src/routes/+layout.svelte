<script lang="ts">
	import '../styles/styles.css';
	import '@fontsource-variable/inter';
	import NotesView from '../components/NotesView.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import { notes, selectedNote } from '../store';
	import type { LayoutData } from './$types';
	import "../app.css";

	export let data: LayoutData;

	notes.set(data.notes);

	if (data.selectedNote) {
		selectedNote.set(data.selectedNote);
	}
</script>

<svelte:head>
	<title>Notes</title>
</svelte:head>

<div class="page">
	<Sidebar tagSort={data.tagSort} />

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

