<script lang="ts">
	import clsx from 'clsx';

  //@ts-ignore
	export type ButtonType = 'primary' | 'secondary';
	export let variant: ButtonType = 'primary';
</script>

<button
	on:click
	class={clsx({
		'secondary': variant === 'secondary'
	})}
	{...$$props}
>
	<slot />
</button>

<style>
	button {
		padding: 0.8rem 1.6rem;
		border-radius: 0.4rem;
		background: var(--clr-primary);
		font-size: 1.6rem;
	}

	.secondary {
		background: var(--clr-secondary);
	}
</style>
