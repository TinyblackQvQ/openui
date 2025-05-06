<!-- eslint-disable @typescript-eslint/no-unused-vars -->
<script setup lang="ts">
interface ApiRequirement {
  [module: { name: string; description: string; contains: string[] }]
}

const apiRequirement: ApiRequirement = {
  fileSystem: {
    name: 'File System',
    description: 'Provides an API for interacting with the file system.',
    contains: ['showDirectoryPicker', 'showOpenFilePicker', 'showSaveFilePicker'],
  },
}

function apiCheck(requirement: ApiRequirement) {
  const missingApis = []

  for (const [moduleName, module] of Object.entries(requirement)) {
    const missing = module.contains.filter((api) => !isApiAvailable(api))
    if (missing.length > 0) {
      missingApis.push({
        module: moduleName,
        missing: missing,
      })
    }
  }

  if (missingApis.length > 0) {
    window.alert(
      '浏览器兼容性问题: \n' +
      `浏览器版本不支持以下Api： ${JSON.stringify(missingApis)}；请使用受支持的浏览器版本。`,
    )
  }
}
</script>

<template>
  <div class="api-checker"></div>
</template>

<style lang="less" scoped>
.api-checker {
  display: none;
}
</style>
