import type { FontAwesomeIconProps } from '@fortawesome/vue-fontawesome'
import type { DefineComponent } from 'vue'

type Unarray<T> = T extends (infer U)[] ? U : T

export type UnarrayProperties<T> = {
  [K in keyof T]: T[K] extends object ? UnarrayProperties<Unarray<T[K]>> : Unarray<T[K]>
}

type DotPrefix<T extends string> = T extends '' ? '' : `.${T}`

export type Paths<T> = (
  T extends object
    ? { [K in Exclude<keyof T, symbol>]: `${K}${DotPrefix<Paths<T[K]>>}` }[Exclude<keyof T, symbol>]
    : ''
) extends infer D
  ? Extract<D, string>
  : never

export type IconType = {
  iconComponent: DefineComponent<FontAwesomeIconProps>
  iconProps: FontAwesomeIconProps
}
