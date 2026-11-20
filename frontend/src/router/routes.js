const routes = [
  {
    path: '/',
    component: () => import('pages/PaginaLogin.vue'),
  },
  {
    path: '/register',
    component: () => import('pages/PaginaCadastro.vue'),
  },
  {
    path: '/',
    component: () => import('layouts/LayoutPrincipal.vue'),
    meta: { requiresAuth: true },
    children: [
      { path: 'dashboard', component: () => import('pages/PaginaPainel.vue') },
      { path: 'perfil', component: () => import('pages/PaginaPerfil.vue') },
      { path: 'pets', component: () => import('pages/PaginaAnimais.vue') },
      { path: 'pets/:id', component: () => import('pages/PaginaDetalhesAnimal.vue') },
      { path: 'agendamentos', component: () => import('pages/PaginaAgendamentos.vue') },
      { path: 'agendamentos/novo', redirect: '/agendamentos' },
      { path: 'agendamentos/editar/:id', redirect: to => `/agendamentos?editar=${to.params.id}` },
      { path: 'vacinas/nova', redirect: '/agendamentos?tipo=vacina' },
      { path: 'vacinas/editar/:id', redirect: to => `/agendamentos?editar=${to.params.id}` },
      { path: ':catchAll(.*)*', component: () => import('pages/PaginaNaoEncontrada.vue') },
    ],
  },
]

export default routes
