import { writable } from 'svelte/store';
import type { Tag } from '../../interfaces/Tag';

export interface Note {
	id: number;
	title: string;
	content?: string;
	tags?: Tag[];
}

export const notes = writable<Note[]>([]);
export const selectedNote = writable<Note | undefined | null>();
