<script setup lang="ts">
import type { IconType } from '@/utils/types'

defineProps<{
  selected?: boolean
  iconOnly?: boolean
  icon: IconType
  class?: string
}>()

const emit = defineEmits(['click'])

function onClick() {
  emit('click')
}
</script>

<template>
  <span
    @click="onClick"
    :class="`${iconOnly ? 'h-8 w-8' : 'px-2.5 py-1'} group flex w-full cursor-pointer select-none items-center justify-between gap-2 rounded-md bg-emerald-200 text-emerald-950`"
  >
    <span :class="`flex items-center gap-2 ${iconOnly ? 'm-auto' : ''}`">
      <component
        :is="icon.iconComponent"
        v-bind="icon.iconProps"
        :class="`text-lg ${selected ? 'text-emerald-600' : 'group-hover:text-emerald-600'}`"
      />
      <slot v-if="!iconOnly" name="label"></slot>
    </span>
    <slot name="append"></slot>
  </span>
</template>
