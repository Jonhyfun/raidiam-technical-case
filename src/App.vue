<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar'
import { RouterView } from 'vue-router'
import { useParticipants } from './stores/participants'
import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'

const participantsStore = useParticipants()
const { loadingParticipants } = storeToRefs(participantsStore)

onMounted(() => {
  participantsStore.loadParticipants()
})
</script>

<template>
  <Header>
    <template #logo>
      <RouterLink to="/"> Teste </RouterLink>
    </template>
    <template #links>
      <RouterLink class="font-medium" to="/about">About</RouterLink>
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
          }
        ]
      }
    }"
  />
  <RouterView v-if="!loadingParticipants" />
  <div class="m-auto block w-fit" v-else>
    <span>Loading...</span>
  </div>
</template>

<style scoped></style>
