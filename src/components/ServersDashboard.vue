<script setup lang="ts">
import ThresholdModal from '@/components/Modal/ThresholdModal.vue'
import PageContainer from '@/components/layout/PageContainer.vue'
import { onMounted, ref } from 'vue'
import { useParticipants } from '../stores/participants'
import { filterSiblingArrays } from '@/utils/array'
import { useRoute } from 'vue-router'
import PieChart from './charts/PieChart.vue'
import type { ParticipantObject } from '@/stores/participants/types'
import GroupTable from './Table/GroupTable.vue'
import { getDateLabelFromEpoch } from '@/utils/date'

const { aggregateByArrayProperties } = useParticipants()

type ParticipantUsedKeys = 'AuthorisationServers'

const { query } = useRoute()

const stats = ref<
  Partial<{
    [key in ParticipantUsedKeys]: { entries: string[]; counts: number[] }
  }>
>({} as any)

const thresholdModalOpen = ref<boolean>(false)
const appliedOptions = ref(0)
const serversList = ref<ParticipantObject['AuthorisationServers']>([])

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
  const {
    AuthorisationServers: { counts, entries }
  } = aggregateByArrayProperties('CustomerFriendlyName', 'AuthorisationServers')

  serversList.value = Object.values(entries)
  stats.value.AuthorisationServers = { counts, entries: Object.keys(entries) }
}

onMounted(() => {
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
    <div class="flex h-[28.25rem] w-[41rem] gap-5 rounded-md bg-emerald-100 p-4">
      <div class="flex h-full w-full flex-col gap-3">
        <h2 class="text-2xl font-semibold text-black">Participant Share</h2>
        <PieChart :data="stats.AuthorisationServers">
          <template #blankState>
            <div class="flex h-full w-full items-center justify-center">
              <span class="text-center text-black">
                No Authorization Server data for the applied filters.
              </span>
            </div>
          </template>
        </PieChart>
      </div>
    </div>
    <div class="flex h-[42rem] w-full flex-col gap-8 rounded-md bg-emerald-100 p-4">
      <h2 class="text-2xl font-semibold text-black">Authorization Servers</h2>
      <GroupTable
        :groupData="serversList"
        :groupOptions="{
          keyProp: 'AuthorisationServerId',
          labelProp: 'CustomerFriendlyName',
          svgProp: 'CustomerFriendlyLogoUri'
        }"
        :groupOptionLabels="{
          CreatedAt: 'Created at',
          CustomerFriendlyDescription: 'Description',
          Issuer: 'Server Issuer',
          Flags: 'Flags',
          SupportsCiba: 'Supports Ciba?'
        }"
        :groupOptionFormatters="{
          CreatedAt: (createdAt) => {
            return getDateLabelFromEpoch(createdAt)
          },
          Flags: (flags) => {
            const flagsString = Object.keys(flags)
              .filter((flag) => flags[flag])
              .join(' / ')
            if (!flagsString) return null
            return flagsString
          },
          SupportsCiba: (supportsCiba) => {
            console.log({ supportsCiba })
            return supportsCiba ? 'Yes' : 'No'
          }
        }"
      >
      </GroupTable>
    </div>
  </PageContainer>
</template>

<style>
.apexcharts-menu-item {
  @apply text-black;
}
</style>
