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
	import clsx from 'clsx';

	let showEditTagModal = false;
	let currentTag: Tag;
	let showRemoveTagConfirmationModal = false;
	let selectedColor = '';

	const colors = ['red', 'green', 'blue', 'purple', 'yellow', 'orange', 'pink', 'brown', 'light-gray', 'dark-gray'];

	async function load(): Promise<void> {
		await fetchTags();
	}

	async function handleRemoveTag() {
		if (!currentTag) {
			throw new Error('currentTag should be defined.');
		}

		await deleteTag(currentTag.id);
	}

	async function handleUpdateTag() {
		if (browser) {
			await updateTag({
				...currentTag,
				color: selectedColor
			});
		}
		showEditTagModal = false;
	}

	function handleShowEditTagModal(tag: Tag) {
		showEditTagModal = true;
		currentTag = tag;
	}

	function handleChangeTagName(e: Event) {
		currentTag.name = (e.target as HTMLInputElement).value;
	}

	function handleShowRemoveTagConfirmationModal(tag: Tag) {
		currentTag = tag;
		showRemoveTagConfirmationModal = true;
	}

	function closeEditTagModal() {
		showEditTagModal = false;
	}

	function selectColor(color: string) {
		selectedColor = color;
		console.log(color)
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
								{ label: 'Edit', action: () => handleShowEditTagModal(tag) },
								{ label: 'Remove', action: () => handleShowRemoveTagConfirmationModal(tag) }
							]}
						/>
					</button>
				{/if}
			{/each}
		</div>
</div>

<Dialog showModal={showEditTagModal} on:closeModal={closeEditTagModal}>
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


		<div class="color-section-title">Colors {selectedColor}</div>
		<div class="color-grid">
			{#each colors as color}
				<div>
					<button
						on:click={() => selectColor(color)}
						class="color-btn"
						class:active={currentTag.color === selectedColor || currentTag.color === color}
					>
						<div class={clsx('color', {[`${color}`]: true})}></div>
						<div class="color-label">{color}</div>
					</button>
				</div>
			{/each}
		</div>

		<div class="dialog-footer">
			<Button on:click={async () => await handleUpdateTag()}>Save</Button>
			<Button variant="secondary" on:click={() => showEditTagModal = false}>Cancel</Button>
		</div>
	</div>
</Dialog>

<ConfirmationDialog
	showModal={showRemoveTagConfirmationModal}
	on:closeModal={() => showRemoveTagConfirmationModal = false}
	on:action={async () => await handleRemoveTag()}
/>

<style>
	.color-section-title {
		margin-bottom: 0.8rem;
	
	}

	.color-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 1.6rem;
		margin-bottom: 2.4rem;
	}

	.color-btn {
		display: flex;
		align-items: center;
		gap: 0.8rem;
		padding: 0;
	}

	.color {
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 100rem;
	}

	.color-btn.active {
		outline: 0.2rem solid var(--clr-primary);
		outline-offset: 0.4rem;
	}

	.color.red {
		background: var(--clr-tag-red);
	}

	.color.green {
		background: var(--clr-tag-green);
	}

	.color.blue {
		background: var(--clr-tag-blue);
	}	

	.color.purple {
		background: var(--clr-tag-purple);
	}

	.color.yellow {
		background: var(--clr-tag-yellow);
	}

	.color.orange {
		background: var(--clr-tag-orange);
	}

	.color.pink {
		background: var(--clr-tag-pink);
	}

	.color.brown {
		background: var(--clr-tag-brown);
	}

	.color.light-gray {
		background: var(--clr-tag-light-gray);
	}

	.color.dark-gray {
		background: var(--clr-tag-dark-gray);
	}

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


