<script lang="ts">
	import { selectedNote } from '../store';
	import { onMount } from 'svelte';

	let editorRef: any = null;

	onMount(async () => {
		const Header: any = (await import('@editorjs/header')).default;
		//@ts-ignore
		const Code: any = (await import('@editorjs/code')).default;

		//@ts-ignore
		const InlineCode: any = (await import('@editorjs/inline-code')).default;
		const EditorJS = await import('@editorjs/editorjs');
		const editor = new EditorJS.default({
			holder: editorRef,
			placeholder: 'Type / for commands',
			inlineToolbar: true,
			tools: {
				header: {
					class: Header,
					inlineToolbar: true,
					config: {
						levels: [1, 2, 3]
					}
				},
				code: { class: Code },
				inlineCode: { class: InlineCode, inlineToolbar: true }
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
