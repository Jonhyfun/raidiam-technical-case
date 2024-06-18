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
})

onMounted(() => {
  stats.value = aggregateByProperties('Country', 'City')
})
</script>

<template>
  <div class="mx-auto flex h-full w-[85.375rem] flex-col items-start gap-10 pt-10">
    <h2 class="text-4xl font-semibold text-emerald-50">
      <font-awesome-icon icon="fa-solid fa-chart-pie" /> Demographic Data
    </h2>
    <div class="flex items-center gap-5 rounded-md bg-emerald-200 p-4">
      <div class="flex flex-col gap-3">
        <h2 class="text-2xl font-semibold text-black">By Country</h2>
        <apexchart
          type="pie"
          width="600px"
          height="600px"
          :options="getChartOptions('Country')"
          :series="stats.Country?.counts ?? []"
        ></apexchart>
      </div>
      <div class="flex flex-col gap-3">
        <h2 class="text-2xl font-semibold text-black">By City</h2>
        <apexchart
          type="pie"
          width="600px"
          height="600px"
          :options="getChartOptions('City')"
          :series="stats.City?.counts ?? []"
        ></apexchart>
      </div>
    </div>
  </div>
</template>
