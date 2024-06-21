import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import type { DefineComponent } from 'vue'

export type IconType = {
  iconComponent: DefineComponent<FontAwesomeIconProps>
  iconProps: FontAwesomeIconProps
}

export type NonArrayKeys<T> = {
  [K in keyof T]: T[K] extends any[] ? never : K
}[keyof T]

export type ArrayKeys<T> = {
  [K in keyof T]: T[K] extends any[] ? K : never
}[keyof T]