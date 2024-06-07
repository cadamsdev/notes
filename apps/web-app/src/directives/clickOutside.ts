export function clickOutside(element: HTMLElement, onClickOutside: () => void) {
	function handleClick(event: MouseEvent) {
		if (!element.contains(event.target as HTMLElement)) {
			onClickOutside();
		}
	}

	window.addEventListener('click', handleClick);
	return {
		update(newCallbackFunction: () => void) {
			onClickOutside = newCallbackFunction;
		},
		destroy() {
			window.removeEventListener('click', handleClick);
		}
	};
}
