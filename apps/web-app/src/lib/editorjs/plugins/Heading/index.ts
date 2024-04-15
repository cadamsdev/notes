import { IconH1, IconH2, IconH3 } from '@codexteam/icons';
import './index.css';

export interface H1Data {
	text: string;
}

export class H1 {
	static get toolbox() {
		return {
			title: 'Heading 1',
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

export class H2 {
	static get toolbox() {
		return {
			title: 'Heading 2',
			icon: IconH2,
		};
	}

	private _data: H1Data;

	constructor({ data }: { data: H1Data }) {
		this._data = data;
	}

	render() {
		const tag = document.createElement('h2');
		const textNode = document.createTextNode(this._data.text || '');
		tag.appendChild(textNode);

		tag.classList.add('ce-header');
		tag.contentEditable = 'true';
		return tag;
	}

	save(blockContent: HTMLElement): H1Data {
		return {
			text: blockContent.textContent || ''
		};
	}
}


export class H3 {
	static get toolbox() {
		return {
			title: 'Heading 3',
			icon: IconH3,
		};
	}

	private _data: H1Data;

	constructor({ data }: { data: H1Data }) {
		this._data = data;
	}

	render() {
		const tag = document.createElement('h3');
		const textNode = document.createTextNode(this._data.text || '');
		tag.appendChild(textNode);

		tag.classList.add('ce-header');
		tag.contentEditable = 'true';
		return tag;
	}

	save(blockContent: HTMLElement): H1Data {
		return {
			text: blockContent.textContent || ''
		};
	}
}

