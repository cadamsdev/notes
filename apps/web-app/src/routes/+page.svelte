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

<div class="create-note-btn">
  <Button on:click={handleCreateNote}>Create a note</Button>
</div>

<style>
  .create-note-btn {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>
