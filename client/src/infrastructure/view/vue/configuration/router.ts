import { createRouter, createWebHistory } from 'vue-router';

import INavigator, { AvailablePages } from '@view/INavigator';

import HomePage from '@vue-pages/home/HomePage.vue';
import GamePage from '@vue-pages/game/GamePage.vue';
import PartyPage from '@vue-pages/party/PartyPage.vue';
import PartyListPage from '@vue-pages/partyList/PartyListPage.vue';
import PreviewPage from '@vue-pages/preview/PreviewPage.vue';
import CreditsPage from '@vue-pages/credits/CreditsPage.vue';
import SettingsPage from '@vue-pages/settings/SettingsPage.vue';
import GeneralSettings from '@vue-pages/settings/components/GeneralSettings.vue';

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
      path: '/preview',
      component: PreviewPage
    },
    {
      path: '/credits',
      component: CreditsPage
    }
  ]
});

const navigatorRoutes = new Map<AvailablePages, string>();
navigatorRoutes.set('home', '/');
navigatorRoutes.set('game', '/game');
navigatorRoutes.set('party', '/party');

const navigateTo = (page: AvailablePages) => {
  const route = navigatorRoutes.get(page);
  if (!route) throw new Error('route not supported');
  router.push(route);
}

const navigator: INavigator = {
  navigateTo
}

export { navigator };
export default router;
