<!--
  TextEditer.vue
  @Author: CURRENT_USER
  @Date: 30
  @Description: ...
-->

<template>
  <div class="editer-container">
    <div
      v-if="!editerInstance"
      class="flex-center fill-parent no-select"
    >
      选择一个文件进行编辑
    </div>
    <div ref="editerContainer" id="editer"></div>
  </div>
</template>

<script setup lang="ts">
import * as monaco from 'monaco-editor'
import { ref, toRaw, watch, onMounted, onUnmounted } from 'vue'
import TextEditerFileHandler from './textEditerFileHandler'

const editerContainer = ref<HTMLDivElement>()
const editerInstance = ref<monaco.editor.IStandaloneCodeEditor | null>(null)
let resizeObserver: ResizeObserver | null = null

watch(TextEditerFileHandler.current, async (newValue: FileSystemFileHandle | null) => {
  if (editerContainer.value && newValue) {
    if (editerInstance.value) {
      // 销毁之前的编辑器实例
      toRaw(editerInstance.value).dispose()
    }
    try {
      // 创建新的编辑器实例
      editerInstance.value = monaco.editor.create(editerContainer.value, {
        value: await TextEditerFileHandler.read(),
        language: await TextEditerFileHandler.language(),
      })
      // 监听编辑器内容变化事件，并保存事件销毁函数
      editerInstance.value.onDidChangeModelContent(async () => {
        const content = toRaw(editerInstance.value)?.getModel()?.getValue()
        if (content) {
          await TextEditerFileHandler.save(content)
        }
      })
    } catch (error) {
      console.error('文件操作出错:', error)
    }
  }
})

onMounted(() => {
  if (editerContainer.value) {
    resizeObserver = new ResizeObserver(() => {
      if (editerInstance.value) {
        // 调用 layout 方法更新编辑器布局
        toRaw(editerInstance.value).layout()
      }
    })
    // 开始监听父元素尺寸变化
    resizeObserver.observe(editerContainer.value)
  }
})

onUnmounted(() => {
  if (resizeObserver) {
    // 停止监听并断开 ResizeObserver
    resizeObserver.disconnect()
    resizeObserver = null
  }
  if (editerInstance.value) {
    // 销毁编辑器实例
    toRaw(editerInstance.value).dispose()
  }
})
</script>

<style lang="less" scoped>
.editer-container {
  position: relative;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  flex: 1;
}
#editer {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
