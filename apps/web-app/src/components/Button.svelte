<script lang="ts">
	import clsx from 'clsx';

  //@ts-ignore
	export type ButtonType = 'primary' | 'secondary';
	export let variant: ButtonType = 'primary';
</script>

<button
	on:click
	class={clsx('py-2 px-4 rounded', {
    'bg-primary text-black': variant === 'primary',
		'bg-secondary text-black': variant === 'secondary'
	})}
	{...$$props}
>
	<slot />
</button>
