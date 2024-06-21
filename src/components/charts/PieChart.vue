<script setup lang="ts">
import type { ApexOptions } from 'apexcharts'
import { computed, defineProps, toRefs } from 'vue'

const props = defineProps<{ data?: { counts: number[]; entries: string[] } }>()

const { data } = toRefs(props)

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
  },
  labels: data.value?.entries ?? []
}))
</script>

<template>
  <slot v-if="data?.counts?.length === 0" name="blankState"></slot>
  <div v-else class="h-[23.438rem] w-[37.5rem]">
    <apexchart
      type="pie"
      width="600px"
      height="600px"
      :options="pieChartOptions"
      :series="data?.counts ?? []"
    ></apexchart>
  </div>
</template>
