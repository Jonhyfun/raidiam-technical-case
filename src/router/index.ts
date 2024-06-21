import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/demographic'
    },
    {
      path: '/demographic',
      name: 'Demographic Dashboard',
      component: () => import('../views/DemographicView.vue')
    },
    {
      path: '/authorization',
      name: 'Authorization Dashboard',
      component: () => import('../views/ServersView.vue')
    }
  ]
})

export default router
