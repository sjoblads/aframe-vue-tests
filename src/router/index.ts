import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: {name: 'vr1'}
    },
    {
      path: '/vr1',
      name: 'vr1',
      component: () => import('@/views/VR1.vue')
    },
    {
      path: '/vr2',
      name: 'vr2',
      component: () => import('@/views/VR2.vue')
    },
    {
      path: '/avatar',
      name: 'avatar',
      component: () => import('@/views/Avatar.vue')
    },
  ]
})

export default router
