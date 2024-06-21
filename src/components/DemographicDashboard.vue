<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import ThresholdModal from '@/components/Modal/ThresholdModal.vue'
import { computed, onMounted, ref } from 'vue'
import { useParticipants } from '../stores/participants'
import {
  filterSiblingArrays,
  numericalSort,
  slicePagination,
  sortSiblingArrays
} from '@/utils/array'

const { aggregateByProperties } = useParticipants()

type ParticipantUsedKeys = 'City' | 'Country'

const stats = ref<
  Partial<{
    [key in ParticipantUsedKeys]: { entries: string[]; counts: number[] }
  }>
>({} as any)

const thresholdModalOpen = ref<boolean>(false)
const appliedOptions = ref(0)

const barChartPagination = ref<{ totalPages: number; currentPage: number }>({
  totalPages: 1,
  currentPage: 1
})

const barChartSeries = computed(() => {
  const [startsAt, endsAt] = slicePagination(barChartPagination.value.currentPage, 10)
  return [{ data: stats.value.City?.counts.slice(startsAt, endsAt) ?? [] }]
})

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

const countryPieChartOptions = computed(() => ({
  ...pieChartOptions.value,
  labels: stats.value['Country']?.entries ?? []
}))

const cityPieChartOptions = computed(() => ({
  ...pieChartOptions.value,
  labels: stats.value['City']?.entries ?? []
}))

const barChartOptions = computed<ApexOptions>(() => {
  const [startsAt, endsAt] = slicePagination(barChartPagination.value.currentPage, 10)

  return {
    chart: {
      type: 'bar',
      animations: {
        enabled: false
      }
    },
    plotOptions: {
      bar: {
        barHeight: '80%',
        distributed: true,
        horizontal: true,
        dataLabels: {
          position: 'bottom'
        }
      }
    },
    legend: {
      show: false
    },
    dataLabels: {
      enabled: true,
      textAnchor: 'start',
      style: {
        colors: ['#fff'],
        fontSize: '14px'
      },
      background: {
        enabled: true,
        foreColor: '#000',
        opacity: 0.7
      },
      formatter: function (val, opt) {
        return opt.w.globals.labels[opt.dataPointIndex] + ':  ' + val
      },
      offsetX: 0,
      dropShadow: {
        enabled: true
      }
    },
    stroke: {
      width: 1,
      colors: ['#000']
    },
    xaxis: {
      categories: stats.value['City']?.entries.slice(startsAt, endsAt) ?? [],
      min: 0,
      max: stats.value['City']?.counts[0] ?? 0
    },
    yaxis: {
      labels: {
        show: false
      }
    },
    tooltip: {
      theme: 'dark',
      x: {
        show: false
      },
      y: {
        title: {
          formatter: function () {
            return ''
          }
        }
      }
    }
  }
})

function onThresholdSet(threshold: number) {
  initializeData()
  appliedOptions.value = 1

  if (stats.value.City) {
    const [counts, entries] = filterSiblingArrays(
      (value) => value > threshold,
      stats.value.City!.counts,
      stats.value.City!.entries
    )
    stats.value.City = { counts, entries }
  }
  if (stats.value.Country) {
    const [counts, entries] = filterSiblingArrays(
      (value) => value > threshold,
      stats.value.Country!.counts,
      stats.value.Country!.entries
    )
    stats.value.Country = { counts, entries }
  }
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
}

onMounted(() => {
  console.log('Running onMounted hook')
  initializeData()
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
  <div class="mx-auto flex h-full w-[80rem] flex-col items-start gap-12 pt-10">
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
      <aside class="flex min-h-[28.188rem] rounded-md bg-emerald-100 p-4">
        <div v-if="stats.Country?.counts.length === 0" class="w-1/2 text-center">
          <span class="text-center text-black">No country data for the applied filters.</span>
        </div>
        <div v-else class="flex flex-col gap-3">
          <h2 class="text-2xl font-semibold text-black">By Country</h2>
          <div class="h-[23.438rem] w-[37.5rem]">
            <apexchart
              type="pie"
              width="600px"
              height="600px"
              :options="countryPieChartOptions"
              :series="stats.Country?.counts ?? []"
            ></apexchart>
          </div>
        </div>
      </aside>
      <aside class="flex min-h-[28.188rem] rounded-md bg-emerald-100 p-4">
        <div v-if="stats.City?.counts.length === 0" class="ml-auto w-1/2 text-center">
          <span class="text-center text-black">No city data for the applied filters.</span>
        </div>
        <div v-else class="flex flex-col gap-3">
          <h2 class="text-2xl font-semibold text-black">By City</h2>
          <div class="h-[23.438rem] w-[37.5rem]">
            <apexchart
              type="pie"
              width="600px"
              height="600px"
              :options="cityPieChartOptions"
              :series="stats.City?.counts ?? []"
            ></apexchart>
          </div>
        </div>
      </aside>
    </div>
    <aside class="flex h-[51.5rem] w-full flex-col gap-3 rounded-md bg-emerald-100 p-4">
      <h2 class="pl-6 text-2xl font-semibold text-black">City Ranking</h2>
      <div class="flex h-full w-full gap-8">
        <div
          v-if="stats.City?.counts.length === 0"
          class="flex h-full w-full items-center justify-center"
        >
          <span class="text-black">No city data for the applied filters.</span>
        </div>
        <template v-else>
          <apexchart
            type="bar"
            width="1180px"
            :series="barChartSeries"
            :options="barChartOptions"
          ></apexchart>
          <div class="flex h-full flex-col justify-between pb-6 pt-8">
            <span
              v-if="barChartPagination.currentPage !== 1"
              @click="() => barChartPagination.currentPage--"
              class="cursor-pointer select-none text-2xl text-black hover:text-emerald-500"
              ><font-awesome-icon icon="fa-solid fa-arrow-up"
            /></span>
            <span
              v-if="
                barChartPagination.currentPage !== Math.ceil((stats.City?.counts.length ?? 0) / 10)
              "
              @click="() => barChartPagination.currentPage++"
              class="mt-auto cursor-pointer select-none text-2xl text-black hover:text-emerald-500"
              ><font-awesome-icon icon="fa-solid fa-arrow-down"
            /></span>
          </div>
        </template>
      </div>
    </aside>
    <h2 class="text-4xl font-semibold text-emerald-50">
      <font-awesome-icon icon="fa-solid fa-magnifying-glass-chart" /> Compare Data
    </h2>
  </div>
</template>

<style>
.apexcharts-menu-item {
  @apply text-black;
}
</style>
