import { IconCurlyBrackets } from '@codexteam/icons';
import { codeToHtml, bundledLanguages, type BundledTheme, type BundledLanguage } from 'shiki';
import '@fontsource-variable/jetbrains-mono';

import './index.css';
import type { API } from '@editorjs/editorjs';

const defaultLanguage: BundledLanguage | 'text' = 'text';
const defaultTheme: BundledTheme = 'one-dark-pro';

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
	private _codeBlockDiv!: HTMLDivElement;

	constructor({ data }: CodeBlockProps) {
		this._data = data;
	}

	render() {
		//wrapper
		const codeWrapper = document.createElement('div');
		codeWrapper.classList.add('ss-code-block-wrapper');

		// language dropdown
		const languageDropdown = document.createElement('select');
		languageDropdown.classList.add('ss-code-block-language-dropdown');

		// fill select with languages
		const languages = this.getLanguages();
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

		languageDropdown.onchange = async (e) => {
			const code = codeWrapper.querySelector<HTMLElement>('.ss-code-block');
			if (code) {
				const language = (e.target as HTMLSelectElement).value;
				code.dataset.language = language;
				if (code.dataset.language !== defaultLanguage) {
					const highlightedCode = await codeToHtml(code.innerText, {
						lang: language,
						theme: defaultTheme
					});
					code.innerHTML = highlightedCode;
				}
			}
		};

		codeWrapper.appendChild(languageDropdown);

		// copy button
		const copyBtn = document.createElement('button');
		copyBtn.textContent = 'Copy';
		copyBtn.classList.add('ss-code-block-copy-btn');
		copyBtn.onclick = () => {
			const textareaEl = codeWrapper.querySelector<HTMLTextAreaElement>('textarea');
			if (textareaEl) {
				navigator.clipboard.writeText(textareaEl.value).then(() => {
					copyBtn.textContent = 'Copied!';
					setTimeout(() => {
						copyBtn.textContent = 'Copy';
					}, 1000);
				});
			}
		};

		codeWrapper.appendChild(copyBtn);

		// code block
		this._codeBlockDiv = document.createElement('div');
		this._codeBlockDiv.classList.add('ss-code-block');
		this._codeBlockDiv.dataset.language = this._data.language || defaultLanguage;

		const code = this._data.code || '';
		const highlightedCode = codeToHtml(code, {
			lang: this._data.language,
			theme: defaultTheme
		});

		highlightedCode.then((value) => {
			this._codeBlockDiv.innerHTML = value;
			codeWrapper.appendChild(this._codeBlockDiv);

			// create textarea
			const textareaEl = document.createElement('textarea');
			textareaEl.onpaste = this.handlePaste;
			textareaEl.setAttribute('autocomplete', 'off');
			textareaEl.setAttribute('autocorrect', 'off');
			textareaEl.setAttribute('autocapitalize', 'off');
			textareaEl.setAttribute('spellcheck', 'false');
			textareaEl.value = code;
			textareaEl.oninput = async (e: Event) => {
				const newValue = (e.target as HTMLTextAreaElement).value;
				const hc = await codeToHtml(newValue, {
					lang: this._data.language,
					theme: defaultTheme
				});

				this._codeBlockDiv.innerHTML = hc;
			};
			codeWrapper.appendChild(textareaEl);
		});

		return codeWrapper;
	}

	save(blockContent: HTMLElement): CodeBlockData {
		const codeBlockDiv = blockContent.querySelector<HTMLElement>('.ss-code-block');
		const textareaEl = blockContent.querySelector('textarea');
		return {
			code: textareaEl?.value || '',
			language: codeBlockDiv?.dataset.language || defaultLanguage
		};
	}

	private handlePaste = async (event: ClipboardEvent) => {
		event.preventDefault();
		event.stopPropagation();

		const textareaEl = event.currentTarget as HTMLTextAreaElement;
		const clipboardData = event.clipboardData;
		const pastedData = clipboardData?.getData('text') || '';

		if (!pastedData) {
			return;
		}

		// Get the current selection start and end positions
		const start = textareaEl.selectionStart;
		const end = textareaEl.selectionEnd;

		// Insert the pasted text at the cursor's position
		const before = textareaEl.value.substring(0, start);
		const after = textareaEl.value.substring(end);

		const newValue = before + pastedData + after;
		textareaEl.value = newValue;

		// Set the cursor position after the pasted text
		textareaEl.selectionStart = textareaEl.selectionEnd = start + pastedData.length;

		const highlightedCode = await codeToHtml(newValue, {
			lang: this._codeBlockDiv.dataset.language || defaultLanguage,
			theme: defaultTheme
		});

		// Update the code block with highlighted code
		this._codeBlockDiv.innerHTML = highlightedCode;
	};

	private getLanguages(): string[] {
		const languages = Object.keys(bundledLanguages).map((language) => language);
		languages.push('text');
		return languages.map((language) => language.toLowerCase()).sort();
	}
}
