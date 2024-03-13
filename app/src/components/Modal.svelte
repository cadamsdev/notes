<script lang="ts">
	import Icon from '@iconify/svelte';
	import { teleport } from '../actions/teleport';
	export let showHeader: boolean;

	let modalRef: HTMLDivElement;
  let show = false;

  export function showModal() {
    show = true;
  }

  export function closeModal() {
    show = false;
  }

  function handleCloseModal(e: any) {
    if (!modalRef.contains(e.target)) {
      show = false;
    }
  }
</script>

{#if show}
	<div
		class="fixed w-full h-full bg-black z-10 inset-0 bg-opacity-25 flex justify-center items-center"
    use:teleport={'teleport'}
    on:click={handleCloseModal}
	>
		<div bind:this={modalRef} class="rounded bg-white p-3 shadow-lg inline-block z-20">
			<div class="flex justify-end mb-3">
				{#if showHeader}
					<button on:click={closeModal} class="hover:text-gray-600 text-black">
						<Icon icon="fa-solid:times" width="24" height="24" />
          </button>
				{/if}
			</div>
			<slot />
		</div>
	</div>
{/if}
