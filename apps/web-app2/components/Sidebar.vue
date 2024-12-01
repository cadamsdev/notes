<template>
  <div
    class="w-[275px] min-w-[275px] p-6 bg-bg flex flex-col gap-4 text-text-primary border-r border-solid border-bg-border">
    <button class="flex items-center gap-2 hover:bg-bg-hover p-2 rounded" @click="openModal(MODAL_SETTINGS)">
      <Icon name="fluent:settings-20-filled" width="20" height="20" />
      Settings
    </button>

    <div class="flex items-center justify-between gap-2 text-text-primary-emphasis text-sm">
      <div class="flex items-center gap-2">
        <Icon name="fa-solid:tags" />
        Tags
      </div>
      <button @click="toggleSortTags">
        <Icon v-if="tagSort === TAG_SORT_COUNT" name="mingcute:numbers-90-sort-descending-line" width="24"
          height="24" />
        <Icon v-if="tagSort === TAG_SORT_NAME" name="mingcute:az-sort-ascending-letters-line" width="24" height="24" />
      </button>
    </div>
    <div class="flex-grow overflow-y-auto pl-1">
      <button v-for="tag in filteredTags" :key="tag.id" :v-if="tag.count ?? 0 > 0" :id="`tag-${tag.id}`"
        class="flex items-center gap-2 py-1 px-2 hover:text-text-primary-hover" @click="selectTag(tag)">
        <ColorDot :color="tag.color" />
        <div class="flex items-center gap-[2px]">
          <span class="text-base">{{ tag.name }}</span>
          <span class="text-text-primary text-sm">&nbsp;{{ tag.count }}</span>
        </div>
        <ContextMenu :targetId="`tag-${tag.id}`" :actions="[
          { label: 'Edit', action: () => handleShowEditTagModal(tag) },
          { label: 'Remove', action: () => handleShowRemoveTagConfirmationModal(tag) }
        ]" />
      </button>
    </div>
  </div>

  <Dialog :id="MODAL_EDIT_TAG">
    <div>
      <label for="tag-name" class="block text-base font-bold mb-6">
        <div class="mb-2">Name:</div>
        <Input id="tag-name" name="name" placeholder="Enter tag name" v-model="selectedTag!.name"
          @input="handleChangeTagName" />
      </label>

      <div class="mb-2">Colors</div>
      <div class="grid gap-4 mb-6 grid-cols-3">
        <div v-for="color in colors" :key="color">
          <button @click="selectColor(color)" class="flex items-center gap-2 p-0">
            <div :class="[
              'w-6 h-6 rounded-full',
              {
                'bg-tag-red': color === 'red',
                'bg-tag-green': color === 'green',
                'bg-tag-blue': color === 'blue',
                'bg-tag-purple': color === 'purple',
                'bg-tag-yellow': color === 'yellow',
                'bg-tag-orange': color === 'orange',
                'bg-tag-pink': color === 'pink',
                'bg-tag-brown': color === 'brown',
                'bg-tag-light-gray': color === 'light-gray',
                'bg-tag-dark-gray': color === 'dark-gray',
                'bg-bg-on-secondary': !color,
              },
              {
                'outline outline-2 outline-primary outline-offset-4':
                  selectedColor === color ||
                  (!selectedColor && selectedTag?.color === color) ||
                  (!selectedColor && !selectedTag?.color && color === 'none')
              }
            ]"></div>
            <div class="color-label">{{ color }}</div>
          </button>
        </div>
      </div>

      <div class="flex justify-end gap-2">
        <Button variant="primary" @click="handleUpdateTag">Save</Button>
        <Button variant="secondary" @click="closeModal">Cancel</Button>
      </div>
    </div>
  </Dialog>

  <Dialog :id="MODAL_SETTINGS">
    <h2 class="text-xl mb-8">Settings</h2>
    <Button variant="secondary">Export data</Button>
  </Dialog>

  <ConfirmationDialog :id="MODAL_REMOVE_TAG" @action="handleDeleteTag" />
</template>

<script setup lang="ts">
const { tags, selectTag, filteredTags, deleteTag, updateTag } = useTags();
const { openModal, closeModal } = useModal();

const selectedTag = ref<Tag>();

const MODAL_SETTINGS = 'modal-settings'
const MODAL_EDIT_TAG = 'modal-edit-tag'
const MODAL_REMOVE_TAG = 'modal-remove-tag'
const TAG_SORT_COUNT = 'count'
const TAG_SORT_NAME = 'name'

const tagSort = ref(TAG_SORT_COUNT)
const selectedColor = ref('')
const colors = ['red', 'green', 'blue', 'purple', 'yellow', 'orange', 'pink', 'brown', 'light-gray', 'dark-gray']

// TODO remove
watch(tags, (newValue) => {
  filteredTags.value = newValue;
});

const toggleSortTags = () => {
  tagSort.value = tagSort.value === TAG_SORT_COUNT ? TAG_SORT_NAME : TAG_SORT_COUNT
}

const handleShowEditTagModal = (tag: Tag) => {
  selectedTag.value = tag;
  selectedColor.value = tag.color || '';
  openModal(MODAL_EDIT_TAG)
}

const handleShowRemoveTagConfirmationModal = (tag: Tag) => {
  selectedTag.value = tag;
  openModal(MODAL_REMOVE_TAG)
}

const handleChangeTagName = (event: Event) => {
  const input = event.target as HTMLInputElement
  if (selectedTag.value) {
    selectedTag.value.name = input.value;
  }
}

const selectColor = (color: string) => {
  selectedColor.value = color;
}

const handleUpdateTag = async () => {
  const tag = selectedTag.value;
  if (!tag) {
    return;
  }

  tag.color = selectedColor.value;
  await updateTag(tag);
  closeModal();
}

const handleDeleteTag = async () => {
  const id = selectedTag.value?.id;
  if (!id) {
    return;
  }
  await deleteTag(id);
}
</script>
