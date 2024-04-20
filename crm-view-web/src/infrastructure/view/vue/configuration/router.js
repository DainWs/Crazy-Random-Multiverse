import { createRouter, createWebHistory } from 'vue-router'

import HomePage from '@/infrastructure/view/vue/pages/home/HomePage.vue'
import GamePage from '@/infrastructure/view/vue/pages/game/GamePage.vue'
import PartyPage from '@/infrastructure/view/vue/pages/party/PartyPage.vue'
import PartyListPage from '@/infrastructure/view/vue/pages/partyList/PartyListPage.vue'
import CreditsPage from '@/infrastructure/view/vue/pages/credits/CreditsPage.vue'
import SettingsPage from '@/infrastructure/view/vue/pages/settings/SettingsPage.vue'
import GeneralSettings from '@/infrastructure/view/vue/components/settings/GeneralSettings.vue'

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
