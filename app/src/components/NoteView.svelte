<script lang="ts">
	import { selectedNote } from '../store';
</script>

{#if $selectedNote?.title}
	<h1 class="text-xl font-bold mb-4">{$selectedNote?.title}</h1>
{/if}

{#if $selectedNote?.content}
	<div>{$selectedNote?.content}</div>
{/if}
