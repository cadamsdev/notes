<script lang="ts">
	import clsx from 'clsx';

	//@ts-ignore
	export type ButtonType = 'primary' | 'secondary';

	interface ButtonProps {
		variant?: ButtonType;
		href?: string;
		children: any;
		onclick?: () => void;
	}

	let { variant = 'primary', href = '', onclick, children, ...otherProps }: ButtonProps = $props();
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
			onclick={onclick}
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
