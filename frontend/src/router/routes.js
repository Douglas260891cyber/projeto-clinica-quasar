const routes = [
  {
    path: '/',
    component: () => import('pages/LoginPage.vue'),
  },

  {
    path: '/register',
    component: () => import('pages/RegisterPage.vue'),
  },

  {
    path: '/dashboard',
    component: () => import('pages/DashboardPage.vue'),
    // Esta marca é lida pela guarda global do roteador.
    meta: { requiresAuth: true },
  },

  {
    path: '/vacinas/nova',
    component: () => import('pages/VacinaPage.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/vacinas/editar/:id',
    component: () => import('pages/VacinaPage.vue'),
    meta: { requiresAuth: true },
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
