import appRoutes from '@/routes/app/app.routes';

export default [
  {
    path: '/',
    name: 'default-layout',
    component: () => import('@/layouts/LayoutAppDefault.vue'),
    children: appRoutes,
  },
];
