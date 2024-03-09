<script lang="ts">
	import { selectedNote } from '../store';
	import { onMount } from 'svelte';

	let editorRef: any = null;

	onMount(async () => {
		const Header: any = (await import('@editorjs/header')).default;
		//@ts-ignore
		const Code: any = (await import('@editorjs/code')).default;
		const EditorJS = await import('@editorjs/editorjs');
		const editor = new EditorJS.default({
			holder: editorRef,
			placeholder: 'Type / for commands',
			inlineToolbar: true,
			tools: {
				header: { class: Header, inlineToolbar: true },
				code: { class: Code }
			}
		});
	});
</script>

{#if $selectedNote?.title}
	<h1 class="text-xl font-bold mb-4">{$selectedNote?.title}</h1>
{/if}

{#if $selectedNote?.content}
	<div>{$selectedNote?.content}</div>
{/if}

<div bind:this={editorRef} id="editor"></div>
