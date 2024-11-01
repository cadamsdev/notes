<script lang="ts">
	import clsx from 'clsx';

	const props = $props();
</script>

<input
	class={clsx(
		'block w-full p-2 text-text-secondary rounded text-base bg-bg-secondary',
		'placeholder:text-text-secondary',
		'border-solid border-bg-secondary border',
    'focus-visible:outline-2 focus-visible:outline focus-visible:outline-bg-secondary-hover'
	)}
	{...props}
/>

