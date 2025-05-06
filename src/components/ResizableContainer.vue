<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<template>
  <div class="resizable-container" ref="container">
    <div
      v-for="(item, index) in items"
      :key="index"
      v-show="item.visible"
      ref="elements"
      :class="['resizable-element', item.className]"
      :style="{ width: `${item.width}px` }"
    >
      <slot :name="`content${index}`"></slot>
      <div class="resizer" v-if="index < items.length - 1" @mousedown="startResize(index)"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onUnmounted, watch } from 'vue';

interface Item {
  visible: boolean;
  width: number;
  className?: string;
}

const props = defineProps<{
  initialItems: Item[];
}>();

const container = ref<HTMLDivElement | null>(null);
const items = ref<Item[]>(props.initialItems);
const elements = ref<HTMLElement[]>([]);

let isResizing = false;
let startX: number = 0;
let startWidths: number[] = [];
let resizeObserver: ResizeObserver | null = null;

// 初始化元素宽度
const initWidths = () => {
  if (container.value) {
    const containerWidth = container.value.offsetWidth;
    const visibleItems = items.value.filter(item => item.visible);
    const totalDefaultWidth = visibleItems.reduce((sum, item) => sum + (item.width || 0), 0);
    const remainingWidth = containerWidth - totalDefaultWidth;
    const remainingItemCount = visibleItems.filter(item => !item.width).length;

    items.value.forEach((item) => {
      if (item.visible) {
        if (!item.width) {
          item.width = remainingItemCount > 0 ? remainingWidth / remainingItemCount : 0;
        }
      }
    });
  }
};

// 按比例调整元素宽度
const adjustWidthsByRatio = () => {
  if (container.value) {
    const containerWidth = container.value.offsetWidth;
    const totalWidth = items.value.filter(item => item.visible).reduce((sum, item) => sum + item.width, 0);
    const ratio = containerWidth / totalWidth;

    items.value.forEach((item) => {
      if (item.visible) {
        item.width *= ratio;
      }
    });
  }
};

// 监听父元素尺寸变化
const setupResizeObserver = () => {
  if (container.value) {
    resizeObserver = new ResizeObserver(() => {
      adjustWidthsByRatio();
    });
    resizeObserver.observe(container.value);
  }
};

// 初始化操作
const init = () => {
  initWidths();
  setupResizeObserver();
};

// 开始拖拽
const startResize = (index: number) => {
  isResizing = true;
  startX = window.event?.clientX || 0;
  startWidths = [items.value[index].width, items.value[index + 1].width];
  document.addEventListener('mousemove', (e) => resize(e, index));
  document.addEventListener('mouseup', stopResize);
};

// 拖拽过程
const resize = (e: MouseEvent, index: number) => {
  if (!isResizing) return;
  const dx = e.clientX - startX;
  const newLeftWidth = startWidths[0] + dx;
  const newRightWidth = startWidths[1] - dx;
  // 限制最小宽度
  if (newLeftWidth > 100 && newRightWidth > 100) {
    items.value[index].width = newLeftWidth;
    items.value[index + 1].width = newRightWidth;
  }
};

// 停止拖拽
const stopResize = () => {
  isResizing = false;
  document.removeEventListener('mousemove', resize as any);
  document.removeEventListener('mouseup', stopResize);
};

// 切换元素显示状态
const toggleVisibility = (index: number) => {
  items.value[index].visible = !items.value[index].visible;
  initWidths();
};

// 组件挂载时初始化
watch(container, (newContainer) => {
  if (newContainer) {
    init();
  }
}, { immediate: true });

// 组件卸载时清理
onUnmounted(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  document.removeEventListener('mousemove', resize as any);
  document.removeEventListener('mouseup', stopResize);
});
</script>

<style scoped lang="less">
.resizable-container {
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
}

.resizable-element {
  flex: 0 0 auto;
  height: 100%;
  overflow: hidden;
  position: relative;
  display: flex;
  flex-direction: row;
}

.resizer {
  position: absolute;
  width: 5px;
  height: 100%;
  top: 0%;
  right: 0%;
  background-color: #ccc;
  cursor: col-resize;
}
</style>
