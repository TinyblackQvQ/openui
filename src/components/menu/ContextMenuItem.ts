export interface ContextMenuItem {
  label: string
  icon?: string
  onClick?: () => void
  submenu?: ContextMenuItem[]
  style?: string
  disabled?: boolean
}
