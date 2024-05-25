<script lang="ts">
  export let text: string;
</script>

<div class="chip">
  #{text}
</div>

<style>
  .chip {
		display: inline-block;
		padding: 0.2rem 0.4rem;
		font-size: 1.2rem;
		background: var(--clr-bg-on-secondary);
		color: var(--clr-text-secondary);
		border-radius: 0.2rem;
	}
</style>
