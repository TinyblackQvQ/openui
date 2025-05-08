<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<!--
  ImageViewer.vue
  @Author: CURRENT_USER
  @Date: 06
  @Description:
-->

<template>
  <div
    ref="containerRef"
    v-on:mousedown="handleMouseDown"
    v-on:mouseup="handleMouseUp"
    v-on:mousemove="handleMouseMove"
    v-on:wheel="handleMouseWheel"
    class="image-viewer-container"
  >
    <img ref="imageEle" :src="imageSrc" alt="" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import ImageViewerFileHandler from './imageViewerFileHandler'
import Vector2 from './render/Vector2'

const containerRef = ref<HTMLDivElement>()
const imageEle = ref<HTMLImageElement>()
const imageSrc = ref<string | undefined>()

let lastContainerSize: { width: number; height: number } | null = null
let isDragging = false
let lastMousePosition: Vector2 | null = null

const imageTransformer = {
  position: new Vector2(0, 0),
  anchor: new Vector2(0.5, 0.5),
  scale: 1,
  rotation: 0,
}

const keyStates = {
  space: false,
  ctrl: false,
  alt: false,
  shift: false,
}

watch(ImageViewerFileHandler.current, async (newValue: FileSystemFileHandle | null) => {
  if (newValue) {
    imageSrc.value = URL.createObjectURL(await newValue.getFile())
  }
})

onMounted(() => {
  if (containerRef.value) {
    lastContainerSize = {
      width: containerRef.value.offsetWidth,
      height: containerRef.value.offsetHeight,
    }
    containerRef.value.addEventListener('resize', handleResize)
    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
  }
})

onUnmounted(() => {
  if (containerRef.value) {
    containerRef.value.removeEventListener('resize', handleResize)
    window.removeEventListener('keydown', handleKeyDown)
    window.removeEventListener('keyup', handleKeyUp)
  }
})

const updateImagePosition = (
  targetPosition: { x: number; y: number } | null = null,
  scaleParams: { factor: number; center: { x: number; y: number } | null } | null = null,
) => {
  if (containerRef.value && imageEle.value) {
    const currentContainerSize = {
      width: containerRef.value.offsetWidth,
      height: containerRef.value.offsetHeight,
    }
    const imageSize = {
      width: imageEle.value.naturalWidth * imageTransformer.scale,
      height: imageEle.value.naturalHeight * imageTransformer.scale,
    }

    if (currentContainerSize != lastContainerSize) {
      // 计算缩放因子
      const scaleFactorX = currentContainerSize.width / lastContainerSize!.width
      const scaleFactorY = currentContainerSize.height / lastContainerSize!.height
      const scaleFactor = Math.min(scaleFactorX, scaleFactorY)
      // 更新缩放
      imageTransformer.scale *= scaleFactor
      // 更新位置
      imageTransformer.position.x *= scaleFactor
      imageTransformer.position.y *= scaleFactor
      // 更新容器大小
      lastContainerSize = currentContainerSize
    }

    // 更新位置
    if (targetPosition) {
      imageTransformer.position.x =
        (currentContainerSize.width - imageSize.width) * targetPosition.x -
        imageSize.width * imageTransformer.anchor.x
      imageTransformer.position.y =
        (currentContainerSize.height - imageSize.height) * targetPosition.y -
        imageSize.height * imageTransformer.anchor.y
    }

    // 更新缩放
    if (scaleParams) {
      const oldScale = imageTransformer.scale
      imageTransformer.scale = scaleParams.factor

      if (scaleParams.center) {
        // 获取容器在视口中的位置
        const containerRect = containerRef.value.getBoundingClientRect()

        // 计算鼠标在容器内的相对坐标
        const mouseX = scaleParams.center.x - containerRect.left
        const mouseY = scaleParams.center.y - containerRect.top

        // 计算鼠标点在当前缩放下的图片局部坐标
        const imageLocalX = (mouseX - imageTransformer.position.x) / oldScale
        const imageLocalY = (mouseY - imageTransformer.position.y) / oldScale

        // 计算新的位置使该点保持固定
        imageTransformer.position.x = mouseX - imageLocalX * imageTransformer.scale
        imageTransformer.position.y = mouseY - imageLocalY * imageTransformer.scale
      }
    }

    // 应用样式
    imageEle.value.style.transform = `translate(${imageTransformer.position.x}px, ${imageTransformer.position.y}px) rotate(${imageTransformer.rotation}deg)`
    imageEle.value.style.scale = `${imageTransformer.scale}`
  }
}

