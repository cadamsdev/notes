<script lang="ts">
	import clsx from 'clsx';

  //@ts-ignore
	export type ButtonType = 'primary' | 'secondary';
	let { variant = 'primary', href = '', children, ...otherProps }: { variant: ButtonType, href: string, children: any } = $props();
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
		{@render children?.()}
	</a>
	{:else}
		<button
			class={
				clsx({
					'bg-primary hover:bg-primary-hover': variant === 'primary',
					'bg-secondary hover:bg-secondary-hover': variant === 'secondary',
				}, 'py-2 px-4 text-btn-text text-base',
				''
			)}
			{...otherProps}
		>
			{@render children?.()}
		</button>
{/if}
