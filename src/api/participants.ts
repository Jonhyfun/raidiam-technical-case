import type { ParticipantObject } from '@/stores/participants/types'

export async function getParticipants(): Promise<ParticipantObject[]> {
  return await (
    await fetch(`${import.meta.env.VITE_API_URL}/participants`, {
      headers: new Headers({
        'x-fapi-interaction-id': import.meta.env.VITE_FAPI_INTERACTION_ID
      })
    })
  ).json()
}
