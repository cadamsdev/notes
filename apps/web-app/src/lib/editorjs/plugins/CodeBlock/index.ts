import { IconCurlyBrackets } from '@codexteam/icons';
import hljs from 'highlight.js';
import 'highlight.js/styles/atom-one-dark.min.css';
import '@fontsource-variable/jetbrains-mono';

import './index.css';
import type { API } from '@editorjs/editorjs';

const defaultLanguage = 'plaintext';

interface CodeBlockProps {
	data: CodeBlockData;
	api: API;
}

export interface CodeBlockData {
	code: string;
	language: string;
}

export class CodeBlock {
	static get toolbox() {
		return {
			title: 'Code',
			icon: IconCurlyBrackets
		};
	}

	static get enableLineBreaks() {
		return true;
	}

	private _data: CodeBlockData;
	private _api: API;

	constructor({ data, api }: CodeBlockProps) {
		this._data = data;
		this._api = api;
	}

	render() {
		//wrapper
		const codeWrapper = document.createElement('div');
		codeWrapper.classList.add('ss-code-block-wrapper');

		// language dropdown
		const languageDropdown = document.createElement('select');
		languageDropdown.classList.add('ss-code-block-language-dropdown');

		// fill select with languages
		const languages = hljs.listLanguages();
		languages.forEach((language) => {
			const option = document.createElement('option');
			option.value = language;
			option.textContent = language;
			if (
				(language === defaultLanguage && !this._data.language) ||
				language === this._data.language
			) {
				option.selected = true;
			}
			languageDropdown.appendChild(option);
		});

		languageDropdown.onchange = (e) => {
			const code = codeWrapper.querySelector<HTMLElement>('.ss-code-block');
			if (code) {
				const language = (e.target as HTMLSelectElement).value;
				code.dataset.language = language;
				if (code.dataset.language !== defaultLanguage) {
					const highlightedCode = hljs.highlight(code.innerText, { language: language });
					code.innerHTML = highlightedCode.value;
				}
			}
		};

		codeWrapper.appendChild(languageDropdown);

		// copy button
		const copyBtn = document.createElement('button');
		copyBtn.textContent = 'Copy';
		copyBtn.classList.add('ss-code-block-copy-btn');
		copyBtn.onclick = () => {
			const code = codeWrapper.querySelector<HTMLElement>('.ss-code-block');
			if (code) {
				navigator.clipboard.writeText(code.innerText).then(() => {
					copyBtn.textContent = 'Copied!';
					setTimeout(() => {
						copyBtn.textContent = 'Copy';
					}, 1000);
				});
			}
		};

		codeWrapper.appendChild(copyBtn);

		// code block
		const codeDiv = document.createElement('div');
		codeDiv.classList.add('ss-code-block');
		codeDiv.dataset.language = this._data.language || defaultLanguage;
		codeDiv.contentEditable = 'true';
		codeDiv.addEventListener('paste', this._handlePaste);
		codeDiv.addEventListener('keydown', this._handleKeydown);

		const code = this._data.code || '';
		const highlightedCode = hljs.highlight(code, {
			language: this._data.language || defaultLanguage,
		});

		codeDiv.innerHTML = highlightedCode.value;

		codeWrapper.appendChild(codeDiv);
		return codeWrapper;
	}

	save(blockContent: HTMLElement): CodeBlockData {
		const codeBlockDiv = blockContent.querySelector<HTMLElement>('.ss-code-block');
		return {
			code: codeBlockDiv?.innerText || '',
			language: codeBlockDiv?.dataset.language || defaultLanguage
		};
	}

	private _handleKeydown = async (event: KeyboardEvent) => {
		event.stopPropagation(); // prevent editorjs from handling this
		switch (event.key) {
			case 'Backspace':
				// we need to wait for the next event loop to check if the code block is empty
				setTimeout(async () => {
					// check to see if the code block is empty
					const codeBlock = event.target as HTMLElement;
					// TODO editorjs does not trigger on change event when deleting all text
					if (!codeBlock.innerText.trim()) {
						// TODO find a better way to trigger save
						window.dispatchEvent(new Event('editor-save', { bubbles: true, composed: true }));
					}
				});
				break;
		}
	}

	private _handlePaste(event: ClipboardEvent) {
		event.preventDefault();
		event.stopPropagation();

		const codeDiv = event.currentTarget as HTMLElement;
		const clipboardData = event.clipboardData;
		const pastedData = clipboardData?.getData('text') || '';

		if (!pastedData) {
			return;
		}

		const selection = window.getSelection();
		if (selection) {
			const range = selection.getRangeAt(0);
			range.deleteContents();

			const highlightedCode = hljs.highlight(pastedData, {
				language: codeDiv.dataset.language || defaultLanguage
			});

			const code = document.createElement('div');
			const highlightedHtml = highlightedCode.value;
			code.innerHTML = highlightedHtml;

			range.insertNode(code);
			selection.removeAllRanges();
		}
	}
}
