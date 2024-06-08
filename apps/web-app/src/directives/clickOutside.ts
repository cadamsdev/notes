import { closeModal } from "../store";

export function clickOutside(element: HTMLElement, onClickOutside: () => void) {
	function handleClick(event: MouseEvent) {
		if ((event.target as HTMLElement).classList.contains('modal-overlay')) {
			onClickOutside();
			closeModal();
		}
	}

	element.addEventListener('click', handleClick);
	return {
		update(newCallbackFunction: () => void) {
			onClickOutside = newCallbackFunction;
		},
		destroy() {
			element.removeEventListener('click', handleClick);
		}
	};
}