const updateCursor = () => {
  if (containerRef.value) {
    if (isDragging && keyStates.space) {
      containerRef.value.style.cursor = 'grabbing'
    } else if (keyStates.alt) {
      containerRef.value.style.cursor = 'zoom-in'
    } else if (keyStates.space) {
      containerRef.value.style.cursor = 'grab'
      if (imageEle.value) {
        imageEle.value.style.transition = 'none'
      }
    } else if (keyStates.ctrl) {
      containerRef.value.style.cursor = 'unset'
    } else if (keyStates.shift) {
      containerRef.value.style.cursor = 'ew-resize'
    } else if (isDragging) {
      containerRef.value.style.cursor = 'unset'
    } else {
      containerRef.value.style.cursor = 'ns-resize'
      if (imageEle.value) {
        imageEle.value.style.transition = 'all 0.2s ease'
      }
    }
  }
}

const handleResize = () => {
  updateImagePosition()
}

const handleKeyDown = (event: KeyboardEvent) => {
  switch (event.key) {
    case ' ':
      event.preventDefault()
      keyStates.space = true
      break
    case 'Control':
      event.preventDefault()
      keyStates.ctrl = true
      break
    case 'Alt':
      event.preventDefault()
      keyStates.alt = true
      break
    case 'Shift':
      event.preventDefault()
      keyStates.shift = true
      break
  }
  updateCursor()
}

const handleKeyUp = (event: KeyboardEvent) => {
  switch (event.key) {
    case ' ':
      keyStates.space = false
      break
    case 'Control':
      keyStates.ctrl = false
      break
    case 'Alt':
      keyStates.alt = false
      break
    case 'Shift':
      keyStates.shift = false
      break
  }
  updateCursor()
}

const handleMouseDown = (event: MouseEvent) => {
  event.preventDefault()
  if (event.button === 0) {
    isDragging = true
    updateCursor()
    if (keyStates.space) {
      lastMousePosition = new Vector2(event.clientX, event.clientY)
    }
  }
}

const handleMouseUp = () => {
  isDragging = false
  lastMousePosition = null
  updateCursor()
}

const handleMouseMove = (event: MouseEvent) => {
  if (isDragging && keyStates.space && lastMousePosition && containerRef.value) {
    const currentMousePosition = new Vector2(event.clientX, event.clientY)
    const delta = currentMousePosition.subtract(lastMousePosition)
    imageTransformer.position = imageTransformer.position.add(delta)
    lastMousePosition = currentMousePosition
    updateImagePosition()
  }
}

const handleMouseWheel = (event: WheelEvent) => {
  event.preventDefault()
  if (keyStates.alt) {
    let scaleFactor = imageTransformer.scale
    scaleFactor *= event.deltaY > 0 ? 0.9 : 1.1
    const center = { x: event.clientX, y: event.clientY }
    updateImagePosition(null, { factor: scaleFactor, center })
  } else if (keyStates.shift) {
    imageTransformer.position.x += event.deltaY
    updateImagePosition()
  } else {
    imageTransformer.position.y -= event.deltaY
    updateImagePosition()
  }
}
</script>

<style lang="less" scoped>
.image-viewer-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;
  user-select: none;
}

img {
  position: absolute;
  transform-origin: 0 0;
  user-select: none;
}
</style>
