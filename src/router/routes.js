const routes = [
  {
    path: '/',
    component: () => import('pages/LoginPage.vue'),
  },

  {
    path: '/dashboard',
    component: () => import('pages/DashboardPage.vue'),
  },

  {
    path: '/vacinas',
    component: () => import('pages/VacinaPage.vue'),
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
