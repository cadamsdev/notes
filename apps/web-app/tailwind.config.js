/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				'bg-secondary': '#211f21',
				'bg-secondary-hover': '#454245',
				'text-secondary': '#b3b3b3',
			}
		}
	},
	plugins: []
};

