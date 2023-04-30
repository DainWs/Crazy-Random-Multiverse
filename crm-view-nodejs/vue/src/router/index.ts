import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('../views/SettingView.vue')
    },
    {
      path: '/credits',
      name: 'credits',
      component: () => import('../views/CreditsView.vue')
    },
    {
      path: '/create-game',
      name: 'create-game',
      component: () => import('../views/GameView.vue')
    },
    {
      path: '/join-game',
      name: 'join-game',
      component: () => import('../views/GameView.vue')
    },
    {
      path: '/game',
      name: 'game',
      component: () => import('../views/GameView.vue')
    }
  ]
})

export default router
