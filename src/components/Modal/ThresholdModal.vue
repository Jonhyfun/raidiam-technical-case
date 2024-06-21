<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Modal from './index.vue'
import { useRoute, useRouter } from 'vue-router'

const { replace } = useRouter()
const { query, path } = useRoute()

const currentThreshold = ref(0)

defineProps<{ open?: boolean; onCloseClick: () => void }>()
const emit = defineEmits<{
  (e: 'onThresholdSet', threshold: number): void
  (e: 'onOptionsCleared'): void
}>()

function setThreshold(threshold: number) {
  replace({ path, query: { threshold } })
  emit('onThresholdSet', threshold)
}

onMounted(() => {
  if (query.threshold) {
    const threshold = Number(query.threshold)
    emit('onThresholdSet', threshold)
    currentThreshold.value = threshold
  }
})
</script>

<template>
  <Modal :open="open" @closeClick="onCloseClick">
    <template #title>
      <h2>Teste</h2>
    </template>
    <template #content>
      <div class="flex flex-col gap-10">
        <div class="flex flex-col gap-2">
          <span class="text-lg font-semibold text-black"
            >Threshold <span class="text-xs">(values greater than)</span></span
          >
          <input
            type="number"
            class="text-md rounded-md border-[1px] border-solid border-black px-1.5 py-0.5 text-black"
            v-model="currentThreshold"
          />
        </div>
        <div class="flex flex-col gap-1">
          <button
            class="rounded-md bg-emerald-950 px-2.5 py-1.5 font-semibold text-emerald-100 hover:bg-emerald-500 hover:text-emerald-950"
            @click="() => setThreshold(currentThreshold)"
          >
            Apply options
          </button>
          <button
            class="rounded-md bg-emerald-950 px-2.5 py-1.5 font-semibold text-emerald-100 hover:bg-emerald-500 hover:text-emerald-950"
            @click="() => emit('onOptionsCleared')"
          >
            Clear options
          </button>
        </div>
      </div>
    </template>
  </Modal>
</template>
