import { ref } from "vue"

const ImageViewerFileHandler = {
  current: ref<FileSystemFileHandle | null>(null),
  open: async (fileHandle: FileSystemFileHandle) => {
    ImageViewerFileHandler.current.value = fileHandle
  },
  read: async () => {
    const file = await ImageViewerFileHandler.current.value?.getFile()
    const blob = await file?.arrayBuffer()
    return blob
  },
}

export default ImageViewerFileHandler
