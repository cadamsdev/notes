<script lang="ts">
	import clsx from 'clsx';
	import { onDestroy, onMount } from 'svelte';
	import { notes, selectedNote, type Note, openModal, closeModal, fetchTags, fetchNotes } from '../../../store';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { get, type Unsubscriber } from 'svelte/store';
	import Icon from '@iconify/svelte';
	import TagCombobox from '../../../components/TagCombobox.svelte';
	import type { Tag } from '../../../interfaces/Tag';
	import Dialog from '../../../components/Dialog.svelte';
	import Button from '../../../components/Button.svelte';
	import Chip from '../../../components/Chip.svelte';
	import { MODAL_TAG } from '../../../constants/modal.constants';
	import { page } from '$app/stores';
	import { saveTags, updateNote } from '$lib/api';

	export let data: PageData;

	let editorRef: any = null;
	let editor: EditorJS.default;
	let tempTags: Tag[] = [];
	let selectedTags: Tag[] = [...data.note?.tags || []];
	let subscriptions: Unsubscriber[] = [];

	subscriptions.push(
		selectedNote.subscribe((note) => {
			if (note) {
				selectedTags = [...note.tags || []];
			}
		}),
	);

	function handleSelectTag(e: CustomEvent<{ tags: Tag[] }>) {
		const { tags } = e.detail;
		selectedTags = [...tags];
	}

	async function save() {
		const outputData = await editor.save();
		let title: string | undefined;
		if (outputData.blocks.length > 0) {
			title = sanitizeTitle(outputData.blocks[0].data?.['text']);
		}

		const outputString = JSON.stringify(outputData);
		const id = +data.id;
		const updatedNote: Note = {
			id,
			title: title ?? 'New note',
			content: outputString ?? ''
		};

		const response = await updateNote(updatedNote);

		if (!response.ok) {
			console.error('failed to save');
			return;
		}

		console.log('saved!');
		notes.update((items) => {
			const index = items.findIndex((item) => item.id === id);
			const item = items[index];
			item.title = updatedNote.title;
			item.content = updatedNote.content;
			return items;
		});
	}

	function sanitizeTitle(title?: string): string {
		if (!title) {
			return '';
		}
		title = title.replace(/<a.*?>(.*?)<\/a>/, '$1'); // remove anchor tags
		title = title.replace(/<code.*?>(.*?)<\/code>/, '$1'); // remove inline code element
		title = title.replace(/&nbsp;/g, ' '); // replace space entitiy
		return title;
	} 

	async function handleSaveTags() {
		const note = get(selectedNote);

		if (!note) {
			return;
		}

		selectedTags = [...selectedTags, ...tempTags];
		const response = await saveTags(note.id, selectedTags);

		if (!response.ok) {
			console.error('failed to save tags');
			return;
		}

		const [_, notes] = await Promise.all([fetchTags(), fetchNotes()]);

		const currentNote = notes.find((n) => n.id === note.id);
		selectedNote.set(currentNote);

		closeModal();
	}

	async function setupEditor() {
		const EditorJS = await import('@editorjs/editorjs');
		//@ts-ignore
		const InlineCode: any = (await import('@editorjs/inline-code')).default;
		//@ts-ignore
		const Paragraph = (await import('@editorjs/paragraph')).default;
		const { H1, H2, H3 }  = await import('../../../lib/editorjs/plugins/Heading');
		const { CodeBlock }  = await import('../../../lib/editorjs/plugins/CodeBlock');
		const { BulletedList, NumberedList } = await import('../../../lib/editorjs/plugins/List');
		const { QuotePlugin } = await import('$lib/editorjs/plugins/Quote');
		const { DividerPlugin } = await import('$lib/editorjs/plugins/Divider');

		let pageContent = undefined;

		if (data.note?.content) {
			pageContent = JSON.parse(data.note.content);
		}

		editor?.destroy();
		editor = new EditorJS.default({
			holder: editorRef,
			placeholder: 'Write something or type \'/\' for commands.',
			inlineToolbar: true,
			tools: {
				h1: H1,
				h2: H2,
				h3: H3,
				inlineCode: { class: InlineCode, inlineToolbar: true },
				ul: BulletedList,
				ol: NumberedList,
				code: CodeBlock,
				quote: QuotePlugin,
				divider: DividerPlugin,
				paragraph: {
					class: Paragraph,
					inlineToolbar: true,
					config: {
						preserveBlank: true,
					}
				}
			},
			data: pageContent,
			onChange: async () => {
				await save();
			},
		});
	}

	async function handleSave() {
		await save();
	}

	onMount(async () => {	
		subscriptions.push(
			page.subscribe(() => {
				setupEditor();
			})
		);

		window.addEventListener('editor-save', handleSave);
	});

	onDestroy(() => {
		subscriptions.forEach((unsub) => unsub());
		subscriptions = [];

		if (browser) {
			window.removeEventListener('editor-save', handleSave);
		}
	});
</script>

<div class="relative">
	<div class="px-16 py-4 max-h-screen overflow-y-auto">
		{#if !data.note}
			<div class="flex items-center justify-center h-full">
				<div>No content</div>
			</div>
		{/if}

		<div
			bind:this={editorRef}
			id="editor"
			class={clsx({ hidden: !data.note, 'block': data.note })}
		></div>
	</div>

	<div class="fixed bottom-0 p-3 bg-bg border-t border-bg-border text-text-primary w-full z-10 flex items-center gap-2 min-h-[50px]">
		<button on:click={() => openModal(MODAL_TAG)}><Icon icon="fa-solid:tags" /></button>
		{#if selectedTags.length === 0}
			<button on:click={() => openModal(MODAL_TAG)} class="text-sm">Click to add Tags...</button>
		{:else}
			<div class="flex flex-wrap gap-2">
				{#each selectedTags as tag}
					<button on:click={() => openModal(MODAL_TAG)}>
						<Chip text={tag.name} color={tag.color} />
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<Dialog id={MODAL_TAG}>
	<div class="min-w-[300px]">
		<div>
			<div class="font-bold mb-4 text-text-primary">Tags</div>
		</div>
		<div class="mb-4">
			<TagCombobox
				selectedTags={selectedTags}
				on:selectTag={handleSelectTag}
			/>
		</div>

		<div class="flex justify-end gap-2">
			<Button on:click={handleSaveTags}>Save</Button>
			<Button variant="secondary" on:click={() => closeModal()}>Cancel</Button>
		</div>
	</div>
</Dialog>
