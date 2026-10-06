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
    path: '/perfil',
    component: () => import('pages/ProfilePage.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/pets',
    component: () => import('pages/PetsPage.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/pets/:id',
    component: () => import('pages/PetDetailsPage.vue'),
    meta: { requiresAuth: true },
  },

  {
    path: '/agendamentos',
    component: () => import('pages/AgendamentosPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/agendamentos/novo',
    redirect: '/agendamentos',
    meta: { requiresAuth: true },
  },
  {
    path: '/agendamentos/editar/:id',
    redirect: to => `/agendamentos?editar=${to.params.id}`,
    meta: { requiresAuth: true },
  },
  { path: '/vacinas/nova', redirect: '/agendamentos?tipo=vacina' },
  { path: '/vacinas/editar/:id', redirect: to => `/agendamentos?editar=${to.params.id}` },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
