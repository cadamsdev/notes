
import './index.css';

export class DividerPlugin {
	static get toolbox() {
		return {
			title: 'Divider',
			icon: `
				<?xml version="1.0" encoding="utf-8"?>
				<svg width="24px" height="24px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
					<g transform="translate(4.5, 4.5)">
						<path fill-rule="evenodd" clip-rule="evenodd" d="M12 2H3V1H12V2ZM10 5H3V4H10V5ZM15 8H0V7H15V8ZM12 11H3V10H12V11ZM10 14H3V13H10V14Z" fill="#000000"/>
					</g>
				</svg>
			`
		};
	}

	render() {
		const containerEl = document.createElement('div');
		containerEl.classList.add('ss-divider');

		const separatorEl = document.createElement('div');
		separatorEl.classList.add('seperator');

		containerEl.appendChild(separatorEl);
		return containerEl;
	}

	save() {
		return {};
	}

}
