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
    :class="`${iconOnly ? 'w-8 h-8' : 'px-2.5 py-1'} flex items-center justify-between gap-2 bg-emerald-200 text-emerald-950 rounded-md w-full group cursor-pointer`"
  >
    <span :class="`flex gap-2 items-center ${iconOnly ? 'm-auto' : ''}`">
      <component
        :is="icon.iconComponent"
        v-bind="icon.iconProps"
        class="text-lg group-hover:text-emerald-500"
      />
      <slot v-if="!iconOnly" name="label"></slot>
    </span>
    <slot name="append"></slot>
  </span>
</template>
