import { IconHtml, } from '@codexteam/icons';
import './index.css';

export interface CodeBlockData {
	code: string;
	language: string;
}

export class H1 {
	static get toolbox() {
		return {
			title: 'Code Block',
			icon: IconHtml
		};
	}

	private _data: CodeBlockData;

	constructor({ data }: { data: CodeBlockData }) {
		this._data = data;
	}

	render() {
		const code = document.createElement('code');
		code.textContent = this._data.code || '';
		code.classList.add('ce-code-block');
		code.contentEditable = 'true';
		return code;
	}

	save(blockContent: HTMLElement): CodeBlockData {
		return {
			code: blockContent.textContent || '',
			language: 'javascript',
		};
	}
}

