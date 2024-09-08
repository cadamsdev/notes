<script lang="ts">
	import clsx from 'clsx';

  //@ts-ignore
	export type ButtonType = 'primary' | 'secondary';
	export let variant: ButtonType = 'primary';
</script>

<button
	on:click
	class={
		clsx({
			'bg-primary hover:bg-primary-hover': variant === 'primary',
			'bg-secondary hover:bg-secondary-hover': variant === 'secondary',
		}, 'py-2 px-4 border-4 bg-primary text-btn-text text-base',
		''
	)}
	{...$$props}
>
	<slot />
</button>
