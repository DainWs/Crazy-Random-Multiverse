import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '@/views/HomeView.vue'
import SettingsView from '@/views/SettingView.vue'
import CreditsView from '@/views/CreditsView.vue'
import PartyListView from '@/views/party/PartyListView.vue'
import PartyView from '@/views/party/PartyView.vue'
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
      path: '/party-list',
      component: PartyListView
    },
    {
      path: '/party',
      component: PartyView
    },
    {
      path: '/game',
      component: GameView
    }
  ]
})

router.beforeEach((to, from) => {
  console.log(from.path + " to " + to.path)
  return true
})

export default router
