import { defineStore } from "pinia"
import { ref } from "vue"

export const useDashboard = defineStore('dashboard', () => {
  const isSidebarOpen = ref(true)

  function toggleSidebar() {
    isSidebarOpen.value = !isSidebarOpen.value
  }

  return { isSidebarOpen, toggleSidebar }
})