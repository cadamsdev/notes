<script lang="ts">
	import { goto } from "$app/navigation";
	import Button from "../components/Button.svelte";
	import { createNote, selectedNote } from "../store";

  async function handleCreateNote() {
    const note = await createNote();
    if (note) {
      selectedNote.set(note);
      goto(`/note/${note.id}`);
    }
  }
</script>

<div class="w-full h-full flex items-center justify-center">
  <Button on:click={handleCreateNote}>Create a note</Button>
</div>
