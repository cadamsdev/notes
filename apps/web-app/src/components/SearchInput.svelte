<script lang="ts">
  import Icon from '@iconify/svelte';
</script>

<div class="search-container">
  <div class="icon-container">
    <Icon icon="fa-solid:search" width="24" height="24" />
  </div>
  <input
    on:input
    {...$$restProps}
  />
</div>

<style>
  .search-container {
    position: relative;
  }
  
  .icon-container {
    position: absolute;
    color: var(--clr-text-primary);
    top: 50%;
    transform: translateY(-50%);
    left: 1.2rem;
  }

  input {
    display: block;
    padding: 1.2rem 1.2rem 1.2rem 4.8rem;
    background: var(--clr-bg-secondary);
    border: none;
    color: var(--clr-text-secondary);
    border-radius: 0.4rem;
    width: 100%;
    font-size: 1.6rem;
    line-height: 1.5;
  }

  input::placeholder {
    color: var(--clr-text-secondary);
  }

  input:focus-visible {
    outline: 0.2rem solid var(--clr-bg-secondary-hover);
  }
</style>
