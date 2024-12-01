<template>
  <div v-for="tag in newTags" class="flex flex-wrap gap-1 mb-4">
    <Chip :text="tag.name" :color="tag.color" has-close-btn @close="handleRemoveTag(tag.id)" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  tags: Tag[]
}>();
const newTags = ref<Tag[]>([...props.tags]);
const {  } = useNotes();

function handleRemoveTag(tagId: number) {
  newTags.value = newTags.value.filter(tag => tag.id !== tagId) 
}
</script>
