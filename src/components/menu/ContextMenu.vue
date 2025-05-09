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
      :style="{ left: menuPosition.x + 'px', top: menuPosition.y + 'px' }"
      ref="containerRef"
      @contextmenu.prevent.capture="handleClickOutside"
    >
      <div
        class="menu-item"
        v-for="item in menuItems"
        :key="item.label"
        v-on:click.prevent.stop="handleItemClick(item)"
        :style="item.style"
        @mouseenter="showSubmenu(item, $event)"
        @contextmenu.stop=""
      >
        {{ item.label }}
        <span class="arrow" v-if="item.children">▶</span>

        <!-- 新增子菜单 -->
        <ContextMenu
          v-if="item.children"
          :menu-items="item.children"
          :is-menu-showup="activeSubmenu === item"
          :menu-position="submenuPosition"
          :z-index="zIndex + 1"
          @closeMenu="activeSubmenu = null"
        />
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref, type PropType } from 'vue'
import type { ContextMenuItem } from './ContextMenuItem'

const containerRef = ref<HTMLDivElement>()
// 定义 prop 和 emits
const props = defineProps({
  menuItems: Array<ContextMenuItem>,
  isMenuShowup: Boolean,
  menuPosition: {
    type: Object as PropType<{ x: number; y: number }>,
    default: () => ({ x: 0, y: 0 }),
  },
  zIndex: {
    type: Number,
    default: 9999,
  },
})

const emits = defineEmits(['closeMenu'])

const activeSubmenu = ref<ContextMenuItem | null>(null)
const submenuPosition = ref({ x: 0, y: 0 })

const showSubmenu = (item: ContextMenuItem, event: MouseEvent) => {
  if (!item.children) return

  const rect = (event.currentTarget as HTMLElement).getBoundingClientRect()
  submenuPosition.value = {
    x: rect.right + 2,
    y: rect.top - 8,
  }
  activeSubmenu.value = item
}

const handleClickOutside = (event: MouseEvent) => {
  if (!containerRef.value?.contains(event.target as Node)) {
    emits('closeMenu')
  }
}

const handleItemClick = (item: ContextMenuItem) => {
  if (item.onClick == null) return
  if (item.children != null) {
    showSubmenu(item, event as MouseEvent)
    return
  }
  item.onClick()
  emits('closeMenu')
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
  position: relative;
  padding: 8px 16px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
  color: #606266;
}

.arrow {
  margin-left: 20px;
  font-size: 12px;
  color: #999;
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
