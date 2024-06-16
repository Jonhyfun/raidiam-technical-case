<script setup lang="ts">
import type { IconType } from '@/utils/types'
import SidebarOption from './SidebarOption.vue'
import { ref, watch } from 'vue'
import { RouterLink } from 'vue-router'

defineProps<{
  options: {
    [key: string]: {
      groupIcon: IconType
      groupOptions: {
        label: string
        src: string
        icon: IconType
      }[]
    }
  }
}>()

const isSidebarOpen = ref(false)
const openGroups = ref<string[]>([])

function toggleSidebar() {
  isSidebarOpen.value = !isSidebarOpen.value
}

function toggleGroupOpen(group: string) {
  if (openGroups.value.includes(group)) {
    openGroups.value = openGroups.value.filter((existingGroup) => existingGroup !== group)
    return
  }
  openGroups.value.push(group)
}

watch(isSidebarOpen, (newValue) => {
  if (newValue) {
    document.body.classList.add('pl-52')
  } else {
    document.body.classList.remove('pl-52')
  }
})
</script>

<template>
  <aside
    :class="`fixed h-full left-0 top-11 ${isSidebarOpen ? 'w-52' : 'w-20'} bg-emerald-950 shadow-md flex flex-col items-center justify-start py-5 px-6`"
  >
    <div class="w-full mb-10">
      <font-awesome-icon
        icon="fa-solid fa-arrow-right-from-bracket"
        @click="toggleSidebar"
        :class="`${isSidebarOpen ? 'rotate-180 ml-auto' : 'm-auto'} block text-lg cursor-pointer hover:text-emerald-400`"
      />
    </div>
    <div class="flex flex-col gap-2 w-full">
      <template
        v-for="[groupName, { groupIcon, groupOptions }] in Object.entries(options)"
        :key="groupName"
      >
        <SidebarOption
          @click="() => toggleGroupOpen(groupName)"
          :icon="groupIcon"
          :icon-only="!isSidebarOpen"
          group-parent
        >
          <template #label>
            <h2 class="font-semibold text-md group-hover:text-emerald-500">
              {{ groupName }}
            </h2>
          </template>
          <template #append>
            <font-awesome-icon
              v-if="isSidebarOpen"
              class="group-hover:text-emerald-500 text-sm"
              :icon="
                openGroups.includes(groupName)
                  ? 'fa-solid fa-chevron-down'
                  : 'fa-solid fa-chevron-up'
              "
            />
          </template>
        </SidebarOption>
        <ul v-if="isSidebarOpen && openGroups.includes(groupName)">
          <li v-for="option in groupOptions" :key="option.label">
            <RouterLink :to="option.src" class="flex items-center gap-2 ml-3">
              <SidebarOption :icon="option.icon">
                <template #label>
                  <h2 class="font-semibold text-md group-hover:text-emerald-500 w-full">
                    {{ option.label }}
                  </h2>
                </template>
              </SidebarOption>
            </RouterLink>
          </li>
        </ul>
      </template>
    </div>
  </aside>
</template>
