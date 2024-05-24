/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				text: '#e2e2e2',
				bg: '#151415',
				'bg-secondary': '#2d2b2d',
				'bg-on-secondary': '#454245',
				primary: '#e8942a',
				secondary: '#a39995',
				accent: '#E8942A'
			}
		}
	},
	plugins: []
};

