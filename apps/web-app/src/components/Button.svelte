<script lang="ts">
	import clsx from 'clsx';

  //@ts-ignore
	export type ButtonType = 'primary' | 'secondary';
	export let variant: ButtonType = 'primary';
</script>

<button
	on:click
	class={clsx('py-2 px-4 rounded', {
    'bg-blue-600 hover:bg-blue-700 text-white': variant === 'primary',
		'bg-gray-300 hover:bg-gray-400 text-black': variant === 'secondary'
	})}
	{...$$props}
>
	<slot />
</button>
