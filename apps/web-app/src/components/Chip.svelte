<script lang="ts">
	import Icon from "@iconify/svelte";
	import clsx from "clsx";
	import { createEventDispatcher } from "svelte";

  export let text: string;
	export let color = '';
	export let hasCloseBtn = false;

	const dispatch = createEventDispatcher();
</script>

<div class="chip">
	{#if color}
		<div class={clsx({ "color": true }, { [`${color}`]: true })}></div>
	{/if}
	<div>{text}</div>
	{#if hasCloseBtn}
		<button on:click={() => dispatch('close')} class="close-btn">
			<Icon icon="fa-solid:times" width="12" height="12" />
		</button>
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
		color: var(--clr-tag-default-text);
		border-radius: 0.2rem;
	}

	.close-btn {
		padding: 0.4rem;
	}

	.color {
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 10rem;
	}

	.red {
		background: var(--clr-tag-red);
	}

	.green {
		background: var(--clr-tag-green);
	}

	.blue {
		background: var(--clr-tag-blue);
	}	

	.purple {
		background: var(--clr-tag-purple);
	}

	.yellow {
		background: var(--clr-tag-yellow);
	}

	.orange {
		background: var(--clr-tag-orange);
	}

	.pink {
		background: var(--clr-tag-pink);
	}

	.brown {
		background: var(--clr-tag-brown);
	}

	.light-gray {
		background: var(--clr-tag-light-gray);
	}

	.dark-gray {
		background: var(--clr-tag-dark-gray);
	}
</style>
