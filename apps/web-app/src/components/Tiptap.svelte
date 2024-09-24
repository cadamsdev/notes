<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import { Editor, type JSONContent } from '@tiptap/core';
	import StarterKit from '@tiptap/starter-kit';
	import { notes, type Note } from '../store';
	import { updateNote } from '$lib/api';

	export let note: Note;

	let element: HTMLElement;
	let editor: Editor;

	async function save() {
		if (!note) {
			console.error('Invalid note');
			return;
		}

		const outputData = editor.getJSON();
		const title = getTitle(outputData);

		const outputString = JSON.stringify(outputData);
		const updatedNote: Note = {
			id: note.id,
			title,
			content: outputString ?? ''
		};

		const response = await updateNote(updatedNote);

		if (!response.ok) {
			console.error('failed to save');
			return;
		}

		console.log('saved!');
		notes.update((items) => {
			const index = items.findIndex((item) => item.id === note.id);
			const item = items[index];
			item.title = updatedNote.title;
			item.content = updatedNote.content;
			return items;
		});
	}

	function getTitle(content: JSONContent) {
		if (content?.content?.length) {
			return getTitle(content.content[0]);
		}

		if (content.text) {
			return content.text;
		}

		return 'New note';
	}

	onMount(() => {
		if (note?.content) {
		console.log(JSON.parse(note.content))
		}

		editor = new Editor({
			element: element,
			extensions: [StarterKit],
			content: note?.content ? JSON.parse(note.content) : 'Hello world!',
			onTransaction: () => {
				console.log('on transaction')
				// force re-render so `editor.isActive` works as expected
				editor = editor;
			},
			onUpdate: async () => {
				await save();	
			}
		});
	});

	onDestroy(() => {
		if (editor) {
			editor.destroy();
		}
	});
</script>

{#if editor}
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
		class:active={editor.isActive('heading', { level: 1 })}
	>
		H1
	</button>
	<button
		on:click={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
		class:active={editor.isActive('heading', { level: 2 })}
	>
		H2
	</button>
	<button
		on:click={() => editor.chain().focus().setParagraph().run()}
		class:active={editor.isActive('paragraph')}
	>
		P
	</button>
{/if}

<div bind:this={element} />

<style>
	button.active {
		background: black;
		color: white;
	}
</style>
