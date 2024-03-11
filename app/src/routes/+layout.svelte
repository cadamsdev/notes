<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';
	import NotesView from '../components/NotesView.svelte';
	import Sidebar from '../components/Sidebar.svelte';
	import { notes, selectedNote } from '../store';

	async function load(): Promise<void> {
		if (browser) {
			const result = await window.electron.getNotes();
			notes.set(result);
			selectedNote.set(result[0]);
		}
	}

	load();
</script>

<div class="flex h-full">
	<Sidebar />

	<NotesView />

	<div class="flex-grow p-4">
		<slot />
	</div>
</div>

