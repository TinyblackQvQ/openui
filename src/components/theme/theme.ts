const themes = {
  light: import('@/assets/themes/default_light.less?inline'),
  dark: import('@/assets/themes/default_dark.less?inline'),
}

let currentThemeLink: HTMLStyleElement | null = null

export function useTheme() {
  let currentTheme = 'light'
  const loadFromLocal = () => {
    const theme = localStorage.getItem('local-theme')
    if (theme) {
      setTheme(theme as keyof typeof themes)
    } else {
      setTheme('light')
    }
  }

  const setTheme = async (themeName: keyof typeof themes) => {
    // 移除旧主题
    if (currentThemeLink) {
      document.head.removeChild(currentThemeLink)
    }

    // 添加新主题
    const theme = await themes[themeName]
    const style = document.createElement('style')
    style.innerHTML = theme.default
    document.head.appendChild(style)
    currentThemeLink = style

    // 设置HTML属性用于CSS选择
    document.documentElement.setAttribute('data-theme', themeName)
    currentTheme = themeName
    localStorage.setItem('local-theme', themeName)
  }

  return { currentTheme, setTheme, loadFromLocal }
}

// 初始化主题
useTheme().loadFromLocal()
