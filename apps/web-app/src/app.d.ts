// See https://kit.svelte.dev/docs/types#app

import type { Tag } from "./interfaces/Tag";
import type { TagRecord } from "./interfaces/TagRecord";
import type { Note } from "./store";

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
			editTag: (tag: TagRecord) => void;
		};
	}
}

export {};
