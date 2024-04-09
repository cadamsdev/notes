<script lang="ts">
	import Icon from '@iconify/svelte';
	import { deleteTag, fetchAllTags, tags } from '../store';
	import ContextMenu from './ContextMenu.svelte';
	import type { TagRecord } from '../interfaces/TagRecord';

	let contextMenus: ContextMenu[] = [];

	async function load(): Promise<void> {
		await fetchAllTags();
	}

	function handleRemoveTag(tag: TagRecord) {
		deleteTag(tag.id);
	}

	load();

</script>

<div class="p-6 bg-slate-800 min-w-[200px]">
	<div class="text-white">
		<div class="mb-4 text-sm flex items-center gap-2">
			<Icon icon="fa-solid:tags" />
			Tags
		</div>
		{#each $tags as tag, index}
			<button
				class="block pl-4 pb-1"
				on:contextmenu={(e) => contextMenus[index]?.show(e)}
			>
				{tag.name}<span class="text-gray-400 text-sm">&nbsp;{tag.count}</span>

				<ContextMenu
					bind:this={contextMenus[index]}
					actions={[{ label: 'Remove', action: () => handleRemoveTag(tag) }]}
					/>
			</button>
		{/each}
	</div>
</div>
