import { ref } from 'vue'

const ImageViewerFileHandler = {
  current: ref<FileSystemFileHandle | null>(null),
  open: async (fileHandle: FileSystemFileHandle) => {
    ImageViewerFileHandler.current.value = fileHandle
  },
  readBlob: async () => {
    const file = await ImageViewerFileHandler.current.value?.getFile()
    return file
  },
  readBitmap: async () => {
    const blob = await ImageViewerFileHandler.readBlob()
    if (blob) {
      const bitmap = await createImageBitmap(blob)
      return bitmap
    }
    return null
  },
}

export default ImageViewerFileHandler
