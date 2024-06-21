<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { computed, defineProps, ref, toRefs } from 'vue'
import { numericalSort, slicePagination } from '@/utils/array'

const props = defineProps<{ data?: { counts: number[]; entries: string[] } }>()

const { data } = toRefs(props)

const barChartPagination = ref<{ totalPages: number; currentPage: number }>({
  totalPages: 1,
  currentPage: 1
})

const barChartSeries = computed(() => {
  const [startsAt, endsAt] = slicePagination(barChartPagination.value.currentPage, 10)
  return [{ data: (data.value?.counts ?? []).slice(startsAt, endsAt) ?? [] }]
})

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
      categories: (data.value?.entries ?? []).slice(startsAt, endsAt) ?? [],
      min: 0,
      max: [...(data.value?.counts ?? [])].sort((a, b) => numericalSort(a, b, 'desc'))[0] ?? 0
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
</script>

<template>
  <template v-if="data?.counts?.length === 0">
    <slot name="blankState"></slot>
  </template>
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
      >
        <font-awesome-icon icon="fa-solid fa-arrow-up" />
      </span>
      <span
        v-if="barChartPagination.currentPage !== Math.ceil((data?.counts?.length ?? 0) / 10)"
        @click="() => barChartPagination.currentPage++"
        class="mt-auto cursor-pointer select-none text-2xl text-black hover:text-emerald-500"
      >
        <font-awesome-icon icon="fa-solid fa-arrow-down" />
      </span>
    </div>
  </template>
</template>
