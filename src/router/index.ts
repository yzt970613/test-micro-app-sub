import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import Home from '@/pages/Home/Home.vue';
import MATransfer from '@/pages/MATransfer.vue';
import i18n from '@/locale';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    children: [
      {
        path: '/',
        name: 'Index',
        meta: { title: '首页', tag: true },
        component: () => import('@/pages/Index/Index.vue')
      },
      {
        path: '/-',
        name: 'MATransfer',
        props: true,
        component: MATransfer
      }
    ]
  },
  {
    path: '/login',
    name: 'Login',
    meta: { title: '登录' },
    component: () => import('@/pages/Login/Login.vue')
  }
];

const router = createRouter({
  history: createWebHistory(
    window.__MICRO_APP_BASE_ROUTE__ || process.env.BASE_URL
  ),
  routes
});

router.beforeResolve((to, from, next) => {
  document.title =
    i18n.global.t(`router.${to.name as string}`) || to.meta.title || '';
  next();
});

export default router;
