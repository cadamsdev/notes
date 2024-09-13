<script lang="ts">
	import clsx from 'clsx';

	export let color: string | undefined = undefined;
</script>

<div
	class={clsx('w-3 h-3 rounded-full', {
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
	})}
></div>
