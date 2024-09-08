/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#e78e1e',
				'primary-hover': '#eb9f40',
				'secondary': '#a39995',
				'secondary-hover': '#b1a8a5',
				'bg-secondary': '#211f21',
				'bg-secondary-hover': '#454245',
				'text-secondary': '#b3b3b3',
				'btn-text': '#151415',
			}
		}
	},
	plugins: []
};

