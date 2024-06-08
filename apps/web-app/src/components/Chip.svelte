<script lang="ts">
	import clsx from "clsx";
	import { createEventDispatcher } from "svelte";

  export let text: string;
	export let color = '';
	export let hasCloseBtn = false;

	const dispatch = createEventDispatcher();
</script>

<div class={clsx("chip", { [`${color}`]: true })}>
 <div>#{text}</div>
	{#if hasCloseBtn}
		<button on:click={() => dispatch('close')} class="close-btn">X</button>
	{/if}
</div>

<style>
  .chip {
		display: flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.2rem 0.4rem;
		font-size: 1.2rem;
		background: var(--clr-bg-on-secondary);
		color: var(--clr-text-secondary);
		border-radius: 0.2rem;
	}

	.close-btn {
		padding: 0.4rem;
	}

	.red {
		background: var(--clr-tag-red);
		color: var(--clr-tag-red-text);
	}

	.green {
		background: var(--clr-tag-green);
		color: var(--clr-tag-green-text);
	}

	.blue {
		background: var(--clr-tag-blue);
		color: var(--clr-tag-blue-text);
	}	

	.purple {
		background: var(--clr-tag-purple);
		color: var(--clr-tag-purple-text);
	}

	.yellow {
		background: var(--clr-tag-yellow);
		color: var(--clr-tag-yellow-text);
	}

	.orange {
		background: var(--clr-tag-orange);
		color: var(--clr-tag-orange-text);
	}

	.pink {
		background: var(--clr-tag-pink);
		color: var(--clr-tag-pink-text);
	}

	.brown {
		background: var(--clr-tag-brown);
		color: var(--clr-tag-brown-text);
	}

	.light-gray {
		background: var(--clr-tag-light-gray);
		color: var(--clr-tag-light-gray-text);
	}

	.dark-gray {
		background: var(--clr-tag-dark-gray);
		color: var(--clr-tag-dark-gray-text);
	}
</style>
