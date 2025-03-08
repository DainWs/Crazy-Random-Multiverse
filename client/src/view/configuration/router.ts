import { createRouter, createWebHistory } from 'vue-router';

import INavigator, { AvailablePages } from '@view/INavigator';

import HomePage from '@pages/HomePage.vue';
import GamePage from '@view/pages/game/GamePage.vue';
import PartyPage from '@pages/PartyPage.vue';
import PartyListPage from '@pages/PartyListPage.vue';
import PreviewPage from '@pages/PreviewPage.vue';
import CreditsPage from '@pages/CreditsPage.vue';
import { developmentOnly } from '@view/configuration/routeGuards';

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
      beforeEnter: developmentOnly,
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
navigatorRoutes.set('party-list', '/party-list');
navigatorRoutes.set('preview', '/preview');
navigatorRoutes.set('credits', '/credits');

const navigateTo = (page: AvailablePages) => {
  const route = navigatorRoutes.get(page);
  if (!route) throw new Error('route not supported');
  router.push(route);
}

const navigateToFunc = (page: AvailablePages) => {
  return () => navigateTo(page);
}

const navigator: INavigator = {
  navigateTo,
  navigateToFunc
}

export { navigator };
export default router;
