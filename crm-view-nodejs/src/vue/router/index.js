import { createRouter, createWebHistory } from 'vue-router';
const router = createRouter({
    history: createWebHistory('/'),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/vue/views/HomeView.vue')
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('@/vue/views/SettingView.vue')
        },
        {
            path: '/credits',
            name: 'credits',
            component: () => import('@/vue/views/CreditsView.vue')
        },
        {
            path: '/create-game',
            name: 'create-game',
            component: () => import('@/vue/views/GameView.vue')
        },
        {
            path: '/join-game',
            name: 'join-game',
            component: () => import('@/vue/views/GameView.vue')
        },
        {
            path: '/game',
            name: 'game',
            component: () => import('@/vue/views/GameView.vue')
        }
    ]
});
export default router;
//# sourceMappingURL=index.js.map