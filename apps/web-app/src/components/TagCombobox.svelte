<script lang="ts">
	import { browser } from '$app/environment';
	import Icon from '@iconify/svelte';
	import clsx from 'clsx';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import type { Tag } from '../interfaces/Tag';
	import { tags as allTags } from '../store';

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

	function handleRemoveTag(e: Event, tag: Tag) {
		e.stopPropagation();
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

<div class="tags-container">
	{#each selectedTags as tag}
		<div class="tag">
			<div>{tag.name}</div>
			<button on:click={(e) => handleRemoveTag(e, tag)} class="close-btn"
				>X</button
			>
		</div>
	{/each}
</div>

<div class="search-container">
	<div on:click={handleTogglePopup} class="popup-trigger">
		<input
			bind:this={inputRef}
			on:input={handleInputChange}
			value={searchText}
			class="search-input"
		/>
		<div on:click|stopPropagation>
			<button on:click={handleTogglePopup} class="action-button">
				<Icon icon="fa-solid:chevron-down" />
			</button>
		</div>
	</div>

	{#if filteredTags.length || (!hasMatch && searchText)}
		<div
			bind:this={popupRef}
			class={clsx('popup', {
				hidden: !showPopup,
				block: showPopup
			})}
		>
			<div class="tag-list">
				{#each filteredTags as tag}
					<button on:click={(e) => handleSelectTag(e, tag)} class="tag-button">
						{tag.name}
					</button>
				{/each}
			</div>

			{#if !hasMatch && searchText}
				<button
					on:click={(e) => handleCreateTag(e, { name: searchText, id: -1 })}
					class="create-tag-btn"
				>
					Create "{searchText}"
				</button>
			{/if}
		</div>
	{/if}
</div>

<style>
	.tags-container {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
		margin-bottom: 1.6rem;
	}

	.popup-trigger {
		background: var(--clr-bg);
		border-radius: 0.4rem;
		padding: 0.8rem;
		border: 0.1rem solid var(--clr-bg-secondary);
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.tag {
		background: var(--clr-bg-on-secondary);
		color: var(--clr-text-secondary);
		padding: 0.2rem 0.4rem;
		border-radius: 0.4rem;
		display: flex;
		align-items: center;
		gap: 0.4rem;
		font-size: 1.2rem;
	}

	.tag .close-btn {
		padding: 0.4rem;
	}

	.search-container {
		min-width: 20.8rem;
		position: relative;
	}

	.search-input-container {
		flex-grow: 1;
	}

	.search-input {
		padding: 0.8rem;
		margin-right: 0.8rem;
		border-radius: 0.4rem;
		background: var(--clr-bg);
		outline: 0.2rem solid transparent;
		width: 100%;
		color: var(--clr-text-secondary);
	}

	input::placeholder {
		color: var(--clr-text-secondary);
	}

	.action-button {
		padding: 0.8rem;
		display: flex;
		align-items: center;
		justify-content: center;
		color: var(--clr-text-secondary);
	}

	.popup {
		position: absolute;
		top: 100%;
		left: 0;
		margin-top: 0.8rem;
		width: 100%;
		background: var(--clr-bg-secondary);
		color: var(--clr-text-secondary);
	}

	.popup .tag-list {
		max-height: 20.7rem;
		overflow-y: auto;
	}

	.create-tag-btn {
		display: block;
		padding: 0.8rem;
	}

	.tag-button {
		display: block;
		padding: 0.8rem;
		width: 100%;
		text-align: left;
		color: var(--clr-text-secondary);
	}

	.tag-button:hover {
		background: var(--clr-bg-secondary-hover);
	}
</style>
