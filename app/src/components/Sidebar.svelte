<script lang="ts">
	import Icon from '@iconify/svelte';

	const tags = ['java', 'python', 'c++'];
</script>

<div class="p-6 bg-slate-800">
	<div class="text-white">
		<div class="mb-4 text-sm flex items-center gap-2">
			<Icon icon="fa-solid:tags" />
			Tags
		</div>
		{#each tags as tag}
			<div class="pl-4">
				{tag}<span class="text-gray-400 text-sm">&nbsp;1</span>
			</div>
		{/each}
	</div>
</div>
