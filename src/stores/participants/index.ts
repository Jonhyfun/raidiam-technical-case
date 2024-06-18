import type { ParticipantObject, ParticipantObjectNestedKeys } from './types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getParticipants } from '@/api/participants'

export const useParticipants = defineStore('participants', () => {
  const participants = ref<ParticipantObject[] | null>(null)
  const loadingParticipants = ref(true)

  async function loadParticipants() {
    loadingParticipants.value = true
    getParticipants()
      .then((data) => {
        participants.value = data
        loadingParticipants.value = false
      })
      .catch(() => {
        loadingParticipants.value = false
      })
  }

  function aggregateByProperties<T extends ParticipantObjectNestedKeys>(
    ...properties: T[]
  ): { [key in T]: { entries: string[]; counts: number[] } } {
    if (!participants.value)
      throw new Error('Please make sure you are calling aggregateByProperty inside a RouterView')

    const result: { [key in T[number]]: { entries: string[]; counts: number[] } } = {} as any

    participants.value.forEach((participant) => {
      properties.forEach((property) => {
        if (!result[property]) result[property] = { entries: [], counts: [] }

        const propertyValue = (participant as any)[property].toUpperCase()

        let entryIndex = result[property].entries.indexOf(propertyValue)
        if (entryIndex === -1) {
          entryIndex = 0
          result[property].entries.push(propertyValue)
          result[property].counts.push(0)
        }

        result[property].counts[entryIndex] += 1
      })
    })

    return result
  }

  return { loadingParticipants, participants, loadParticipants, aggregateByProperties }
})
