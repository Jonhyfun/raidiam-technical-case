<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import Header from '@/components/layout/Header.vue'
import Sidebar from '@/components/layout/Sidebar'
import { RouterView } from 'vue-router'
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
            src: '/'
          }
        ]
      }
    }"
  />
  <RouterView />
</template>

<style scoped></style>
