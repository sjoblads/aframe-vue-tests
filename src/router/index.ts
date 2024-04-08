import { createRouter, createWebHistory } from 'vue-router'
import VR1 from '../views/VR1.vue'
import VR2 from '../views/VR2.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: {name: 'vr2'}
    },
    {
      path: '/vr1',
      name: 'vr1',
      // component: () => import('@/views/VR1.vue')
      component: VR1
    },
    {
      path: '/vr2',
      name: 'vr2',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      // component: () => import('@/views/VR2.vue')
      component: VR2
    }
  ]
})

export default router
