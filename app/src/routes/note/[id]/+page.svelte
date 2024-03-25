<script lang="ts">
	import clsx from 'clsx';
	import { onDestroy, onMount } from 'svelte';
	import { notes, selectedNote, type Note, fetchAllTags } from '../../../store';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { get } from 'svelte/store';
	import Icon from '@iconify/svelte';
	import Modal from '../../../components/Modal.svelte';
	import TagCombobox from '../../../components/TagCombobox.svelte';
	import type { Tag } from '../../../interfaces/Tag';

	let editorRef: any = null;
	let editor: EditorJS.default;
	let timer: any;
	let showTagModal = false;
	let selectedTags: Tag[] = [];

	export let data: PageData;

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

	function handleSelectTag(e: CustomEvent<{ tags: Tag[] }>) {
		const { tags } = e.detail;
		selectedTags = [...tags];
	}

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

	async function handleSaveTags() {
		const note = get(selectedNote);

		if (!note) {
			return;
		}

		console.log('save tags', selectedTags);
		window.electron.saveTags(note.id, selectedTags);
		await fetchAllTags();
		showTagModal = false;
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
		showTagModal = true;
		selectedTags = [...data.tags];
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

			{#if data.tags.length === 0}
				<button on:click={openTagModal} class="text-sm">Click to add Tags...</button>
				{:else}
				<div class="flex gap-2">
					{#each data.tags as tag}
						<button on:click={openTagModal} class="text-sm">{tag.label}</button>
					{/each}
				</div>
			{/if}
		</div>
	</div>
</div>

<Modal
	bind:showModal={showTagModal}
	showHeader
	position="center-top"
	on:closeModal={() => (showTagModal = false)}
>
	<div class="w-[325px] max-w-[325px]">
		<div>
			<div class="font-bold mb-4">Tags</div>
		</div>
		<div class="mb-4">
			<TagCombobox selectedTags={selectedTags} on:selectTag={handleSelectTag} />
		</div>

		<div class="flex justify-end gap-2">
			<button on:click={handleSaveTags} class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Save</button>
			<button
				on:click={() => (showTagModal = false)}
				class="bg-gray-300 hover:bg-gray-400 py-2 px-4 rounded">Cancel</button
			>
		</div>
	</div>
</Modal>
