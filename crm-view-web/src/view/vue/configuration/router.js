import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/view/vue/pages/home.vue'
import SettingsPage from '@/view/vue/pages/settings.vue'
import GeneralSettings from '@/view/vue/components/generalSettings.vue'
import CreditsPage from '@/view/vue/pages/credits.vue'
import PartyListPage from '@/view/vue/pages/partyList.vue'
import PartyPage from '@/view/vue/pages/party.vue'
import GamePage from '@/view/vue/pages/game.vue'

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
