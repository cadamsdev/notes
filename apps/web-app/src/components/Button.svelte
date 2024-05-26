<script lang="ts">
	import clsx from 'clsx';

  //@ts-ignore
	export type ButtonType = 'primary' | 'secondary';
	export let variant: ButtonType = 'primary';
</script>

<button
	on:click
	class={clsx({
		primary: variant === 'primary',
		secondary: variant === 'secondary'
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
		color: var(--clr-text-primary);
		font-size: 1.6rem;
	}

	.primary:hover {
		background: var(--clr-primary-hover);
	}

	.secondary {
		background: var(--clr-secondary);
	}
	
	.secondary:hover {
		background: var(--clr-secondary-hover);
	}	
</style>
