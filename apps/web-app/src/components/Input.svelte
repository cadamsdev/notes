<script lang="ts">
</script>

<input
  on:input
  {...$$restProps}
/>

<style>
  input {
    display: block;
    padding: 0.8rem;
    background: var(--clr-bg-secondary);
    border: 0.1rem solid var(--clr-bg-secondary);
    color: var(--clr-text-secondary);
    border-radius: 0.4rem;
    width: 100%;
    font-size: 1.6rem;
  }

  input::placeholder {
    color: var(--clr-text-secondary);
  }

  input:focus-visible {
    outline: 0.2rem solid var(--clr-bg-secondary-hover);
  }
</style>
