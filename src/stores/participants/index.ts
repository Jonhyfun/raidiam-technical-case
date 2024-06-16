import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { ParticipantObject } from './types'
import { getParticipants } from '@/api/participants'

export const useParticipants = defineStore('participants', () => {
  const participants = ref<ParticipantObject[] | null>(null)
  const loadingParticipants = ref(true)

  async function loadParticipants() {
    loadingParticipants.value = true
    getParticipants().then((data) => {
      participants.value = data
      loadingParticipants.value = false;
    }).catch(() => {
      loadingParticipants.value = false;
    })
  }

  return { loadingParticipants, participants, loadParticipants }
})
