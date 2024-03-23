<script lang="ts">
	import Icon from '@iconify/svelte';
	import { fetchAllTags, tags } from '../store';

	async function load(): Promise<void> {
		await fetchAllTags();
	}

	load();

</script>

<div class="p-6 bg-slate-800">
	<div class="text-white">
		<div class="mb-4 text-sm flex items-center gap-2">
			<Icon icon="fa-solid:tags" />
			Tags
		</div>
		{#each $tags as tag}
			<div class="pl-4">
				{tag.name}<span class="text-gray-400 text-sm">&nbsp;{tag.id}</span>
			</div>
		{/each}
	</div>
</div>
