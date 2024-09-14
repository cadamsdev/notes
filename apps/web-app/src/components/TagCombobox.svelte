<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import clsx from 'clsx';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { Tag } from '../interfaces/Tag';
	import { tags as allTags } from '../store';
	import Chip from './Chip.svelte';

	export let tags: Tag[] = $allTags;
	export let selectedTags: Tag[] = [];

	let showPopup = false;
	let popupRef: HTMLDivElement;
	let inputRef: HTMLInputElement;
	let searchText = '';
	let filteredTags: Tag[] = [];
	let hasMatch = false;

	const dispatch = createEventDispatcher();

	function handleClickOutside(event: any) {
		if (popupRef?.contains(event.target)) {
			return;
		} else if (!inputRef?.contains(event.target)) {
			showPopup = false;
		}
	}

	function handleTogglePopup(event: Event) {
		if (event.target === inputRef) {
			showPopup = true;
			return;
		}

		showPopup = !showPopup;
	}

	function handleSelectTag(e: Event, tag: Tag) {
		selectTag(tag);
	}

	function handleCreateTag(e: Event, tag: Tag) {
		createTag(tag);
	}

	function selectTag(tag: Tag) {
		if (selectedTags.includes(tag)) {
			return;
		}

		searchText = '';
		selectedTags = [...selectedTags, tag];
		tags = tags.filter((t) => t.id !== tag.id);
		filteredTags = [...tags];
		showPopup = false;

		dispatch('selectTag', { tags: selectedTags });
	}

	function removeTag(tag: Tag) {
		selectedTags = selectedTags.filter((t) => t.id !== tag.id);
		tags = [...tags, tag];

		dispatch('selectTag', { tags: selectedTags });
	}

	function createTag(tag: Tag) {
		tags = [...tags, tag];
		selectTag(tag);
	}

	function handleRemoveTag(tag: Tag) {
		removeTag(tag);
	}

	function handleInputChange(e: Event): void {
		const value = (e.target as HTMLInputElement).value;
		const valueToLower = value.toLowerCase();
		searchText = value;
		filteredTags = tags.filter((tag) => !selectedTags.some((st) => st.id === tag.id) && tag.name.toLowerCase().includes(valueToLower));
		hasMatch = tags.findIndex((tag) => tag.name.toLowerCase() === valueToLower) !== -1;

		if (!hasMatch) {
			hasMatch = selectedTags.findIndex((tag) => tag.name.toLowerCase() === valueToLower) !== -1;
		}

		showPopup = (!hasMatch && !!searchText) || !!filteredTags.length;
	}

	function handleKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter') {
			showPopup = !showPopup;
		}
	}

	onMount(() => {
		filteredTags = [...tags].filter((tag) => !selectedTags.some((st) => st.id === tag.id));

		if (browser) {
			inputRef.focus();
			window.addEventListener('click', handleClickOutside);
		}
	});

	onDestroy(() => {
		if (browser) {
			window.removeEventListener('click', handleClickOutside);
		}
	});
</script>

<div class="flex flex-wrap gap-1 mb-4">
	{#each selectedTags as tag}
		<Chip text={tag.name} color={tag.color} hasCloseBtn on:close={() => handleRemoveTag(tag)} />
	{/each}
</div>

<div class="relative min-w-[13rem]">
	<div on:click={handleTogglePopup} class="flex items-center justify-between bg-bg rounded p-2 border border-bg-border">
		<input
			bind:this={inputRef}
			on:input={handleInputChange}
			on:keydown={handleKeyDown}
			value={searchText}
			class="flex-grow mr-2 bg-bg text-text-primary outline-none"
		/>
		<div on:click|stopPropagation>
			<button on:click={handleTogglePopup} class="p-2 flex items-center justify-center text-text-primary" tabindex="-1">
				<Icon icon="fa-solid:chevron-down" />
			</button>
		</div>
	</div>

	{#if filteredTags.length || (!hasMatch && searchText)}
		<div
			bind:this={popupRef}
			class={clsx('absolute top-full left-0 mt-2 w-full bg-bg-secondary text-text-secondary', {
				'hidden': !showPopup,
				'block': showPopup
			})}
		>
			<div class="max-h-[12.9375rem] overflow-y-auto p-1">
				{#each filteredTags as tag}
					<button on:click={(e) => handleSelectTag(e, tag)} class="block w-full text-left p-3 text-text-secondary hover:bg-bg-secondary-hover">
						{tag.name}
					</button>
				{/each}
			</div>

			{#if !hasMatch && searchText}
				<button
					on:click={(e) => handleCreateTag(e, { name: searchText, id: -1 })}
					class="block w-full text-left p-3"
				>
					Create "{searchText}"
				</button>
			{/if}
		</div>
	{/if}
</div>
