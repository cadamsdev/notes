<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import clsx from 'clsx';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { Tag } from '../interfaces/Tag';
	import { tags as allTags } from '../store';

	export let tags: Tag[] = $allTags.map((tag) => ({ label: tag.name, value: tag.id }));
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
		tags = tags.filter((t) => t.value !== tag.value);
		filteredTags = [...tags];
		showPopup = false;

		dispatch('selectTag', { tags: selectedTags });
	}

	function removeTag(tag: Tag) {
		selectedTags = selectedTags.filter((t) => t.value !== tag.value);
		tags = [...tags, tag];

		dispatch('selectTag', { tags: selectedTags });
	}

	function createTag(tag: Tag) {
		tags = [...tags, tag];
		selectTag(tag);
	}

	function handleRemoveTag(e: Event, tag: Tag) {
		e.stopPropagation();
		removeTag(tag);
	}

	function handleInputChange(e: Event): void {
		const value = (e.target as HTMLInputElement).value;
		const valueToLower = value.toLowerCase();
		searchText = value;
		filteredTags = tags.filter((tag) => !selectedTags.some((st) => st.value === tag.value) && tag.label.toLowerCase().includes(valueToLower));
		hasMatch = tags.findIndex((tag) => tag.label.toLowerCase() === valueToLower) !== -1;

		if (!hasMatch) {
			hasMatch = selectedTags.findIndex((tag) => tag.label.toLowerCase() === valueToLower) !== -1;
		}

		showPopup = (!hasMatch && !!searchText) || !!filteredTags.length;
	}

	onMount(() => {
		filteredTags = [...tags].filter((tag) => !selectedTags.some((st) => st.value === tag.value))

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
		<div class="bg-gray-500 text-white p-1 rounded text-xs flex items-center gap-1">
			<div>{tag.label}</div>
			<button on:click={(e) => handleRemoveTag(e, tag)} class="p-1 hover:bg-red-500 text-white"
				>X</button
			>
		</div>
	{/each}
</div>

<div class="min-w-52 relative">
	<div on:click={handleTogglePopup} class="bg-gray-200 p-2 rounded">
		<div class="flex items-center justify-between">
			<div class="flex-grow">
				<input
					bind:this={inputRef}
					on:input={handleInputChange}
					value={searchText}
					class="p-2 mr-2 rounded bg-gray-200 w-full"
				/>
			</div>
			<div on:click|stopPropagation>
				<button on:click={handleTogglePopup} class="p-2 flex items-center justify-center border-l-2 border-l-gray-400">
					<Icon icon="fa-solid:chevron-down" />
				</button>
			</div>
		</div>
	</div>

	{#if filteredTags.length || (!hasMatch && searchText)}
		<div
			bind:this={popupRef}
			class={clsx('absolute top-full left-0 mt-2 w-full bg-gray-200 p-2', {
				hidden: !showPopup,
				block: showPopup
			})}
		>
			<div class="max-h-[207.95px] overflow-y-scroll">
				{#each filteredTags as tag}
					<button on:click={(e) => handleSelectTag(e, tag)} class="block p-2">
						{tag.label}
					</button>
				{/each}
			</div>

			{#if !hasMatch && searchText}
				<button
					on:click={(e) => handleCreateTag(e, { label: searchText, value: -1 })}
					class="block p-2"
				>
					Create "{searchText}"
				</button>
			{/if}
		</div>
	{/if}
</div>
