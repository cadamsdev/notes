/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				text: '#e2e2e2',
				'text-primary': 'rgb(230, 230, 230)',
				'text-secondary': 'rgb(179, 179, 179)',
				'text-secondary-hover': 'rgb(230, 230, 230)',
				bg: '#151415',
				'bg-secondary': '#2d2b2d',
				'bg-secondary-hover': '#454245',
				'bg-on-secondary': '#454245',
				primary: '#e8942a',
				secondary: '#a39995',
				accent: '#E8942A'
			}
		}
	},
	plugins: []
};

