<script lang="ts">
	import clsx from 'clsx';
	import { onDestroy, onMount } from 'svelte';
	import { notes, selectedNote } from '../../../store';
	import { browser } from '$app/environment';
	import type { PageData } from './$types';

	let editorRef: any = null;
  let editor: EditorJS.default;
  let timer: any;
  export let data: PageData;

  const unsubscribe = selectedNote.subscribe((note) => {
    if (!note) {
      return;
    }
    const noteData = JSON.parse(note.content);
    editor?.render(noteData);
  });

  function onInputChange(): void {
    clearTimeout(timer);

    timer = setTimeout(async () => {
      const outputData = await editor.save();
      const outputString = JSON.stringify(outputData);
      
      if (browser) {
        const id = +data.id;
        const result = await window.electron.updateNote(id, outputString);
        console.log('saved!', result);
				notes.update((items) => {
					const index = items.findIndex((item) => item.id === id);
					items[index].content = outputString;
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
			}
		});

    if (browser) {
      window.addEventListener('input', onInputChange);
    }
	});

  onDestroy(() => {
    if (browser) {
      window.removeEventListener('input', onInputChange);
    }
    unsubscribe();
  });
</script>

{#if !$selectedNote}
	<div class="flex items-center justify-center h-full">
		<div>No content</div>
	</div>
{/if}

<div bind:this={editorRef} id="editor" class={clsx({ hidden: !$selectedNote })}></div>
