<script lang="ts">
	import clsx from 'clsx';
	import { onDestroy, onMount } from 'svelte';
	import { notes, selectedNote, type Note, fetchTags, fetchNotes, openModal, closeModal } from '../../../store';
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

	export let data: PageData;

	let editorRef: any = null;
	let editor: EditorJS.default;
	let tempTags: Tag[] = [];
	let selectedTags: Tag[] = [...data.tags];
	let subscriptions: Unsubscriber[] = [];

	subscriptions.push(
		page.subscribe(() => {
			if (browser) {
				setupEditor();
			}
		}),
	);

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

			if (browser) {
				const id = +data.id;
				const updatedNote: Note = {
					id,
					title: title || 'New note',
					content: outputString
				};

				const formData = new FormData();
				formData.append('id', updatedNote.id.toString());
				formData.append('title', updatedNote.title);
				formData.append('content', updatedNote.content ?? '');

				const result = await fetch(`/note/${id}?/updateNote`, {
					method: 'POST',
					body: formData
				});

				console.log('saved!', result);
				notes.update((items) => {
					const index = items.findIndex((item) => item.id === id);
					const item = items[index];
					item.title = updatedNote.title;
					item.content = updatedNote.content;
					return items;
				});
			}
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
		const formData = new FormData();
		formData.append('noteId', note.id.toString());
		formData.append('tags', JSON.stringify(selectedTags));

		try {
			const result = await fetch(`/note/${note.id}?/saveTags`, {
				method: 'POST',
				body: formData,
			});

			if (result.ok) {
				const [_, notes] = await Promise.all([fetchTags(), fetchNotes()]);

				const currentNote = notes.find((n) => n.id === note.id);
				selectedNote.set(currentNote);

				closeModal();
			}
		} catch (err) {
			console.error(err);
			console.error('Failed to save tags');
		}
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

	onMount(async () => {	
		if (browser) {
			window.addEventListener('editor-save', handleSave);
		}
	});

	async function handleSave() {
		await save();
	}

	onDestroy(() => {
		subscriptions.forEach((unsub) => unsub());
		subscriptions = [];

		if (browser) {
			window.removeEventListener('editor-save', handleSave);
		}
	});
</script>

<div class="page">
	<div class="page-content">
		{#if !$selectedNote}
			<div class="flex items-center justify-center h-full">
				<div>No content</div>
			</div>
		{/if}

		<div
			bind:this={editorRef}
			id="editor"
			class={clsx({ hidden: !$selectedNote})}
		></div>
	</div>

	<div class="bottom-bar">
		<button on:click={() => openModal(MODAL_TAG)}><Icon icon="fa-solid:tags" /></button>
		{#if selectedTags.length === 0}
			<button on:click={() => openModal(MODAL_TAG)} class="new-tag-label">Click to add Tags...</button>
		{:else}
			<div class="tags-container">
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
	<div class="dialog-content">
		<div>
			<div class="dialog-heading">Tags</div>
		</div>
		<div class="dialog-tag-combobox-container">
			<TagCombobox
				selectedTags={selectedTags}
				on:selectTag={handleSelectTag}
			/>
		</div>

		<div class="dialog-footer">
			<Button on:click={handleSaveTags}>Save</Button>
			<Button variant="secondary" on:click={() => closeModal()}>Cancel</Button>
		</div>
	</div>
</Dialog>

<style>
	.dialog-content {
		min-width: 30rem;
	}

	.page {
		position: relative;
	}

	.page-content {
		padding: 1.6rem 6.4rem;
		max-height: 100vh;
		overflow-y: auto;
	}

	.bottom-bar {
		position: fixed;
		bottom: 0;
		padding: 1.2rem;
		background: var(--clr-bg);
		border-top: 0.1rem solid var(--clr-bg-border);
		color: var(--clr-text-primary);
		width: 100%;
		z-index: 10;
		display: flex;
		align-items: center;
		gap: 0.8rem;
		min-height: 50px;

	}

	.dialog-heading {
		font-weight: 700;
		margin-bottom: 1.6rem;
		color: var(--clr-text-primary);
	}

	.dialog-footer {
		display: flex;
		justify-content: flex-end;
		gap: 0.8rem;

	}
	
	.dialog-tag-combobox-container {
		margin-bottom: 1.6rem;
	}

	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.8rem;
	}

	.new-tag-label {
		font-size: 1.4rem;
	}
</style>
