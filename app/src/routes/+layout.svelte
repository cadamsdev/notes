<script lang="ts">
	import { browser } from '$app/environment';
	import '../app.css';
	import { notes } from '../store';

	async function load(): Promise<void> {
		if (browser) {
			const result = await window.electron.getNotes();
			notes.set(result);
		}
	}

	load();
</script>

<slot />
