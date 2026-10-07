<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-grey-9 shadow-1">
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="lt-md" aria-label="Abrir menu"
          @click="leftDrawerOpen = !leftDrawerOpen" />
        <q-toolbar-title class="text-weight-bold text-green-9">Clínica Pet</q-toolbar-title>
        <div class="gt-xs text-body2 q-mr-sm">Olá, {{ primeiroNome }}</div>
        <q-avatar color="green-6" text-color="white" size="34px">{{ iniciaisUsuario }}</q-avatar>
        <q-btn flat round dense icon="logout" color="negative" class="q-ml-sm" aria-label="Sair" @click="logout">
          <q-tooltip>Sair da conta</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above :width="250" bordered class="bg-green-7 text-white">
      <div class="drawer-content q-pa-md">
        <q-avatar size="82px" class="bg-white text-green-8 q-mb-sm">{{ iniciaisUsuario }}</q-avatar>
        <div class="text-h6">{{ usuario.nome || 'Usuário' }}</div>
        <div class="text-caption q-mb-lg text-green-1">{{ dataAtual }}</div>
        <q-list padding>
          <q-item clickable v-ripple to="/dashboard" active-class="menu-active" :active="$route.path === '/dashboard'">
            <q-item-section avatar><q-icon name="event" /></q-item-section>
            <q-item-section>Agenda</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/pets" active-class="menu-active" :active="$route.path.startsWith('/pets')">
            <q-item-section avatar><q-icon name="pets" /></q-item-section>
            <q-item-section>Pets</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/agendamentos" active-class="menu-active"
            :active="$route.path.startsWith('/agendamentos')">
            <q-item-section avatar><q-icon name="event_available" /></q-item-section>
            <q-item-section>Agendamentos</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/perfil" active-class="menu-active" :active="$route.path === '/perfil'">
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>Perfil</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { limparUsuarioAutenticado, obterUsuarioAutenticado } from 'src/services/auth'

const leftDrawerOpen = ref(false)
const usuario = obterUsuarioAutenticado() || {}
const $q = useQuasar()
const router = useRouter()
const dataAtual = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())
const primeiroNome = computed(() => usuario.nome?.split(' ')[0] || 'usuário')
const iniciaisUsuario = computed(() => (usuario.nome || 'U').split(' ').map((nome) => nome[0]).slice(0, 2).join('').toUpperCase())

function logout() {
  limparUsuarioAutenticado()
  router.replace('/')
  $q.notify({ type: 'positive', message: 'Você saiu da conta.' })
}
</script>

<style scoped>
.drawer-content {
  min-height: 100%;
}

.menu-active,
.q-item:hover {
  background: rgba(255, 255, 255, .16);
  border-radius: 8px;
}

@media (min-width: 600px) {
  .q-drawer {
    top: 64px;
  }
}
</style>
