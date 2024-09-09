<script lang="ts">
	import clsx from "clsx";

  export let color: string | undefined = undefined;
</script>

<div class={clsx('color-dot', { [`${color}`]: true })}></div>

<style>
  .color-dot {
		width: 1.2rem;
		height: 1.2rem;
		border-radius: 100rem;
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
