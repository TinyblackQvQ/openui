import type { StyleValue } from "vue"

export interface ContextMenuItem {
  label: string
  icon?: string
  onClick?: () => void
  style?: StyleValue
  disabled?: boolean
  children?: ContextMenuItem[]
}
