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
		const codeWrapper = document.createElement('div');
		codeWrapper.classList.add('ss-code-block-wrapper');

		const copyBtn = document.createElement('button');
		copyBtn.textContent = 'Copy';
		copyBtn.classList.add('ss-code-block-copy-btn');
		copyBtn.onclick = () => {
			const code = codeWrapper.querySelector<HTMLElement>('.ss-code-block');
			if (code) {
				console.log(code.innerText);
				navigator.clipboard.writeText(code.innerText).then(() => {
					copyBtn.textContent = 'Copied!';
					setTimeout(() => {
						copyBtn.textContent = 'Copy';
					}, 1000);
				});
			}
		};

		codeWrapper.appendChild(copyBtn);

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

		codeWrapper.appendChild(codeDiv);
		return codeWrapper;
	}

	save(blockContent: HTMLElement): CodeBlockData {
		const codeBlockDiv = blockContent.querySelector<HTMLElement>('.ss-code-block');
		return {
			code: codeBlockDiv?.innerText || '',
			language: codeBlockDiv?.dataset.language || 'plaintext'
		};
	}
}
