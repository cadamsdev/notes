import { IconListBulleted, IconListNumbered } from '@codexteam/icons';
import './index.css';

export interface ListData {
	items: string[];
}

abstract class List {
	private api: any;
	private _data: ListData;

	constructor({ data, api }: { data: ListData; api: any }) {
		this.api = api;
		this._data = data;
	}

	static get enableLineBreaks() {
		return true;
	}

	abstract get listType(): 'bulleted' | 'numbered';

	private wrapper?: HTMLElement;

	render() {
		this.wrapper = document.createElement('ul');
		this.wrapper.contentEditable = 'true';
		this.wrapper.classList.add('be-list');
		this.wrapper.classList.add(this.listType === 'bulleted' ? 'unordered' : 'ordered');
		this.wrapper.addEventListener('keydown', this._handleKeydown.bind(this));

		if (this._data.items?.length > 0) {
			this._data.items.forEach((item) => {
				const li = document.createElement('li');
				li.textContent = item;
				this.wrapper?.appendChild(li);
			});
		} else {
			const li = document.createElement('li');
			this.wrapper.appendChild(li);
		}
		return this.wrapper;
	}

	private _handleKeydown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Enter':
				this._getOutofList(event);
				break;

			case 'Backspace':
				this._handleBackspace(event);
				break;
		}
	}

	get currentItem(): Element | null {
		let currentNode: Node | null | undefined = window.getSelection()?.anchorNode;

		if (currentNode?.nodeType !== Node.ELEMENT_NODE) {
			currentNode = currentNode?.parentNode;
		}

		return (currentNode as Element)?.closest('li');
	}

	private _getOutofList(event: Event): void {
		const items = this.wrapper?.querySelectorAll('li');

		// Save the last one
		if (!items || items.length < 2) {
			return;
		}

		const lastItem = items[items.length - 1] as Element;
		const currentItem = this.currentItem;

		// Prevent Default li generation if item is empty
		if (currentItem === lastItem && !lastItem.textContent?.trim().length) {
			// Insert New Block and set caret
			currentItem.parentElement?.removeChild(currentItem);
			this.api.blocks.insert();
			this.api.caret.setToBlock(this.api.blocks.getCurrentBlockIndex());
			event.preventDefault();
			event.stopPropagation();
		}
	}

	private _handleBackspace(event: Event) {
		if (this.currentItem?.innerHTML.includes('<br>')) {
			event.preventDefault();
			this.wrapper?.removeChild(this.currentItem);
		}
	}

	save(blockContent: HTMLElement) {
		const items = Array.from(blockContent?.querySelectorAll('li'))
			.filter((item) => item.innerHTML.replace('<br>', ''))
			.map((item) => item.textContent);

		return {
			items
		};
	}
}

export class BulletedList extends List {
	override get listType(): 'bulleted' | 'numbered' {
		return 'bulleted';
	}

	static get toolbox() {
		return {
			icon: IconListBulleted,
			title: 'Bulleted list'
		};
	}
}

export class NumberedList extends List {
	override get listType(): 'bulleted' | 'numbered' {
		return 'numbered';
	}

	static get toolbox() {
		return {
			icon: IconListNumbered,
			title: 'Numbered list'
		};
	}
}
