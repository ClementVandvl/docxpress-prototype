export default [
  {
    path: '',
    name: 'home',
    component: () => import('@/views/app/HomePage.view.vue'),
  },
  {
    path: 'files',
    name: 'file-list',
    component: () => import('@/views/app/FileListPage.view.vue'),
  },
  {
    path: 'links',
    name: 'link-list',
    component: () => import('@/views/app/LinksPage.view.vue'),
  },
];
