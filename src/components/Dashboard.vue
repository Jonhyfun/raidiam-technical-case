<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  data: function () {
    return {
      series: [44, 55, 13, 43, 22],
      chartOptions: {
        chart: {
          width: 380,
          type: 'pie'
        },
        labels: ['Team A', 'Team B', 'Team C', 'Team D', 'Team E'],
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
    }
  }
})
</script>

<template>
  <apexchart type="pie" width="500" :options="chartOptions" :series="series"></apexchart>
</template>
