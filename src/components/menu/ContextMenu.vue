<!--
  ContextMenu.vue
  @Author: CURRENT_USER
  @Date: 08
  @Description: ...
-->

<template>
  <Transition name="menu">
    <div
      class="context-menu"
      v-show="isMenuShowup"
      :style="{ left: menuPosition.x, top: menuPosition.y }"
      ref="containerRef"
    >
      <div class="menu-item" v-for="item in menuItems" :key="item.label" v-on:click="handleItemClick(item)">
        {{ item.label }}
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, type PropType } from 'vue'
import type { ContextMenuItem } from './ContextMenuItem'

const containerRef = ref<HTMLDivElement>()

const props = defineProps({
  menuItems: Array<ContextMenuItem>,
  isMenuShowup: Boolean,
  menuPosition: {
    type: Object as PropType<{ x: number; y: number }>,
    default: () => ({ x: 0, y: 0 }),
  },
})

const emit = defineEmits(['closeMenu'])

const handleClickOutside = (event: MouseEvent) => {
  if (containerRef.value && !containerRef.value.contains(event.target as Node)) {
    emit('closeMenu')
  }
}

const handleItemClick = (item: ContextMenuItem) => {
  if (item.onClick == null) return
  item.onClick()
  emit('closeMenu')
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<style lang="less" scoped>
/* 菜单容器 */
.context-menu {
  position: fixed;
  background: white;
  border: 1px solid #e4e7ed;
  border-radius: 4px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
  padding: 6px 0;
  z-index: 9999;
  min-width: 160px;
}

/* 菜单项样式 */
.menu-item {
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
  color: #606266;
}

.menu-item:hover {
  background: #f5f7fa;
}

/* 展开动画 */
.menu-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s cubic-bezier(0.22, 0.61, 0.36, 1);
}

.menu-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s cubic-bezier(0.55, 0.06, 0.68, 0.19);
}

.menu-enter-from,
.menu-leave-to {
  opacity: 0;
  transform: scale(0.95) translateY(-10px);
}
</style>
