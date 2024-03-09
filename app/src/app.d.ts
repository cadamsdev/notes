// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}

	interface Window {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		electron: {
			createNote: (title: string, content: string) => number;
		};
	}
}

export {};
