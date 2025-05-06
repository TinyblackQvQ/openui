<!--
  OpenProjectInstruction.vue
  @Author:
  @Date: 23
  @Description: ...
-->

<template>
  <div>
    <h1>Open Project Instruction</h1>
    <p>To open a project, please follow these steps:</p>
    <ol>
      <li>Click on the "Open Project" button.</li>
      <li>Select the project directory you want to open.</li>
      <li>Click "Open" to load the project.</li>
    </ol>
    <p>If you have any issues, please refer to the documentation or contact support.</p>
    <button @click="ProjectDirectory.request">Open Project</button>
  </div>
</template>

<script setup lang="ts">
import ProjectDirectory from '../sidebar/content/directoryTree/projectDirectory';
</script>

<style lang="less" scoped>

</style>
