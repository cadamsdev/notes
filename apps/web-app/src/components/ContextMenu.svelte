<script lang="ts">
	import type { ContextMenuConfig } from '../interfaces/ContextMenu';

	export let actions: ContextMenuConfig[] = [];
	export let targetId: string;

	let pos = { x: 0, y: 0 };
	let menu = { w: 0, h: 0, y: 0 };
	let browser = { w: 0, h: 0, y: 0 };
	let showMenu = false;
	let component: HTMLElement;

	function show(e: MouseEvent) {
		e.preventDefault();
		const targetEl = document.querySelector(`#${targetId}`);
		showMenu = !!targetEl && e.composedPath().includes(targetEl);
		browser = {
			w: window.innerWidth,
			h: window.innerHeight,
			y: 0,
		};
		pos = {
			x: e.clientX,
			y: e.clientY
		};

		if (browser.h - pos.y < menu.h) pos.y = pos.y - menu.h;
		if (browser.w - pos.x < menu.w) pos.x = pos.x - menu.w;
	}

	function onPageClick(_: Event) {
		showMenu = false;
	}

	function onContextMenu(e: MouseEvent) {
		show(e);
	}

	function getContextMenuDimension(node: HTMLElement) {
		let height = node.offsetHeight;
		let width = node.offsetWidth;
		menu = {
			h: height,
			w: width,
			y: 0,
		};
	}

	function handleClickAction(e: Event, config: ContextMenuConfig) {
		e.preventDefault();
		e.stopImmediatePropagation();
		config?.action?.();
		showMenu = false;
	}

</script>

{#if showMenu}
	<nav bind:this={component} use:getContextMenuDimension style="position: absolute; top:{pos.y}px; left:{pos.x}px">
		<ul class="border bg-slate-50 rounded">
			{#each actions as action}
				<li>
					<button class="p-4 hover:bg-slate-100 w-full text-start text-black" on:click={(e) => handleClickAction(e, action)}>{action.label}</button>
				</li>
			{/each}
		</ul>
	</nav>
{/if}

<svelte:window on:click={onPageClick} on:contextmenu={onContextMenu} />
