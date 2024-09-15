<script lang="ts">
	import Icon from '@iconify/svelte';
	import {
		fetchTags,
		tags,
		closeModal,
		openModal,
		selectedTags,
		filteredTags
	} from '../store';
	import ContextMenu from './ContextMenu.svelte';
	import Dialog from './Dialog.svelte';
	import { browser } from '$app/environment';
	import ConfirmationDialog from './ConfirmationDialog.svelte';
	import Input from './Input.svelte';
	import Button from './Button.svelte';
	import type { Tag } from '../interfaces/Tag';
	import clsx from 'clsx';
	import ColorDot from './ColorDot.svelte';
	import { MODAL_EDIT_TAG, MODAL_REMOVE_TAG } from '../constants/modal.constants';
	import { TAG_SORT_NAME, TAG_SORT_COUNT } from '../constants/settings.constants';
	import { updateTag } from '$lib/api';

	let currentTag: Tag;
	let selectedColor = '';
	export let tagSort: number;

	const colors = [
		'red',
		'green',
		'blue',
		'purple',
		'yellow',
		'orange',
		'pink',
		'brown',
		'light-gray',
		'dark-gray',
		'none'
	];

	async function load(): Promise<void> {
		await fetchTags();
	}

	async function handleRemoveTag() {
		if (!currentTag) {
			throw new Error('currentTag should be defined.');
		}

		// await deleteTag(currentTag.id);
	}

	async function handleUpdateTag() {
		let newColor = selectedColor || currentTag.color;
		if (selectedColor === 'none') {
			newColor = '';
		}

		await updateTag({
			...currentTag,
			color: newColor
		});

		closeModal();
	}

	function handleShowEditTagModal(tag: Tag) {
		currentTag = tag;
		openModal(MODAL_EDIT_TAG);
	}

	function handleChangeTagName(e: Event) {
		currentTag.name = (e.target as HTMLInputElement).value;
	}

	function handleShowRemoveTagConfirmationModal(tag: Tag) {
		currentTag = tag;
		openModal(MODAL_REMOVE_TAG);
	}

	function handleOnEditTagModalClose() {
		selectedColor = '';
	}

	function selectColor(color: string) {
		selectedColor = color;
	}

	async function toggleSortTags() {
		tagSort = tagSort === TAG_SORT_NAME ? TAG_SORT_COUNT : TAG_SORT_NAME;
		// await updateTagSort(tagSort);
	}

	function selectTag(tag: Tag) {
		selectedTags.update((tags) => {
			const index = tags.findIndex((t) => t.id === tag.id);
			if (index === -1) {
				tags.push(tag);
			}

			return tags;
		});
	}

	load();
</script>

<div class="w-[275px] min-w-[275px] p-6 bg-bg flex flex-col gap-4 text-text-primary border-r border-solid border-bg-border">
	<div class="flex items-center justify-between gap-2 text-text-primary-emphasis text-sm">
		<div class="flex items-center gap-2">
			<Icon icon="fa-solid:tags" />
			Tags
		</div>
		<button on:click={toggleSortTags}>
			{#if tagSort === TAG_SORT_COUNT}
				<Icon icon="mingcute:numbers-90-sort-descending-line" width="24" height="24" />
			{/if}
			{#if tagSort === TAG_SORT_NAME}
				<Icon icon="mingcute:az-sort-ascending-letters-line" width="24" height="24" />
			{/if}
		</button>
	</div>
	<div class="flex-grow overflow-y-auto pl-1">
		{#each $filteredTags as tag}
			{#if tag.count ?? 0 > 0}
				<button id={`tag-${tag.id}`} class="flex items-center gap-2 py-1 px-2 hover:text-text-primary-hover" on:click={() => selectTag(tag)}>
					<ColorDot color={tag.color} />
					<div class="flex items-center gap-[2px]">
						<span class="text-base">{tag.name}</span>
						<span class="text-text-primary text-sm">&nbsp;{tag.count}</span>
					</div>
					<ContextMenu
						targetId={`tag-${tag.id}`}
						actions={[
							{
								label: 'Edit',
								action: () => handleShowEditTagModal(tag)
							},
							{
								label: 'Remove',
								action: () => handleShowRemoveTagConfirmationModal(tag)
							}
						]}
					/>
				</button>
			{/if}
		{/each}
	</div>
</div>

<Dialog id={MODAL_EDIT_TAG} on:closeModal={handleOnEditTagModalClose}>
	<div>
		<label for="tag-name" class="block text-base font-bold mb-6">
			<div class="mb-2">Name:</div>
			<Input
				id="tag-name"
				name="name"
				placeholder="Enter tag name"
				value={currentTag?.name}
				on:input={handleChangeTagName}
			/>
		</label>

		<div class="mb-2">Colors</div>
		<div class="grid gap-4 mb-6 grid-cols-3">
			{#each colors as color}
				<div>
					<button on:click={() => selectColor(color)} class="flex items-center gap-2 p-0">
						<div
							class={clsx(
								'w-6 h-6 rounded-full',
								{
									'bg-tag-red': color === 'red',
									'bg-tag-green': color === 'green',
									'bg-tag-blue': color === 'blue',
									'bg-tag-purple': color === 'purple',
									'bg-tag-yellow': color === 'yellow',
									'bg-tag-orange': color === 'orange',
									'bg-tag-pink': color === 'pink',
									'bg-tag-brown': color === 'brown',
									'bg-tag-light-gray': color === 'light-gray',
									'bg-tag-dark-gray': color === 'dark-gray',
									'bg-bg-on-secondary': !color,
								},
								{
									'outline outline-2 outline-primary outline-offset-4':
										selectedColor === color ||
										(!selectedColor && currentTag.color === color) ||
										(!selectedColor && !currentTag.color && color === 'none')
								}
							)}
						></div>
						<div class="color-label">{color}</div>
					</button>
				</div>
			{/each}
		</div>

		<div class="flex justify-end gap-2">
			<Button on:click={async () => await handleUpdateTag()}>Save</Button>
			<Button variant="secondary" on:click={() => closeModal()}>Cancel</Button>
		</div>
	</div>
</Dialog>

<ConfirmationDialog id={MODAL_REMOVE_TAG} on:action={async () => await handleRemoveTag()} />
