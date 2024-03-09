<script lang="ts">
	const tags = ['java', 'python', 'c++'];
</script>

<div class="p-6 bg-slate-800">
	<div class="text-white">
		<div class="uppercase mb-4">Tags</div>
		{#each tags as tag}
			<div class="pl-4">
				{tag}<span class="text-gray-400">&nbsp;1</span>
			</div>
		{/each}
	</div>
</div>
