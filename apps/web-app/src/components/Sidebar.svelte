<script lang="ts">
	import Icon from '@iconify/svelte';
	import { deleteTag, updateTag, fetchTags, tags } from '../store';
	import ContextMenu from './ContextMenu.svelte';
	import type { TagRecord } from '../interfaces/TagRecord';
	import Dialog from './Dialog.svelte';
	import { browser } from '$app/environment';
	import ConfirmationDialog from './ConfirmationDialog.svelte';
	import Input from './Input.svelte';

	let showRenameModal = false;
	let currentTag: TagRecord;
	let showRemoveTagConfirmationModal = false;

	async function load(): Promise<void> {
		await fetchTags();
	}

	async function handleRemoveTag() {
		if (!currentTag) {
			throw new Error('currentTag should be defined.');
		}

		await deleteTag(currentTag.id);
	}

	async function handleRenameTag() {
		if (browser) {
			await updateTag(currentTag);
		}
		showRenameModal = false;
	}

	function handleShowRenameTagModal(tag: TagRecord) {
		showRenameModal = true;
		currentTag = tag;
	}

	function handleChangeTagName(e: Event) {
		currentTag.name = (e.target as HTMLInputElement).value;
	}

	function handleShowRemoveTagConfirmationModal(tag: TagRecord) {
		currentTag = tag;
		showRemoveTagConfirmationModal = true;
	}

	load();
</script>

<div class="p-6 bg-bg min-w-[200px] border-r border-bg-secondary">
	<div class="text-text-secondary">
		<div class="mb-4 text-sm flex items-center gap-2">
			<Icon icon="fa-solid:tags" />
			Tags
		</div>
		{#each $tags as tag}
			{#if (tag.count ?? 0) > 0}
				<button id={`tag-${tag.id}`} class="block pl-4 pb-1">
					<span class="text-text-secondary hover:text-text-secondary-hover">#{tag.name}</span><span
						class="text-text-secondary text-sm">&nbsp;{tag.count}</span
					>

					<ContextMenu
						targetId={`tag-${tag.id}`}
						actions={[
							{ label: 'Rename', action: () => handleShowRenameTagModal(tag) },
							{ label: 'Remove', action: () => handleShowRemoveTagConfirmationModal(tag) }
						]}
					/>
				</button>
			{/if}
		{/each}
	</div>
</div>

<Dialog showModal={showRenameModal} on:closeModal={() => (showRenameModal = false)}>
	<div>
		<div class="mb-4">
			<label for="tag-name" class="font-bold"> Name: </label>

			<Input
				id="tag-name"
				name="name"
				placeholder="Enter tag name"
				value={currentTag?.name}
				on:input={handleChangeTagName}
			/>
		</div>

		<div class="flex justify-end">
			<button
				on:click={async () => await handleRenameTag()}
				class="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Save</button
			>
		</div>
	</div>
</Dialog>

<ConfirmationDialog
	showModal={showRemoveTagConfirmationModal}
	on:closeModal={() => showRemoveTagConfirmationModal = false}
	on:action={async () => await handleRemoveTag()}
/>


