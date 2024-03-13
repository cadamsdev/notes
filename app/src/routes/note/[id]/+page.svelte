<script lang="ts">
	import clsx from 'clsx';
	import { onDestroy, onMount } from 'svelte';
	import { notes, selectedNote, type Note } from '../../../store';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { get } from 'svelte/store';
	import Icon from '@iconify/svelte';
	import Modal from '../../../components/Modal.svelte';

	let editorRef: any = null;
	let editor: EditorJS.default;
	let timer: any;
	export let data: PageData;

	let tagModal: Modal;

	const unsubscribe = selectedNote.subscribe((note) => {
		if (!note) {
			return;
		}

		if (!note.content) {
			editor?.render({ blocks: [] });
			return;
		}

		const noteData = JSON.parse(note.content);
		editor?.render(noteData);
	});

	function onInputChange(): void {
		clearTimeout(timer);

		timer = setTimeout(async () => {
			const outputData = await editor.save();
			let title: string | undefined;
			if (outputData.blocks.length > 0) {
				title = outputData.blocks[0].data['text'];
			}

			const outputString = JSON.stringify(outputData);

			if (browser) {
				const id = +data.id;

				const updatedNote: Note = {
					id,
					title: title || 'New note',
					content: outputString
				};

				const result = await window.electron.updateNote(updatedNote);
				console.log('saved!', result);
				notes.update((items) => {
					const index = items.findIndex((item) => item.id === id);
					const item = items[index];
					item.title = updatedNote.title;
					item.content = updatedNote.content;
					return items;
				});
			}
		}, 750);
	}

	onMount(async () => {
		const Header: any = (await import('@editorjs/header')).default;
		//@ts-ignore
		const Code: any = (await import('@editorjs/code')).default;
		//@ts-ignore
		const List: any = (await import('@editorjs/list')).default;
		//@ts-ignore
		const InlineCode: any = (await import('@editorjs/inline-code')).default;
		const EditorJS = await import('@editorjs/editorjs');

		const currentNote = get(selectedNote);

		let data = undefined;

		if (currentNote?.content) {
			data = JSON.parse(currentNote.content);
		}

		editor = new EditorJS.default({
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
			},
			data
		});

		if (browser) {
			window.addEventListener('input', onInputChange);
		}
	});

	function openTagModal() {
		tagModal.showModal();
	}

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('input', onInputChange);
		}
		unsubscribe();
	});
</script>

<div class="relative">
	<div class="p-4 max-h-screen overflow-y-auto">
		{#if !$selectedNote}
			<div class="flex items-center justify-center h-full">
				<div>No content</div>
			</div>
		{/if}

		<div bind:this={editorRef} id="editor" class={clsx({ hidden: !$selectedNote })}></div>
	</div>

	<div class="fixed bottom-0 p-2 z-10 bg-white w-full">
		<div class="flex items-center gap-2">
			<button on:click={openTagModal}><Icon icon="fa-solid:tags" /></button>
			<button on:click={openTagModal} class="text-sm">Click to add Tags...</button>
		</div>
	</div>
</div>

<Modal
	bind:this={tagModal}
	showHeader
>
	<div>Hello world</div>
</Modal>
