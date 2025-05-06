// 定义侧边栏内容枚举，用于标识不同的侧边栏面板
export enum SidebarContent {
  FileExplorer = 'sidebar-file-explorer',  // 文件资源管理器面板
  Chat = 'sidebar-chat',                   // 聊天面板
  Settings = 'sidebar-settings',            // 设置面板
}

// 侧边栏控制器对象接口，定义每个控制器的结构
export interface SidebarControllerObject {
  entryIcon: string,     // 控制器图标
  content: SidebarContent // 对应的侧边栏内容
}

// 侧边栏控制器实例
const sidebarController = {
  controllers: [] as SidebarControllerObject[], // 控制器数组
  // 注册新的控制器
  register: function (controller: SidebarControllerObject) {
    this.controllers.push(controller)
  },
  // 注销控制器
  unregister: function (controller: SidebarControllerObject) {
    this.controllers = this.controllers.filter((c) => c !== controller)
  },
  // 获取所有控制器信息
  getAllControllers: function (): SidebarControllerObject[] {
    return this.controllers;
  }
}

// 自动注册所有侧边栏内容对应的控制器
for (const item in SidebarContent) {
  sidebarController.register({
    entryIcon: `${item.toLowerCase()}-icon`,  // 生成图标名称
    content: SidebarContent[item as keyof typeof SidebarContent], // 获取对应的侧边栏内容
  })
}

// 导出侧边栏控制器实例
export { sidebarController as SidebarController }
