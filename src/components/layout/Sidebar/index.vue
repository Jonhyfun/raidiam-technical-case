<script setup lang="ts">
import type { IconType } from '@/utils/types'
import SidebarOption from './SidebarOption.vue'
import { ref, watch } from 'vue'
import { RouterLink, useRouter } from 'vue-router'

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

const router = useRouter()

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
    :class="`fixed left-0 top-11 h-full ${isSidebarOpen ? 'w-52' : 'w-20'} flex flex-col items-center justify-start bg-emerald-950 px-6 py-5 shadow-md`"
  >
    <div class="mb-10 w-full">
      <font-awesome-icon
        icon="fa-solid fa-arrow-right-from-bracket"
        @click="toggleSidebar"
        :class="`${isSidebarOpen ? 'ml-auto rotate-180' : 'm-auto'} block cursor-pointer text-lg hover:text-emerald-400`"
      />
    </div>
    <div class="flex w-full flex-col gap-2">
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
            <h2 class="text-md font-semibold group-hover:text-emerald-500">
              {{ groupName }}
            </h2>
          </template>
          <template #append>
            <font-awesome-icon
              v-if="isSidebarOpen"
              class="text-sm group-hover:text-emerald-500"
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
            <RouterLink :to="option.src" class="ml-3 flex items-center gap-2">
              <SidebarOption
                :icon="option.icon"
                :selected="router.currentRoute.value.path === option.src"
              >
                <template #label>
                  <h2
                    :class="`text-md font-semibold ${router.currentRoute.value.path === option.src ? 'text-emerald-600' : 'group-hover:text-emerald-600'} w-full`"
                  >
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
