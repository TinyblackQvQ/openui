import { ref } from 'vue'

const fileExtensionMap: Record<string, string> = {
  '.html': 'html',
  '.css': 'css',
  '.js': 'javascript',
  '.ts': 'typescript',
  '.md': 'markdown',
  '.txt': 'plaintext',
  '.vue': 'vue',
  '.json': 'json',
  '.java': 'java',
  '.py': 'python',
  '.cpp': 'cpp',
  '.c': 'c',
  '.go': 'go',
  '.rb': 'ruby',
  '.kt': 'kotlin',
  '.php': 'php',
  '.sql': 'sql',
  '.xml': 'xml',
  '.yaml': 'yaml',
  '.yml': 'yaml',
  '.ini': 'ini',
  '.toml': 'toml',
  '.sh': 'bash',
  '.zsh': 'zsh',
  '.ps1': 'powershell',
  '.cmd': 'command',
  '.bat': 'batch',
  '.pl': 'perl',
  '.lua': 'lua',
}

const TextEditerFileHandler = {
  current: ref<FileSystemFileHandle | null>(null),
  mimeType: async () => {
    const fileHandle = TextEditerFileHandler.current.value
    if (fileHandle) {
      const file = await fileHandle.getFile()
      return file.type
    }
    return ''
  },
  language: async () => {
    const fileHandle = TextEditerFileHandler.current.value
    if (fileHandle) {
      const fileName = fileHandle.name
      const fileExtension = fileName.substring(fileName.lastIndexOf('.'))
      return fileExtensionMap[fileExtension] || 'plaintext'
    }
    return 'plaintext'
  },
  open: async (fileHandle: FileSystemFileHandle) => {
    TextEditerFileHandler.current.value = fileHandle
  },
  read: async () => {
    const file = await TextEditerFileHandler.current.value?.getFile()
    return file?.text()
  },
  save: async (text: string, offset: number = 0) => {
    TextEditerFileHandler.current.value?.createWritable().then((stream) => {
      stream.seek(offset)
      stream.write(text)
      stream.close()
    })
  },
  close: async () => {
    TextEditerFileHandler.current.value = null
  },
}

export default TextEditerFileHandler
