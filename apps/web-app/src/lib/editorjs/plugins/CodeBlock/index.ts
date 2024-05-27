import { IconCurlyBrackets } from '@codexteam/icons';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';
import '@fontsource-variable/jetbrains-mono';

import './index.css';

export interface CodeBlockData {
	code: string;
	language: string;
}

export class CodeBlock {
	static get toolbox() {
		return {
			title: 'Code Block',
			icon: IconCurlyBrackets
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

		try {
			hljs.highlightElement(codeDiv);
		} catch (err) {
			console.error(err);
		}

		return codeDiv;
	}

	save(blockContent: HTMLElement): CodeBlockData {
		return {
			code: blockContent.innerText || '',
			language: blockContent?.dataset.language || 'plaintext'
		};
	}
}
