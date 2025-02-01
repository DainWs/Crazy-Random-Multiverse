import { createRouter, createWebHistory } from 'vue-router';

import INavigator, { AvailablePages } from '@view/INavigator';

import HomePage from '@view/pages/home/HomePage.vue';
import GamePage from '@view/pages/game/GamePage.vue';
import PartyPage from '@view/pages/party/PartyPage.vue';
import PartyListPage from '@view/pages/partyList/PartyListPage.vue';
import PreviewPage from '@view/pages/preview/PreviewPage.vue';
import CreditsPage from '@view/pages/credits/CreditsPage.vue';

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
