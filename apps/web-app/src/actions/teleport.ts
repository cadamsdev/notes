export function teleport(node: HTMLElement, name: string) {
	const teleportContainer = document.getElementById(name);
	teleportContainer?.appendChild(node);

	return {
		destroy() {
			node.remove();
		}
	};
}
