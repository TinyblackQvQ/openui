<!--
  ImageViewer.vue
  @Author: CURRENT_USER
  @Date: 06
  @Description: 基于 canvas 的图片查看器，支持拖拽、移动和缩放
-->

<template>
  <div ref="containerRef" class="image-viewer-container">
    <canvas ref="canvasRef" class="image-canvas"></canvas>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import ImageViewerFileHandler from './imageViewerFileHandler'

const containerRef = ref<HTMLDivElement>()
const canvasRef = ref<HTMLCanvasElement>()
let ctx: CanvasRenderingContext2D | null = null
let image: ImageBitmap | null = null

let scale = 1
let offsetX = 0
let offsetY = 0
let isDragging = false
let lastX = 0
let lastY = 0

watch(ImageViewerFileHandler.current, async (newValue: FileSystemFileHandle | null) => {
  if (newValue) {
    await loadImage()
  }
})

const resetLayout = () => {
  if (canvasRef.value && image) {
    canvasRef.value.width = containerRef.value?.clientWidth || 0
    canvasRef.value.height = containerRef.value?.clientHeight || 0
  }
}

// 初始化 canvas
const initCanvas = () => {
  if (!canvasRef.value || !containerRef.value) return
  ctx = canvasRef.value.getContext('2d')
  drawImage()
}

// 加载图片
const loadImage = async () => {
  const file = await ImageViewerFileHandler.current.value?.getFile()
  if (!file) return
  image = await window.createImageBitmap(file)
}

// 绘制图片
const drawImage = () => {
  if (!ctx || !image || !canvasRef.value) return
  resetLayout()
  ctx.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  ctx.save()
  ctx.translate(offsetX, offsetY)
  ctx.scale(scale, scale)
  ctx.drawImage(image, 0, 0)
  ctx.restore()
}

// 重置视图
const resetView = () => {
  if (!image || !canvasRef.value) return

  scale = 1
  offsetX = (canvasRef.value.width - image.width) / 2
  offsetY = (canvasRef.value.height - image.height) / 2
}

// 处理鼠标按下事件
const handleMouseDown = (e: MouseEvent) => {
  isDragging = true
  lastX = e.clientX - offsetX
  lastY = e.clientY - offsetY
}

// 处理鼠标移动事件
const handleMouseMove = (e: MouseEvent) => {
  if (!isDragging || !canvasRef.value) return

  offsetX = e.clientX - lastX
  offsetY = e.clientY - lastY
  drawImage()
}

// 处理鼠标释放事件
const handleMouseUp = () => {
  isDragging = false
}

// 处理鼠标滚轮事件
const handleWheel = (e: WheelEvent) => {
  if (!canvasRef.value) return

  const oldScale = scale
  scale *= e.deltaY > 0 ? 0.9 : 1.1
  scale = Math.max(0.5, Math.min(5, scale))

  const factor = scale / oldScale
  offsetX = e.clientX - (e.clientX - offsetX) * factor
  offsetY = e.clientY - (e.clientY - offsetY) * factor

  drawImage()
}

onMounted(() => {
  initCanvas()
  loadImage()
  if (containerRef.value) {
    containerRef.value.onresize = () => {
      resetLayout()
      drawImage()
    }
  }

  if (canvasRef.value) {
    canvasRef.value.addEventListener('mousedown', handleMouseDown)
    canvasRef.value.addEventListener('mousemove', handleMouseMove)
    canvasRef.value.addEventListener('mouseup', handleMouseUp)
    canvasRef.value.addEventListener('mouseleave', handleMouseUp)
    canvasRef.value.addEventListener('wheel', handleWheel)
  }
})

onUnmounted(() => {
  if (canvasRef.value) {
    canvasRef.value.removeEventListener('mousedown', handleMouseDown)
    canvasRef.value.removeEventListener('mousemove', handleMouseMove)
    canvasRef.value.removeEventListener('mouseup', handleMouseUp)
    canvasRef.value.removeEventListener('mouseleave', handleMouseUp)
    canvasRef.value.removeEventListener('wheel', handleWheel)
  }
})
</script>

<style lang="less" scoped>
.image-viewer-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.image-canvas {
  width: 100%;
  height: 100%;
  cursor: move;
}
</style>
