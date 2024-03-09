import { writable } from "svelte/store";

export interface Note {
  id: number;
  title: string;
  content: string;
}

export const notes = writable<Note[]>([]);
