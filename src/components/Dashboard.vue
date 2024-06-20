<script setup lang="ts">
import Modal from '@/components/Modal.vue'
import { computed, onMounted, ref } from 'vue'
import { useParticipants } from '../stores/participants'
import { numericalSort, slicePagination, sortSiblingArrays } from '@/utils/array'
import type { ApexOptions } from 'apexcharts'

const { aggregateByProperties } = useParticipants()

type ParticipantUsedKeys = 'City' | 'Country'

const stats = ref<
  Partial<{
    [key in ParticipantUsedKeys]: { entries: string[]; counts: number[] }
  }>
>({} as any)

const thresholdModalOpen = ref<boolean>(false)

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
    width: 380,
    height: 380,
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

onMounted(() => {
  console.log('Running onMounted hook')
  const { City, Country } = aggregateByProperties('Country', 'City')
  const [cityCounts, cityEntries] = sortSiblingArrays(
    (a, b) => numericalSort(a, b, 'desc'),
    City.counts,
    City.entries
  )

  stats.value.Country = Country
  stats.value.City = { counts: cityCounts, entries: cityEntries }

  barChartPagination
})
</script>

<template>
  <Modal :open="thresholdModalOpen" @closeClick="() => (thresholdModalOpen = false)" />
  <div class="mx-auto flex h-full w-[80rem] flex-col items-start gap-12 pt-10">
    <div class="flex w-full items-center justify-between">
      <h2 class="text-4xl font-semibold text-emerald-50">
        <font-awesome-icon icon="fa-solid fa-chart-pie" /> Demographic Data
      </h2>
      <h2
        @click="() => (thresholdModalOpen = true)"
        class="cursor-pointer rounded-md px-2 py-1.5 text-2xl font-semibold text-emerald-50 hover:bg-emerald-100 hover:text-black"
      >
        <font-awesome-icon icon="fa-solid fa-chart-line" />
        Options
      </h2>
    </div>
    <div class="flex w-full items-center gap-5 rounded-md bg-emerald-100 p-4">
      <div class="flex flex-col gap-3">
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
      <div class="flex flex-col gap-3">
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
    </div>
    <div class="flex w-full items-center gap-8 rounded-md bg-emerald-100 p-4">
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
          v-if="barChartPagination.currentPage !== Math.ceil((stats.City?.counts.length ?? 0) / 10)"
          @click="() => barChartPagination.currentPage++"
          class="mt-auto cursor-pointer select-none text-2xl text-black hover:text-emerald-500"
          ><font-awesome-icon icon="fa-solid fa-arrow-down"
        /></span>
      </div>
    </div>
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
