<!--
  ChatBubble.vue
  @Author: CURRENT_USER
  @Date: 09
  @Description: ...
-->

<template>
  <div class="chat-bubble" :style="{ left: isUser ? '' : '0%', right: isUser ? '0%' : '' }">
    {{ marked.parse(message) }}
  </div>
</template>

<script setup lang="ts">
import { marked } from 'marked';
const props = defineProps({
  message: {
    type: String,
    required: true,
  },
  isUser: {
    type: Boolean,
    required: true,
  },
})
</script>

<style lang="less" scoped>
.chat-bubble {
  display: inline-block;
  padding: 8px 12px;
  border-radius: 16px;
}
</style>
