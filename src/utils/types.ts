import type { FontAwesomeIconProps } from "@fortawesome/vue-fontawesome"
import type { DefineComponent } from "vue"

export type IconType = {
  iconComponent: DefineComponent<FontAwesomeIconProps>
  iconProps: FontAwesomeIconProps
}