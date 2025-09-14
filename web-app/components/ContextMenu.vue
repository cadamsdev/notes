<template>
  <div>
    <nav v-if="showMenu" ref="component" :style="{ top: `${pos.y}px`, left: `${pos.x}px` }" class="absolute">
      <ul class="border border-bg-border bg-bg rounded">
        <li v-for="action in props.actions" :key="action.label">
          <button class="p-4 w-full text-left text-text-primary hover:bg-bg-hover" @click.stop="handleClickAction(action)">
            {{ action.label }}
          </button>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup lang="ts">
  const props = defineProps<{
    targetId: string;
    actions: ContextMenuConfig[];
  }>();

export interface ContextMenuConfig {
  label: string;
  action: () => void;
}

const showMenu = ref(false)
const pos = ref({ x: 0, y: 0 })
const component = ref<HTMLElement | null>(null)

const handleClickAction = (config: ContextMenuConfig) => {
  showMenu.value = false
  config.action();
}

const onPageClick = () => {
  showMenu.value = false
}

const onContextMenu = (event: MouseEvent) => {
  const targetEl = document.getElementById(props.targetId);
  if (targetEl && event.composedPath().includes(targetEl)) {
    event.preventDefault();
    pos.value = { x: event.clientX, y: event.clientY }
    showMenu.value = true     
  }
}

onMounted(() => {
  window.addEventListener('click', onPageClick)
  window.addEventListener('contextmenu', onContextMenu)
})

onBeforeUnmount(() => {
  window.removeEventListener('click', onPageClick)
  window.removeEventListener('contextmenu', onContextMenu)
})
</script>
