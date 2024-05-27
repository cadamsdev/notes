import { IconHtml } from '@codexteam/icons';
import './index.css';

export interface CodeBlockData {
	code: string;
	language: string;
}

export class CodeBlock {
	static get toolbox() {
		return {
			title: 'Code Block',
			icon: IconHtml
		};
	}

	static get enableLineBreaks() {
		return true;
	}

	private _data: CodeBlockData;

	constructor({ data }: { data: CodeBlockData }) {
		this._data = data;
	}

	render() {
		const codeDiv = document.createElement('div');
		codeDiv.innerHTML = this._data.code || '';
		codeDiv.classList.add('ss-code-block');
		codeDiv.dataset.language = this._data.language || 'plaintext';
		codeDiv.contentEditable = 'true';
		return codeDiv;
	}

	save(blockContent: HTMLElement): CodeBlockData {
		return {
			code: blockContent.innerHTML || '',
			language: blockContent?.dataset.language || 'plaintext'
		};
	}
}
