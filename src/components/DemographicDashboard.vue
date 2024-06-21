<script setup lang="ts">
import ThresholdModal from '@/components/Modal/ThresholdModal.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
import PieChart from '@/components/charts/PieChart.vue'
import BarChart from '@/components/charts/BarChart.vue'

import { onMounted, ref, watch } from 'vue'
import { useParticipants } from '../stores/participants'
import { filterSiblingArrays, numericalSort, sortSiblingArrays } from '@/utils/array'

const { aggregateByProperties } = useParticipants()

type ParticipantUsedKeys = 'City' | 'Country'

const stats = ref<
  Partial<{
    [key in ParticipantUsedKeys]: { entries: string[]; counts: number[] }
  }>
>({} as any)

const cityRanking = ref<{ entries: string[]; counts: number[] }>({} as any)

const thresholdModalOpen = ref<boolean>(false)
const appliedOptions = ref(0)
const cityRankingOrder = ref<'asc' | 'desc'>('desc')

function onThresholdSet(threshold: number) {
  initializeData()
  appliedOptions.value = 1

  const [cityCounts, cityEntries] = filterSiblingArrays(
    (value) => value > threshold,
    stats.value.City!.counts,
    stats.value.City!.entries
  )

  stats.value.City = { counts: cityCounts, entries: cityEntries }

  const [countryCounts, countryEntries] = filterSiblingArrays(
    (value) => value > threshold,
    stats.value.Country!.counts,
    stats.value.Country!.entries
  )

  stats.value.Country = { counts: countryCounts, entries: countryEntries }

  const [counts, entries] = filterSiblingArrays(
    (value) => value > threshold,
    cityRanking.value!.counts,
    cityRanking.value!.entries
  )

  cityRanking.value = { counts, entries }
}

function initializeData() {
  const { City, Country } = aggregateByProperties('Country', 'City')

  const [cityCounts, cityEntries] = sortSiblingArrays(
    (a, b) => numericalSort(a, b, 'desc'),
    City.counts,
    City.entries
  )

  stats.value.Country = Country
  stats.value.City = { counts: cityCounts, entries: cityEntries }
  cityRanking.value = { counts: cityCounts, entries: cityEntries }
}

watch(cityRankingOrder, (order) => {
  if (cityRanking.value) {
    const [cityCounts, cityEntries] = sortSiblingArrays(
      (a, b) => numericalSort(a, b, order),
      cityRanking.value.counts,
      cityRanking.value.entries
    )
    cityRanking.value = { counts: cityCounts, entries: cityEntries }
  }
})

onMounted(() => {
  initializeData()
})
</script>

<template>
  <ThresholdModal
    v-if="stats.Country && stats.City && cityRanking"
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
        <font-awesome-icon icon="fa-solid fa-chart-pie" /> Demographic Data
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
    <div class="flex w-full gap-5">
      <aside class="flex min-h-[28.188rem] w-full rounded-md bg-emerald-100 p-4">
        <div class="flex flex-col gap-3">
          <h2 class="text-2xl font-semibold text-black">By Country</h2>
          <PieChart :data="stats.Country">
            <template #blankState>
              <div class="m-auto text-center">
                <span class="text-center text-black">No country data for the applied filters.</span>
              </div>
            </template>
          </PieChart>
        </div>
      </aside>
      <aside class="flex min-h-[28.188rem] w-full rounded-md bg-emerald-100 p-4">
        <div class="flex flex-col gap-3">
          <h2 class="text-2xl font-semibold text-black">By City</h2>
          <PieChart :data="stats.City">
            <template #blankState>
              <div class="m-auto text-center">
                <span class="text-center text-black">No city data for the applied filters.</span>
              </div>
            </template>
          </PieChart>
        </div>
      </aside>
    </div>
    <aside class="flex h-[51.5rem] w-full select-none flex-col gap-3 rounded-md bg-emerald-100 p-4">
      <div class="flex w-full items-center justify-between">
        <h2 class="pl-6 text-2xl font-semibold text-black">City Ranking</h2>
        <h2
          @click="() => (cityRankingOrder = cityRankingOrder === 'asc' ? 'desc' : 'asc')"
          :class="`cursor-pointer rounded-md px-2 py-1.5 text-2xl font-semibold text-black hover:text-emerald-600`"
        >
          {{ cityRankingOrder === 'asc' ? 'Ascending' : 'Descending' }}
          <font-awesome-icon v-if="cityRankingOrder === 'desc'" icon="fa-solid fa-arrow-down" />
          <font-awesome-icon v-else icon="fa-solid fa-arrow-up" />
        </h2>
      </div>
      <div class="flex h-full w-full gap-8">
        <BarChart :data="cityRanking">
          <template #blankState>
            <div class="flex h-full w-full items-center justify-center">
              <span class="text-black">No city data for the applied filters.</span>
            </div>
          </template>
        </BarChart>
      </div>
    </aside>
    <h2 class="text-4xl font-semibold text-emerald-50">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass-chart" /> Compare Data
    </h2>
    <div class="flex w-full gap-5">
      <aside class="flex min-h-[28.188rem] w-full rounded-md bg-emerald-100 p-4">
        <PieChart :data="stats.Country">
          <template #blankState>
            <div class="m-auto text-center">
              <span class="text-center text-black">No country data for the applied filters.</span>
            </div>
          </template>
        </PieChart>
      </aside>
      <aside class="flex min-h-[28.188rem] w-full rounded-md bg-emerald-100 p-4">
        <PieChart :data="stats.City">
          <template #blankState>
            <div class="m-auto text-center">
              <span class="text-center text-black">No city data for the applied filters.</span>
            </div>
          </template>
        </PieChart>
      </aside>
    </div>
  </PageContainer>
</template>

<style>
.apexcharts-menu-item {
  @apply text-black;
}
</style>
