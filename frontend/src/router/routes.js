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
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('pages/DashboardPage.vue') },
      { path: 'perfil', component: () => import('pages/ProfilePage.vue') },
      { path: 'pets', component: () => import('pages/PetsPage.vue') },
      { path: 'pets/:id', component: () => import('pages/PetDetailsPage.vue') },
      { path: 'agendamentos', component: () => import('pages/AgendamentosPage.vue') },
      { path: 'agendamentos/novo', redirect: '/agendamentos' },
      { path: 'agendamentos/editar/:id', redirect: to => `/agendamentos?editar=${to.params.id}` },
      { path: 'vacinas/nova', redirect: '/agendamentos?tipo=vacina' },
      { path: 'vacinas/editar/:id', redirect: to => `/agendamentos?editar=${to.params.id}` },
      { path: ':catchAll(.*)*', component: () => import('pages/ErrorNotFound.vue') },
    ],
  },
]

export default routes
