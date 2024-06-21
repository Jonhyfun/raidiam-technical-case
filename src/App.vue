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
      <RouterLink to="/"> Raidiam Connect </RouterLink>
    </template>
  </Header>
  <Sidebar
    :options="{
      Dashboard: {
        groupIcon: {
          iconComponent: FontAwesomeIcon,
          iconProps: { icon: ['fas', 'chart-pie'] }
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
