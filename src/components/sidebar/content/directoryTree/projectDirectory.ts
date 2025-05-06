import { ref } from 'vue'

const ProjectDirectory = {
  current: ref<FileSystemDirectoryHandle | undefined>(),
  request: async () => {
    ProjectDirectory.current.value = await window.showDirectoryPicker()
    console.log('ProjectDirectory.current', ProjectDirectory.current)
    ProjectDirectory.current.value?.requestPermission({mode: 'readwrite'})
  },
}

export default ProjectDirectory
