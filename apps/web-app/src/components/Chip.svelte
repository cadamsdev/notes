<script lang="ts">
	import Icon from '@iconify/svelte';
	import clsx from 'clsx';
	import { createEventDispatcher } from 'svelte';

	let { text, color = '', hasCloseBtn = false  }: { text: string, color?: string, hasCloseBtn?: boolean } = $props();

	const dispatch = createEventDispatcher();
</script>

<div
	class="chip inline-flex items-center gap-1 py-[0.125rem] px-1 rounded-sm bg-bg-on-secondary text-tag-default-text text-xs"
>
	{#if color}
		<div
			class={clsx(
				{ 'w-3 h-3 rounded-[0.625rem]': true },
				{
					'bg-tag-red': color === 'red',
					'bg-tag-green': color === 'green',
					'bg-tag-blue': color === 'blue',
					'bg-tag-purple': color === 'purple',
					'bg-tag-yellow': color === 'yellow',
					'bg-tag-orange': color === 'orange',
					'bg-tag-pink': color === 'pink',
					'bg-tag-brown': color === 'brown',
					'bg-tag-light-gray': color === 'light-gray',
					'bg-tag-dark-gray': color === 'dark-gray'
				}
			)}
		></div>
	{/if}
	<div>{text}</div>
	{#if hasCloseBtn}
		<button onclick={() => dispatch('close')} class="p-1">
			<Icon icon="fa-solid:times" width="12" height="12" />
		</button>
	{/if}
</div>
