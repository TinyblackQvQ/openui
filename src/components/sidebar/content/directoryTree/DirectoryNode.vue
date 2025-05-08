<template>
  <div @contextmenu.prevent="onMenuOpenup">
    <div v-if="props.handler?.kind == 'directory'">
      <div class="directory-node" v-on:click="onDirectoryLeftClick">
        <div :class="['directory-name', props.isTopDirectory ? 'directory-name-top' : '']">
          <Down
            class="directory-icon"
            :class="{
              'directory-icon-folded': isDirectoryFolded,
              'directory-icon-unfolded': !isDirectoryFolded,
            }"
            theme="outline"
            size="16"
            fill="#333"
          />
          <span>{{ props.handler.name }}</span>
        </div>
        <div
          class="sub-directory"
          v-show="isTopDirectory ? !isDirectoryFolded : true"
          :style="{
            height: `${isTopDirectory ? '100%' : isDirectoryFolded ? '0px' : `${subDirectoryHeight}px`}`,
            transition: `height ${isTopDirectory ? 0 : Math.min(2, Math.log10(subDirectoryHeight / 48 + 1))}s`,
          }"
        >
          <DirectoryNode
            v-for="item in subHandles"
            :key="item.handler.name"
            :handler="item.handler"
            v-on:on-open-directory="onOpenDirectory"
          />
        </div>
      </div>
    </div>
    <div v-else-if="props.handler?.kind == 'file'" :style="{ paddingLeft: `8px` }">
      <div class="file-node" v-on:click="onFileLeftClick">
        <span>{{ props.handler.name }}</span>
      </div>
    </div>
    <div v-else>
      <div class="unknown-node">
        <span>Unknown Node</span>
      </div>
    </div>
    <ContextMenu
      :is-menu-showup="isMenuShowup"
      :menu-items="menuItems"
      :menu-position="menuPosition"
      v-on:close-menu="isMenuShowup = false"
    />
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import { Down } from '@icon-park/vue-next'
import TextEditerFileHandler from '@/components/content/text_editer/textEditerFileHandler'
import ImageViewerFileHandler from '@/components/content/image_viewer/imageViewerFileHandler'
import ContextMenu from '@/components/menu/ContextMenu.vue'
import type { ContextMenuItem } from '@/components/menu/ContextMenuItem'

interface DirectoryNodeProps {
  handler: FileSystemHandle
  placeholder: number
}

const props = defineProps({
  handler: FileSystemHandle,
  isTopDirectory: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits<{
  (e: 'onOpenFile', handler: FileSystemFileHandle): void
  (e: 'onOpenDirectory', handler: FileSystemDirectoryHandle, node_count: number): void
}>()

const subHandles = ref<DirectoryNodeProps[]>([])
const isDirectoryFolded = ref(true)
const subDirectoryHeight = ref(0)
const thisPlaceholder = ref(1)

const menuItems: Array<ContextMenuItem> = [
  { label: '设为输出文件夹', onClick: () => {} },
  {
    label: '打开文件',
    onClick: () => {
      emits('onOpenFile', props.handler as FileSystemFileHandle)
    },
  },
  { label: '重命名', onClick: () => {} },
  { label: '删除', onClick: () => {} },
  { label: '新建文件夹', onClick: () => {} },
  { label: '新建文件', onClick: () => {} },
  { label: '复制', onClick: () => {} },
  { label: '粘贴', onClick: () => {} },
  { label: '剪切', onClick: () => {} },
]
const isMenuShowup = ref(false)
const menuPosition = ref({ x: 0, y: 0 })

const onMenuOpenup = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  isMenuShowup.value = true
  menuPosition.value = { x: event.clientX, y: event.clientY }
}

// 点击文件节点时触发的事件
// 如果是图片文件，则打开图片查看器
// 如果是文本文件，则打开文本编辑器
const onFileLeftClick = (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()
  const fileHandle = props.handler as FileSystemFileHandle
  fileHandle.getFile().then((file) => {
    if (file.type.includes('image'))
      ImageViewerFileHandler.open(props.handler as FileSystemFileHandle)
    else TextEditerFileHandler.open(props.handler as FileSystemFileHandle)
  })
}

// 点击目录节点时触发的事件
// 如果是目录，则展开或折叠目录
const onDirectoryLeftClick = async (event: MouseEvent) => {
  event.preventDefault()
  event.stopPropagation()

  if (props.handler?.kind !== 'directory') return

  isDirectoryFolded.value = !isDirectoryFolded.value

  if (!isDirectoryFolded.value) {
    await openDirectory()
  }

  emits(
    'onOpenDirectory',
    props.handler as FileSystemDirectoryHandle,
    isDirectoryFolded.value ? 1 : thisPlaceholder.value,
  )
}

// 监听子项的 onOpenDirectory 事件，更新子项的占位符值
const onOpenDirectory = (handler: FileSystemHandle | undefined, node_count: number) => {
  if (handler == null || handler.kind === 'file') return
  const searchResultHandler = subHandles.value.find((item) => item.handler === handler)
  if (searchResultHandler) {
    searchResultHandler.placeholder = node_count
  }
  refreshDirectoryHeight()
  refreshPlaceholder()
  emits(
    'onOpenDirectory',
    props.handler as FileSystemDirectoryHandle,
    isDirectoryFolded.value ? 1 : thisPlaceholder.value,
  )
}

/**
 * 打开目录，获取目录下的所有子项并更新子项列表和占位符值
 */
async function openDirectory() {
  subHandles.value = []
  if (props.handler == null) return
  if (props.handler.kind === 'directory') {
    for await (const value of props.handler.values()) {
      subHandles.value.push({ handler: value, placeholder: 1 })
    }
    refreshPlaceholder()
  }
  refreshDirectoryHeight()
}

/**
 * 刷新目录高度
 */
async function refreshDirectoryHeight() {
  let height = 0
  for (const item of subHandles.value) {
    height += 20 * item.placeholder
  }
  subDirectoryHeight.value = height
}
/**
 * 刷新占位符值
 * 用于计算当前目录下的子项数量，包括子目录和文件
 */
function refreshPlaceholder() {
  let placeholder = 1
  for (const item of subHandles.value) {
    placeholder += item.placeholder
  }
  thisPlaceholder.value = placeholder
}
</script>
<style lang="less" scoped>
@import '@/assets/themes/variables.less';

.directory-node {
  display: flex;
  flex-direction: column;
  align-items: left;
  cursor: pointer;
  user-select: none;
}
.directory-name {
  display: flex;
  align-items: center;
  top: 0px;
  background-color: @color-bg-default;
  z-index: 0;
  span {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
}
.directory-name-top {
  position: sticky;
  top: 0px;
  background-color: @color-bg-emphasis;
  z-index: 1;
  border-bottom: solid 1px @color-border-default;
}
.directory-icon {
  width: 16px;
  height: 16px;
  margin: 0px 4px;
  transition: all 0.2s ease-in-out;
}
.directory-icon-folded {
  rotate: -90deg;
}
.directory-icon-unfolded {
  rotate: 0deg;
}
.sub-directory {
  display: flex;
  flex-direction: column;
  align-items: left;
  margin-left: 8px;
  transition: ease-out;
  overflow: hidden;
}
</style>
