<script lang="ts">
	import clsx from 'clsx';
	import { onDestroy, onMount } from 'svelte';
	import { notes, selectedNote, type Note, fetchTags, fetchNotes } from '../../../store';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';
	import { get } from 'svelte/store';
	import Icon from '@iconify/svelte';
	import TagCombobox from '../../../components/TagCombobox.svelte';
	import type { Tag } from '../../../interfaces/Tag';
	import Dialog from '../../../components/Dialog.svelte';
	import Button from '../../../components/Button.svelte';
	import Chip from '../../../components/Chip.svelte';

	export let data: PageData;

	let editorRef: any = null;
	let editor: EditorJS.default;
	let timer: any;
	let showTagModal = false;
	let tempTags: Tag[] = [];
	let selectedTags: Tag[] = [...data.tags];

	const unsubscribe = selectedNote.subscribe((note) => {
		if (!note) {
			return;
		}

		selectedTags = [...(note.tags ?? [])];

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

	async function save() {
		const outputData = await editor.save();
			let title: string | undefined;
			if (outputData.blocks.length > 0) {
				title = outputData.blocks[0].data?.['text'];
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
				if (updatedNote.content) {
					formData.append('content', updatedNote.content);
				}

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

				showTagModal = false;
			}
		} catch (err) {
			console.error(err);
			console.error('Failed to save tags');
		}
	}

	onMount(async () => {
		// const Header: any = (await import('@editorjs/header')).default;
		//@ts-ignore
		const Code: any = (await import('@editorjs/code')).default;
		//@ts-ignore
		const InlineCode: any = (await import('@editorjs/inline-code')).default;
		const EditorJS = await import('@editorjs/editorjs');
		const { H1, H2, H3 }  = await import('../../../lib/editorjs/plugins/Heading');
		const { BulletedList, NumberedList } = await import('../../../lib/editorjs/plugins/List')

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
				h1: H1,
				h2: H2,
				h3: H3,
				code: { class: Code },
				inlineCode: { class: InlineCode, inlineToolbar: true },
				ul: BulletedList,
				ol: NumberedList,
			},
			data,
			onChange: async () => {
				await save();
			}
		});



	});

	function openTagModal() {
		showTagModal = true;
	}

	onDestroy(() => {
		unsubscribe();
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
		<button on:click={openTagModal}><Icon icon="fa-solid:tags" /></button>
		{#if selectedTags.length === 0}
			<button on:click={openTagModal} class="new-tag-label">Click to add Tags...</button>
		{:else}
			<div class="tags-container">
				{#each selectedTags as tag}
					<button on:click={openTagModal}>
						<Chip text={tag.name} />
					</button>
				{/each}
			</div>
		{/if}
	</div>
</div>

<Dialog bind:showModal={showTagModal} on:closeModal={() => (showTagModal = false)}>
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
			<Button variant="secondary" on:click={() => (showTagModal = false)}>Cancel</Button>
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
