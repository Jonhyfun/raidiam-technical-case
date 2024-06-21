<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import ThresholdModal from '@/components/Modal/ThresholdModal.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
import { computed, onMounted, ref } from 'vue'
import { useParticipants } from '../stores/participants'
import { filterSiblingArrays } from '@/utils/array'
import { useRoute } from 'vue-router'

const { aggregateByArrayProperties } = useParticipants()

type ParticipantUsedKeys = 'AuthorisationServers'

const stats = ref<
  Partial<{
    [key in ParticipantUsedKeys]: { entries: string[]; counts: number[] }
  }>
>({} as any)

const { query } = useRoute()

const thresholdModalOpen = ref<boolean>(false)
const appliedOptions = ref(0)

const pieChartOptions = computed<ApexOptions>(() => ({
  chart: {
    width: '600px',
    height: '600px',
    type: 'pie',
    toolbar: {
      show: true
    }
  },
  stroke: {
    width: 1,
    colors: ['#000']
  },
  legend: {
    width: 200
  }
}))

const authorisationPieChartOptions = computed(() => ({
  ...pieChartOptions.value,
  labels: stats.value['AuthorisationServers']?.entries ?? []
}))

function onThresholdSet(threshold: number) {
  initializeData()
  appliedOptions.value = 1

  if (stats.value.AuthorisationServers) {
    const total = stats.value.AuthorisationServers!.counts.reduce((acc, current) => acc + current)

    const [counts, entries] = filterSiblingArrays(
      (value) => value > threshold,
      stats.value.AuthorisationServers!.counts,
      stats.value.AuthorisationServers!.entries
    )

    const filteredTotal = counts.reduce((acc, current) => acc + current, 0)

    if (filteredTotal == 0) {
      stats.value.AuthorisationServers = { counts: [], entries: [] }
      return
    }

    counts.push(total - filteredTotal)
    entries.push('OTHERS')
    stats.value.AuthorisationServers = { counts, entries }
  }
}

function initializeData() {
  stats.value = aggregateByArrayProperties('CustomerFriendlyName', 'AuthorisationServers')
}

onMounted(() => {
  console.log('Running onMounted hook')
  if (query.threshold) {
    onThresholdSet(Number(query.threshold))
  } else {
    initializeData()
  }
})
</script>

<template>
  <ThresholdModal
    :open="thresholdModalOpen"
    :onCloseClick="() => (thresholdModalOpen = false)"
    @onThresholdSet="onThresholdSet"
    @onOptionsCleared="
      () => {
        appliedOptions = 0
        initializeData()
      }
    "
  />
  <PageContainer>
    <div class="flex w-full items-center justify-between">
      <h2 class="text-4xl font-semibold text-emerald-50">
        <font-awesome-icon icon="fa-solid fa-chart-pie" /> Authorization Servers Data
      </h2>
      <div class="relative">
        <span
          v-if="appliedOptions > 0"
          class="text-md absolute -right-3 -top-4 h-7 w-7 rounded-full border-2 border-solid border-black bg-white text-center font-bold text-black"
          >{{ appliedOptions }}</span
        >
        <h2
          @click="() => (thresholdModalOpen = true)"
          :class="`cursor-pointer rounded-md px-2 py-1.5 text-2xl font-semibold ${appliedOptions > 0 ? 'bg-emerald-100 text-black' : 'text-emerald-50 hover:bg-emerald-100 hover:text-black'} `"
        >
          <font-awesome-icon icon="fa-solid fa-chart-line" />
          Filters
        </h2>
      </div>
    </div>
    <div class="flex items-center gap-5 rounded-md bg-emerald-100 p-4">
      <div class="flex flex-col gap-3">
        <h2 class="text-2xl font-semibold text-black">Participant Share</h2>
        <div class="h-[23.438rem] w-[37.5rem]">
          <apexchart
            type="pie"
            width="600px"
            height="600px"
            :options="authorisationPieChartOptions"
            :series="stats.AuthorisationServers?.counts ?? []"
          ></apexchart>
        </div>
      </div>
    </div>
    <div class="flex h-[48.75rem] w-full items-center gap-8 rounded-md bg-emerald-100 p-4"></div>
  </PageContainer>
</template>

<style>
.apexcharts-menu-item {
  @apply text-black;
}
</style>
