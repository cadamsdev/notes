/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				primary: '#e78e1e',
				'primary-hover': '#eb9f40',
				secondary: '#a39995',
				'secondary-hover': '#b1a8a5',
				'bg-secondary': '#211f21',
				'bg-secondary-hover': '#454245',
				'bg-on-secondary': '#2d2b2d',
				'text-primary': '#b3b3b3',
				'text-secondary': '#b3b3b3',
				'btn-text': '#151415',
				'tag-default-text': '#e2e2e2',
				'tag-red': '#a61c2a',
				'tag-green': '#1f6e32',
				'tag-blue': '#004c91',
				'tag-purple': '#4d2b8a',
				'tag-yellow': '#c68f00',
				'tag-orange': '#c24a0a',
				'tag-pink': '#b82d6a',
				'tag-brown': '#5e3f34',
				'tag-light-gray': '#d4d6d7',
				'tag-dark-gray': '#24282b',
				bg: '#151415',
				'bg-border': '#2d2b2d',
			}
		}
	},
	plugins: []
};

