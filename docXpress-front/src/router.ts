import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router';

import routes from '@/routes/index.routes';

const router = createRouter({
  history: createWebHistory(),
  routes: routes as RouteRecordRaw[],
});

export default router;
