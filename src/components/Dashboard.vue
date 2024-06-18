<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useParticipants } from '../stores/participants'
import type { ParticipantObjectNestedKeys } from '@/stores/participants/types'
import type { ApexOptions } from 'apexcharts'

const { aggregateByProperties } = useParticipants()

const stats = ref<
  Partial<{
    [key in ParticipantObjectNestedKeys]: { entries: string[]; counts: number[] }
  }>
>({} as any)

const getChartOptions = (prop: ParticipantObjectNestedKeys): ApexOptions => ({
  chart: {
    width: 380,
    height: 380,
    type: 'pie'
  },
  legend: {
    width: 200
  },
  labels: stats.value[prop]?.entries ?? []
  //responsive: [
  //  {
  //    breakpoint: 480,
  //    options: {
  //      chart: {
  //        width: 200
  //      },
  //      legend: {
  //        position: 'bottom'
  //      }
  //    }
  //  }
  //]
})

onMounted(() => {
  stats.value = aggregateByProperties('Country', 'City')
})
</script>

<template>
  <div class="flex w-full items-center gap-5 rounded-md bg-emerald-200 p-4">
    <apexchart
      type="pie"
      width="600px"
      height="600px"
      :options="getChartOptions('City')"
      :series="stats.City?.counts ?? []"
    ></apexchart>
    <apexchart
      type="pie"
      width="600px"
      height="600px"
      :options="getChartOptions('Country')"
      :series="stats.Country?.counts ?? []"
    ></apexchart>
  </div>
</template>
