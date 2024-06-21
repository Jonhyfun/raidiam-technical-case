<script setup lang="ts">
defineProps<{ open?: boolean }>()
const emit = defineEmits(['closeClick'])
</script>

<template>
  <div
    @click="() => emit('closeClick')"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
    v-if="open"
  >
    <div @click="(e) => e.stopPropagation()" class="w-96 rounded-lg bg-white p-6 shadow-lg">
      <div class="mb-4 flex items-center justify-between">
        <slot name="title"></slot>
        <button @click="() => emit('closeClick')" class="text-gray-500 hover:text-gray-700">
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            ></path>
          </svg>
        </button>
      </div>

      <slot name="content"></slot>
    </div>
  </div>
</template>
