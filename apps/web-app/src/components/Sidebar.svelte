<script lang="ts">
	import Icon from '@iconify/svelte';
	import { deleteTag, updateTag, fetchTags, tags } from '../store';
	import ContextMenu from './ContextMenu.svelte';
	import Dialog from './Dialog.svelte';
	import { browser } from '$app/environment';
	import ConfirmationDialog from './ConfirmationDialog.svelte';
	import Input from './Input.svelte';
	import Button from './Button.svelte';
	import type { Tag } from '../interfaces/Tag';

	let showRenameModal = false;
	let currentTag: Tag;
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

	function handleShowRenameTagModal(tag: Tag) {
		showRenameModal = true;
		currentTag = tag;
	}

	function handleChangeTagName(e: Event) {
		currentTag.name = (e.target as HTMLInputElement).value;
	}

	function handleShowRemoveTagConfirmationModal(tag: Tag) {
		currentTag = tag;
		showRemoveTagConfirmationModal = true;
	}

	load();
</script>

<div class="sidebar">
		<div class="tag-heading-container">
			<Icon icon="fa-solid:tags" />
			Tags
		</div>
		<div class="scroll-container">
			{#each $tags as tag}
				{#if (tag.count ?? 0) > 0}
					<button id={`tag-${tag.id}`} class="tag">
						<span class="tag-name">#{tag.name}</span><span
							class="tag-count">&nbsp;{tag.count}</span
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
		<label for="tag-name" class="label">
				<div class="label-text">Name:</div>
			<Input
				id="tag-name"
				name="name"
				placeholder="Enter tag name"
				value={currentTag?.name}
				on:input={handleChangeTagName}
			/>
		</label>

		<div class="dialog-footer">
			<Button on:click={async () => await handleRenameTag()}>Save</Button>
			<Button variant="secondary" on:click={() => showRenameModal = false}>Cancel</Button>
		</div>
	</div>
</Dialog>

<ConfirmationDialog
	showModal={showRemoveTagConfirmationModal}
	on:closeModal={() => showRemoveTagConfirmationModal = false}
	on:action={async () => await handleRemoveTag()}
/>

<style>
	.scroll-container {
		flex-grow: 1;
    overflow-y: auto;
	}

	.sidebar {
		padding: 2.4rem;
		background: var(--clr-bg);
		min-width: 20rem;
		border-right: 0.1rem solid var(--clr-bg-border);
		color: var(--clr-text-primary);
		display: flex;
		flex-direction: column;
		gap: 1.6rem;
	}

	.tag-heading-container {
		font-size: 1.4rem;
		display: flex;
		align-items: center;
		gap: 0.8rem;
		color: var(--clr-text-primary-emphasis);
	}

	.tag {
		display: block;
		padding: 0.4rem 0.8rem;
	}

	.tag:hover {
		color: var(--clr-text-primary-hover);
	}

	.tag-name {
		font-size: 1.6rem;
	}

	.tag-count {
		color: var(--clr-text-primary);
		font-size: 1.4rem;
	}

	.label {
		display: block;
		font-size: 1.6rem;
		font-weight: 700;
		margin-bottom: 2.4rem;
	}

	.label-text {
		margin-bottom: 0.8rem;
	}

	.dialog-footer {
		display: flex;
		justify-content: end;
		gap: 0.8rem;
	}
</style>


