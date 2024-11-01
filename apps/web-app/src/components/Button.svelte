<script lang="ts">
	import clsx from 'clsx';

  //@ts-ignore
	export type ButtonType = 'primary' | 'secondary';
	let { variant = 'primary', href = '', ...otherProps }: { variant: ButtonType, href: string } = $props();
</script>

{#if href}
	<a
		href={href}
		class={
			clsx({
				'bg-primary hover:bg-primary-hover': variant === 'primary',
				'bg-secondary hover:bg-secondary-hover': variant === 'secondary',
			}, 'py-2 px-4 text-btn-text text-base',
			''
		)}
		{...otherProps}
	>
		<slot />
	</a>
	{:else}
		<button
			on:click
			class={
				clsx({
					'bg-primary hover:bg-primary-hover': variant === 'primary',
					'bg-secondary hover:bg-secondary-hover': variant === 'secondary',
				}, 'py-2 px-4 text-btn-text text-base',
				''
			)}
			{...otherProps}
		>
			<slot />
		</button>
{/if}
