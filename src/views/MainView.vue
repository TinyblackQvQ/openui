<script setup lang="ts">
import Sidebar from '@/components/sidebar/MainSidebar.vue'
import OpenProjectInstruction from '@/components/project_guide/OpenProjectInstruction.vue'
import ProjectDirectory from '@/components/sidebar/content/directoryTree/projectDirectory'
import ContentNavigation from '@/components/content/ContentNavigation.vue'
import TextEditer from '@/components/content/text_editer/TextEditer.vue'
import ImageViewer from '@/components/content/image_viewer/ImageViewer.vue'
import ResizableContainer from '@/components/ResizableContainer.vue'
import ChatDialogue from '@/components/content/dialogue/ChatDialogue.vue'

const initialItems = [
  { visible: true, width: 300 },
  { visible: true, width: 0 },
  { visible: true, width: 0 },
]
</script>

<template>
  <main>
    <OpenProjectInstruction v-if="ProjectDirectory.current.value == undefined" />
    <div v-else class="main">
      <Sidebar />
      <div id="content-top">
        <ResizableContainer id="content" :initial-items="initialItems">
          <template #content0><TextEditer /></template>
          <template #content1><ImageViewer /></template>
          <template #content2><ChatDialogue /></template>
        </ResizableContainer>
        <ContentNavigation id="content-navigation" />
      </div>
    </div>
  </main>
</template>

<style scoped lang="less">
.main {
  position: relative;
  display: flex;
  flex-direction: row;
  height: 100%;
  width: 100%;
  #content-top {
    flex: 1;
    position: relative;
    display: flex;
    flex-direction: column;
    height: 100%;
    width: 100%;
  }
  #content-navigation {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 60px;
    width: 100%;
    border-top: 1px solid var(--color-border-default);
  }
  #content {
    position: relative;
    display: flex;
    flex-direction: row;
    height: 100%;
    width: 100%;
  }
}
</style>
