<script setup lang="ts" generic="T extends Record<string, any>">
import { slicePagination } from '@/utils/array'
import { computed, defineProps, ref, toRefs, watch } from 'vue'

const props = defineProps<{
  groupData: T[]
  groupOptions: {
    svgProp: keyof T
    labelProp: keyof T
    keyProp: keyof T
  }
  groupOptionLabels: Partial<Record<keyof T, string>>
  groupOptionFormatters?: Partial<Record<keyof T, (optionValue: any) => string | null>>
}>()

const { groupData, groupOptions, groupOptionLabels, groupOptionFormatters } = toRefs(props)

const selectedGroup = ref<T>()

const groupDataPagination = ref<{ totalPages: number; currentPage: number }>({
  totalPages: 1,
  currentPage: 1
})

watch(selectedGroup, () => {
  console.log({ selectedGroup })
})

const paginatedGroupData = computed(() => {
  const [startsAt, endsAt] = slicePagination(groupDataPagination.value.currentPage, 12)
  return (groupData.value ?? []).slice(startsAt, endsAt) ?? []
})

function formattedOption(key: keyof T, option?: string) {
  if (option === null || option === undefined) return 'N/A'
  if (!groupOptionFormatters.value?.[key]) return option

  return groupOptionFormatters.value[key](option) ?? 'N/A'
}
</script>

<template>
  <template v-if="selectedGroup">
    <div class="flex h-full w-full flex-col gap-10 rounded-md bg-emerald-300 p-1 text-black">
      <div class="flex items-center gap-5 pl-5 pt-2">
        <span
          @click="() => (selectedGroup = undefined)"
          class="cursor-pointer select-none text-2xl text-black hover:text-emerald-500"
        >
          <font-awesome-icon icon="fa-solid fa-arrow-left" />
        </span>
        <div class="flex w-fit min-w-40 items-center gap-3 rounded-md bg-emerald-400 p-1">
          <div class="h-[44px] w-[44px] shrink-0 overflow-hidden rounded-lg bg-emerald-500">
            <object
              class="h-full w-full rounded-lg"
              :data="selectedGroup[groupOptions.svgProp] as string"
              type="image/svg+xml"
            ></object>
          </div>
          <h4 class="w-full text-center text-lg font-medium text-emerald-950">
            {{ selectedGroup[groupOptions.labelProp] }}
          </h4>
        </div>
      </div>
      <div className="flex flex-col gap-5 w-full pl-5 pb-5">
        <template v-for="[key, label] in Object.entries(groupOptionLabels as any)" :key="key">
          <div class="flex w-full flex-col gap-1 border-b-[1px] border-b-black pb-4">
            <span class="w-full text-lg font-semibold">{{ label }}:</span>
            <a
              target="_blank"
              rel="noopener noreferrer"
              class="w-full text-blue-700 underline"
              v-if="selectedGroup[key]?.toString().includes('https://')"
              :href="selectedGroup[key]"
            >
              {{
                (groupOptionFormatters as any)?.[key]
                  ? (groupOptionFormatters as any)[key](selectedGroup[key])
                  : selectedGroup[key]
              }}
            </a>
            <span v-else class="line-clamp-2 w-full">
              {{ formattedOption(key, selectedGroup[key]) }}
            </span>
          </div>
        </template>
      </div>
    </div>
  </template>
  <div v-else class="flex h-full w-full select-none gap-5">
    <ol class="grid h-full w-full grid-cols-3 gap-2">
      <template v-for="group in paginatedGroupData" :key="group[groupOptions.keyProp]">
        <li>
          <div
            @click="selectedGroup = group"
            class="col-span-3 flex cursor-pointer items-center gap-3 rounded-md bg-emerald-300 p-1 text-black hover:shadow-[inset_0px_0px_0_2px_black]"
          >
            <div class="h-[88px] w-[88px] overflow-hidden rounded-lg bg-emerald-500 p-1">
              <object
                class="h-full w-full rounded-lg"
                :data="group[groupOptions.svgProp] as string"
                type="image/svg+xml"
              ></object>
            </div>
            <h4 class="text-lg font-medium text-emerald-950">
              {{ group[groupOptions.labelProp] }}
            </h4>
          </div>
        </li>
      </template>
    </ol>
    <div class="flex h-full flex-col justify-between pb-6 pt-8">
      <span
        v-if="groupDataPagination.currentPage !== 1"
        @click="() => groupDataPagination.currentPage--"
        class="cursor-pointer select-none text-2xl text-black hover:text-emerald-500"
      >
        <font-awesome-icon icon="fa-solid fa-arrow-up" />
      </span>
      <span
        v-if="groupDataPagination.currentPage !== Math.ceil((groupData?.length ?? 0) / 12)"
        @click="() => groupDataPagination.currentPage++"
        class="mt-auto cursor-pointer select-none text-2xl text-black hover:text-emerald-500"
      >
        <font-awesome-icon icon="fa-solid fa-arrow-down" />
      </span>
    </div>
  </div>
</template>
