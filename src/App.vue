<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar'
import { RouterView } from 'vue-router'
import { useParticipants } from './stores/participants'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useDashboard } from './stores/dashboard'

const participantsStore = useParticipants()
const { loadingParticipants } = storeToRefs(participantsStore)

const dashboardStore = useDashboard()
const { isSidebarOpen } = storeToRefs(dashboardStore)

onMounted(() => {
  participantsStore.loadParticipants()
})
</script>

<template>
  <Header>
    <template #logo>
      <RouterLink
        class="group flex items-center gap-2 bg-emerald-800 px-3 py-1 text-white shadow-[2px_2px_6px_black] hover:bg-emerald-400"
        to="/"
      >
        <font-awesome-icon class="group-hover:text-black" :icon="['fas', 'globe']" />
        <span class="font-bold group-hover:text-black"> Raidiam Connect </span>
      </RouterLink>
    </template>
  </Header>
  <Sidebar
    :options="{
      Participants: {
        groupIcon: {
          iconComponent: FontAwesomeIcon,
          iconProps: { icon: ['fas', 'user-group'] }
        },
        groupOptions: [
          {
            label: 'Demographic',
            icon: {
              iconComponent: FontAwesomeIcon,
              iconProps: { icon: ['fas', 'earth-americas'] }
            },
            src: '/demographic'
          },
          {
            label: 'Authorization',
            icon: {
              iconComponent: FontAwesomeIcon,
              iconProps: { icon: ['fas', 'lock'] }
            },
            src: '/authorization?threshold=2'
          }
        ]
      }
    }"
  />
  <main :class="`${isSidebarOpen ? 'pl-52' : 'pl-20'}`" v-if="!loadingParticipants">
    <RouterView />
  </main>
  <div class="m-auto block h-full w-fit content-center" v-else>
    <span>Loading...</span>
  </div>
</template>

<style scoped></style>
