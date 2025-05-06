<!--
  MainSidebar.vue
  @Author: CURRENT_USER
  @Date: 30
  @Description: ...
-->

<template>
  <div id="sidebar">
    <div id="sidebar-above">
      <div id="sidebar-controller" ref="controllerElement">
        <!-- 动态渲染侧边栏控制器 -->
        <component
          v-for="controller in SidebarController.controllers"
          :key="controller.content"
          :is="getIconComponent(controller.content)"
          class="sidebar-controller-entry"
          theme="outline"
          size="32"
          fill="#333"
          :id="controller.entryIcon"
          @click="onControllerClick(controller)"
        />
      </div>
      <div id="sidebar-content" ref="contentElement">
        <DirectoryNode
          class="sidebar-content-node"
          :handler="ProjectDirectory.current.value"
          :is-top-directory="true"
          :id="SidebarContent.FileExplorer"
        />
      </div>
    </div>
    <div id="sidebar-footer">
      <ThemeSwitch />
    </div>
  </div>
</template>

<script setup lang="ts">
import ThemeSwitch from '@/components/theme/ThemeManager.vue'
import DirectoryNode from '@/components/sidebar/content/directoryTree/DirectoryNode.vue'
import { FileEditingOne, Comments, Setting } from '@icon-park/vue-next'
import { onMounted, ref } from 'vue'
import { SidebarContent, SidebarController, type SidebarControllerObject } from './sidebarController'
import ProjectDirectory from './content/directoryTree/projectDirectory'

const controllerElement = ref<HTMLDivElement | null>(null)
const contentElement = ref<HTMLDivElement | null>(null)

// 根据侧边栏内容获取对应的图标组件
const getIconComponent = (content: SidebarContent) => {
  switch (content) {
    case SidebarContent.FileExplorer:
      return FileEditingOne;
    case SidebarContent.Chat:
      return Comments;
    case SidebarContent.Settings:
      return Setting;
    default:
      return null;
  }
}

const onControllerClick = (controller: SidebarControllerObject) => {
  controllerElement.value?.childNodes.forEach((item) => {
    if (!(item instanceof HTMLDivElement)) return
    if (item.id === controller.entryIcon) {
      item.classList.add('sidebar-controller-entry-active')
    } else {
      item.classList.remove('sidebar-controller-entry-active')
    }
  })
  contentElement.value?.childNodes.forEach((item) => {
    if (!(item instanceof HTMLDivElement)) return
    if (item.id === controller.content) {
      item.style.display = 'block'
    } else {
      item.style.display = 'none'
    }
  })
}

onMounted(() => {
  onControllerClick(SidebarController.controllers[0])
})
</script>

<style lang="less">
@import '@/assets/themes/variables.less';
@controller_width: 60px;
@sidebar-footer-height: 4%;

#sidebar {
  position: relative;
  top: 0px;
  left: 0px;
  width: 300px;
  min-width: 300px;
  height: 100%;
  background-color: @color-bg-default;
  display: flex;
  flex-direction: column;
  #sidebar-above {
    position: relative;
    top: 0px;
    left: 0px;
    width: 100%;
    max-height: 100% - @sidebar-footer-height;
    display: flex;
    flex-direction: row;
    flex: 1;
    #sidebar-controller {
      position: relative;
      top: 0px;
      left: 0px;
      width: @controller_width;
      height: 100%;
      display: flex;
      flex-direction: column;
      border-right: solid 1px @color-border-default;
      background-color: @color-bg-dimmed;
      .sidebar-controller-entry {
        width: @controller_width;
        height: @controller_width;
        display: flex;
        align-items: center;
        justify-content: center;
        border-bottom: solid 1px @color-border-default;
        cursor: pointer;

        svg {
          padding-left: 0px;
          transition: all 0.2s ease;
        }
      }
      .sidebar-controller-entry:hover {
        svg {
          padding-left: 10px;
        }
      }
      .sidebar-controller-entry-active {
      }
    }
    #sidebar-content {
      position: relative;
      top: 0px;
      width: 100%;
      height: 100%;
      overflow: auto;
      .sidebar-content-node {
        display: none;
      }
    }
  }
  #sidebar-footer {
    position: relative;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: left;
    border-top: solid 1px @color-border-default;
    background-color: @color-bg-dimmed;
  }
}
</style>
