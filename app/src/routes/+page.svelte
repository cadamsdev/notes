<script lang="ts">
	import Sidebar from '../components/Sidebar.svelte';
	import NotesView from '../components/NotesView.svelte';
	import NoteView from '../components/NoteView.svelte';
</script>

<div class="flex h-full">
	<Sidebar />

	<NotesView />

	<div class="flex-grow p-4">
		<NoteView />
	</div>
</div>
