import { IconH1 } from '@codexteam/icons';

export interface H1Data {
	text: string;
}

export class H1 {
	static get toolbox() {
		return {
			title: 'H1',
			icon: IconH1,
		};
	}

	private _data: H1Data;

	constructor({ data }: { data: H1Data}) {
		this._data = data;
	}

	render() {
		const tag = document.createElement('h1')
		const textNode = document.createTextNode(this._data.text || '');
		tag.appendChild(textNode);

		tag.classList.add('ce-header');
		tag.contentEditable = 'true';
		return tag;
	}

	save(blockContent: HTMLElement): H1Data {
		return {
			text:  blockContent.textContent || '',
		};
	}
}

