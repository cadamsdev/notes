import { IconBrackets } from '@codexteam/icons';
import './index.css';

export interface QuotePluginData {
	quote: string;
}

export class QuotePlugin {
	static get toolbox() {
		return {
			title: 'Quote',
			icon: IconBrackets
		};
	}

	private _data: QuotePluginData;

	constructor({ data }: { data: QuotePluginData }) {
		this._data = data;
	}

	render() {
		const blockquoteEl = document.createElement('blockquote');
		blockquoteEl.classList.add('ss-blockquote');

    const editableDiv = document.createElement('div');
    editableDiv.classList.add('quote');
    editableDiv.contentEditable = 'true';
    editableDiv.innerHTML = this._data.quote || '';

    blockquoteEl.appendChild(editableDiv);
		return blockquoteEl;
	}

	save(blockContent: HTMLElement): QuotePluginData {
		return {
			quote: blockContent.textContent || ''
		};
	}
}
