import { get } from "svelte/store";
import { closeModal, currentModal } from "../store";

export function clickOutside(element: HTMLElement, onClickOutside: () => void) {
	function handleClick(event: MouseEvent) {
		const isModalOpen = get(currentModal);
		console.log('isModalOpen', isModalOpen);
		if (!element.contains(event.target as HTMLElement) && isModalOpen) {
			onClickOutside();
			closeModal();
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
