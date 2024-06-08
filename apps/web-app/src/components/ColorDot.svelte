<script lang="ts">
	import clsx from "clsx";

  export type ColorDotSize = 'medium' | 'small';

  export let color: string | undefined = undefined;
  export let size : ColorDotSize = 'medium';
</script>

<div class={clsx('color-dot', { [`${size}`]: true }, { [`${color}`]: true })}></div>

<style>
  .color-dot {
		width: 2.4rem;
		height: 2.4rem;
		border-radius: 100rem;
	}

  .color-dot.medium {
    width: 2.4rem;
    height: 2.4rem;
  }

  .color-dot.small {
    width: 1.6rem;
    height: 1.6rem;
  
  }

	.red {
		background: var(--clr-tag-red);
	}

	.green {
		background: var(--clr-tag-green);
	}

	.blue {
		background: var(--clr-tag-blue);
	}	

	.purple {
		background: var(--clr-tag-purple);
	}

	.yellow {
		background: var(--clr-tag-yellow);
	}

	.orange {
		background: var(--clr-tag-orange);
	}

	.pink {
		background: var(--clr-tag-pink);
	}

	.brown {
		background: var(--clr-tag-brown);
	}

	.light-gray {
		background: var(--clr-tag-light-gray);
	}

	.dark-gray {
		background: var(--clr-tag-dark-gray);
	}
</style>
