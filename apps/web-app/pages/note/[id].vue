<template>
  <div class="max-w-5xl mx-auto border-x border-bg-border min-h-screen">
    <!-- Header -->
    <div class="sticky top-0 bg-bg/80 backdrop-blur-md border-b border-bg-border p-6 z-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink 
            to="/" 
            class="p-2 hover:bg-bg-hover rounded-full text-text-secondary hover:text-text-primary"
          >
            <Icon name="fluent:arrow-left-20-filled" size="20" />
          </NuxtLink>
          <div>
            <h1 class="text-lg font-semibold text-text-primary-emphasis line-clamp-1">
              {{ note?.title || 'Untitled' }}
            </h1>
            <p class="text-sm text-text-secondary">
              {{ formatLastUpdated(note?.updated_at) }}
            </p>
          </div>
        </div>
        
        <div class="flex items-center gap-2">
          <button 
            @click="handleShare"
            class="p-2 hover:bg-bg-hover rounded-full text-text-secondary hover:text-text-primary"
            title="Share note"
          >
            <Icon name="fluent:share-20-filled" size="20" />
          </button>
          <button 
            @click="openModal(MODAL_TAG)"
            class="p-2 hover:bg-bg-hover rounded-full text-text-secondary hover:text-text-primary"
            title="Manage tags"
          >
            <Icon name="fluent:tag-20-filled" size="20" />
          </button>
        </div>
      </div>
      
      <!-- Tags bar -->
      <div v-if="note?.tags && note.tags.length > 0" class="flex flex-wrap gap-2 mt-3">
        <Chip 
          v-for="tag in note.tags" 
          :key="tag.id"
          :text="tag.name" 
          :color="tag.color"
          @click="handleTagClick(tag)"
        />
      </div>
      <div v-else class="mt-3">
        <button 
          @click="openModal(MODAL_TAG)" 
          class="text-sm text-text-secondary hover:text-text-primary flex items-center gap-1"
        >
          <Icon name="fluent:tag-20-regular" size="16" />
          Add tags to organize this note
        </button>
      </div>
    </div>

    <!-- Editor -->
    <div class="p-8">
      <Editor v-if="note" :note="note" />
      <div v-else class="flex items-center justify-center py-20">
        <div class="text-center text-text-secondary">
          <Icon name="fluent:document-error-20-regular" size="48" class="mx-auto mb-4 opacity-50" />
          <p>Note not found</p>
          <NuxtLink to="/" class="text-primary hover:underline mt-2 inline-block">
            ← Back to home
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Bottom actions for mobile -->
    <div class="lg:hidden fixed bottom-20 right-4">
      <button 
        @click="openModal(MODAL_TAG)"
        class="bg-primary text-white p-3 rounded-full shadow-lg hover:bg-primary/90 transition-colors"
      >
        <Icon name="fluent:tag-20-filled" size="20" />
      </button>
    </div>
  </div>

  <!-- Tag Management Modal -->
  <Dialog :id="MODAL_TAG">
    <div class="max-w-md">
      <h2 class="text-lg font-semibold text-text-primary-emphasis mb-6">Manage Tags</h2>
      
      <div class="mb-6">
        <TagCombobox :tags="note?.tags || []" @selected-tags="onSelectedTags" />
      </div>

      <div class="flex justify-end gap-3">
        <Button variant="secondary" @click="closeModal()">Cancel</Button>
        <Button variant="primary" @click="handleSaveTags">Save</Button>
      </div>
    </div>
  </Dialog>
</template>

<script setup lang="ts">
const note = ref<Note>();
const tempTags = ref<Tag[]>([]);
const route = useRoute();
const router = useRouter();
const { fetchNote, saveTags, tags, selectTag } = useNotes();
const { openModal, closeModal } = useModal();

const MODAL_TAG = 'MODAL_TAG';

// Watch for route changes to load different notes
watch(() => route.params.id, async (newId) => {
  if (newId) {
    const noteData = await fetchNote(+newId);
    note.value = noteData;
  }
}, { immediate: true });

// Watch for tags changes to refresh note data
watch(() => tags.value, async () => {
  if (route.params.id) {
    const noteData = await fetchNote(+route.params.id);
    note.value = noteData;
  }
});

// Check if we should open tag editor on load
onMounted(() => {
  if (route.query['edit-tags']) {
    openModal(MODAL_TAG);
    // Remove query param
    router.replace({ query: {} });
  }
});

// Methods
const formatLastUpdated = (dateString?: string) => {
  if (!dateString) return 'Never saved';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  
  if (diffMinutes < 1) return 'Just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const handleTagClick = (tag: Tag) => {
  selectTag(tag);
  router.push('/');
};

const handleShare = async () => {
  if (navigator.share && note.value) {
    try {
      await navigator.share({
        title: note.value.title,
        text: getPlainTextContent(note.value.content),
        url: window.location.href,
      });
    } catch (err) {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.href);
    }
  } else {
    // Fallback to clipboard
    await navigator.clipboard.writeText(window.location.href);
  }
};

const getPlainTextContent = (content?: string) => {
  if (!content) return '';
  try {
    const parsed = JSON.parse(content);
    const extractText = (node: any): string => {
      if (node.type === 'text') return node.text || '';
      if (node.content) return node.content.map(extractText).join('');
      return '';
    };
    return parsed.content?.map(extractText).join(' ') || '';
  } catch {
    return content;
  }
};

const onSelectedTags = (selectedTags: Tag[]) => {
  tempTags.value = selectedTags;
};

const handleSaveTags = async () => {
  if (!note.value) return;
  
  await saveTags(note.value.id, tempTags.value);
  closeModal();
  
  // Refresh note data
  const noteData = await fetchNote(note.value.id);
  note.value = noteData;
};

// Set page title
useHead(() => ({
  title: note.value?.title ? `${note.value.title} - Notes` : 'Note - Notes'
}));
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
