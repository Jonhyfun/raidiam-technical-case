import type { ParticipantObject } from './types'
import { ref } from 'vue'
import { defineStore } from 'pinia'
import { getParticipants } from '../../api/participants'
import type { ArrayKeys, NonArrayKeys } from '@/utils/types'

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

  function aggregateByArrayProperties<T extends ArrayKeys<ParticipantObject>, J extends keyof ParticipantObject[T][number]>(
    key: J,
    ...properties: T[]
  ): { [key in T]: { entries: { [key in string]: ParticipantObject[T][number] }; counts: number[] } } {
    if (!participants.value)
      throw new Error('Please make sure you are calling aggregateByArrayProperties inside a RouterView')

    const result: { [key in T]: { entries: { [key in string]: ParticipantObject[T][number] }; counts: number[] } } = {} as any

    participants.value.forEach((participant) => {
      properties.forEach((property) => {
        if (!result[property]) result[property] = { entries: {} as { [key in string]: ParticipantObject[T][number] }, counts: [] }

        const propertyValues = (participant as any)[property]

        propertyValues.forEach((value: ParticipantObject[T][number]) => {
          const keyValue = (value[key] as string).toUpperCase() as T

          const entryIndex = Object.keys(result[property].entries).indexOf(keyValue)
          if (entryIndex === -1) {
            result[property].entries[keyValue] = value
            result[property].counts.push(1)
          } else {
            result[property].counts[entryIndex] += 1
          }
        })
      })
    })

    return result
  }

  function aggregateByProperties<T extends NonArrayKeys<ParticipantObject>>(
    ...properties: T[]
  ): { [key in T]: { entries: string[]; counts: number[] } } {
    if (!participants.value)
      throw new Error('Please make sure you are calling aggregateByProperty inside a RouterView')

    if (properties.some(property => Array.isArray(((participants.value![0] as any)[property])))) {
      throw new Error('Some properties refer to array types. Please use aggregateByArrayProperties.')
    }

    const result: { [key in T[number]]: { entries: string[]; counts: number[] } } = {} as any

    participants.value.forEach((participant) => {
      properties.forEach((property) => {
        if (!result[property]) result[property] = { entries: [], counts: [] }

        const propertyValue = (participant as any)[property].toUpperCase()

        let entryIndex = result[property].entries.indexOf(propertyValue)
        if (entryIndex === -1) {
          entryIndex = 0
          result[property].entries.push(propertyValue)
          result[property].counts.push(1)
        }
        else {
          result[property].counts[entryIndex] += 1
        }
      })
    })

    return result
  }
  return { loadingParticipants, participants, loadParticipants, aggregateByArrayProperties, aggregateByProperties }
})
