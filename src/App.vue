<script setup lang="ts">
import { RouterView } from 'vue-router'
import Header from './components/layout/Header.vue'
</script>

<template>
  <Header>
    <template #logo>
      <RouterLink to="/"> Teste </RouterLink>
    </template>
    <template #links>
      <RouterLink to="/about">About</RouterLink>
    </template>
  </Header>
  <RouterView />
</template>

<style scoped></style>
