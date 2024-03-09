<script lang="ts">
	const tags = ['java', 'python', 'c++'];

	async function createNote(): Promise<void> {
    const lastID = await window.electron.createNote('A title', 'A note');
    console.log(lastID);  
	}
</script>

<div class="p-6 bg-slate-800">
	<button on:click={createNote} class="bg-slate-200 hover:bg-slate-300 p-2 rounded mb-4"
		>+ Create note</button
	>

	<div class="text-white">
		<div class="uppercase mb-4">Tags</div>
		{#each tags as tag}
			<div class="pl-4">
				{tag}<span class="text-gray-400">&nbsp;1</span>
			</div>
		{/each}
	</div>
</div>
