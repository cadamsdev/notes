<script lang="ts">
	import clsx from 'clsx';
	import { selectedNote } from '../store';
	import { onMount } from 'svelte';

	let editorRef: any = null;

	onMount(async () => {
		const Header: any = (await import('@editorjs/header')).default;
		//@ts-ignore
		const Code: any = (await import('@editorjs/code')).default;
		//@ts-ignore
		const List: any = (await import('@editorjs/list')).default;
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
				inlineCode: { class: InlineCode, inlineToolbar: true },
				list: {
					class: List,
					inlineToolbar: true,
					config: {
						defaultStyle: 'unordered'
					}
				}
			}
		});
	});
</script>

{#if !$selectedNote}
	<div class="flex items-center justify-center h-full">
		<div>No content</div>
	</div>
{/if}

<div bind:this={editorRef} id="editor" class={clsx({ hidden: !$selectedNote })}></div>
