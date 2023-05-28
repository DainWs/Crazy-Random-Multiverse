import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import SettingsView from '@/views/SettingView.vue'
import CreditsView from '@/views/CreditsView.vue'
import GameView from '@/views/GameView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: HomeView
    },
    {
      path: '/settings',
      component: SettingsView
    },
    {
      path: '/credits',
      component: CreditsView
    },
    {
      path: '/create-game',
      component: GameView
    },
    {
      path: '/join-game',
      component: GameView
    },
    {
      path: '/game',
      component: GameView
    }
  ]
})

export default router
