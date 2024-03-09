import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/ui/vue/home.vue'
import SettingsPage from '@/ui/vue/settings.vue'
import GeneralSettings from '@/ui/vue/components/generalSettings.vue'
import CreditsPage from '@/ui/vue/credits.vue'
import PartyListPage from '@/ui/vue/partyList.vue'
import PartyPage from '@/ui/vue/party.vue'
import GamePage from '@/ui/vue/game.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '',
      component: HomePage
    },
    {
      path: '/party-list',
      component: PartyListPage
    },
    {
      path: '/party',
      component: PartyPage
    },
    {
      path: '/game',
      component: GamePage
    },
    {
      path: '/settings',
      component: SettingsPage,
      children: [
        {
          path: '',
          component: GeneralSettings
        },
        {
          path: 'general',
          component: GeneralSettings
        }
      ]
    },
    {
      path: '/credits',
      component: CreditsPage
    }
  ]
})

export default router
