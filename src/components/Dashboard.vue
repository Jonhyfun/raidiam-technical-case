<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useParticipants } from '../stores/participants'

const { participants } = useParticipants()

const countryStats = ref<{ countries: string[]; totals: number[] }>({ countries: [], totals: [] })

const chartOptions = {
  chart: {
    width: 380,
    type: 'pie'
  },
  labels: countryStats.value.countries,
  responsive: [
    {
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }
  ]
}

onMounted(() => {
  participants!.forEach(({ Country }) => {
    let countryIndex = countryStats.value.countries.indexOf(Country)
    if (countryIndex === -1) {
      countryIndex = 0
      countryStats.value.countries.push(Country)
      countryStats.value.totals.push(0)
    }

    countryStats.value.totals[countryIndex] += 1
  })
})
</script>

<template>
  <apexchart
    type="pie"
    width="500"
    :options="chartOptions"
    :series="countryStats.totals"
  ></apexchart>
</template>
