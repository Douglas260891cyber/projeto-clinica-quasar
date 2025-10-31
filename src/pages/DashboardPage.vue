<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer show-if-above v-model="drawerOpen" width="250" bordered class="bg-green-6 text-white">
      <div class="drawer-center">
        <q-avatar size="150px" class="q-mb-md">
          <img src="src/assets/user.jpg" alt="User" />
        </q-avatar>

        <div class="text-h6 q-mb-lg">Olá, Douglas</div>

        <q-list dense class="menu-list">
          <q-item clickable v-ripple class="menu-item">
            <q-item-section avatar><q-icon name="event" /></q-item-section>
            <q-item-section>Agenda</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="menu-item">
            <q-item-section avatar><q-icon name="pets" /></q-item-section>
            <q-item-section>Pets</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="menu-item">
            <q-item-section avatar><q-icon name="medication" /></q-item-section>
            <q-item-section>Consultas</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="menu-item">
            <q-item-section avatar><q-icon name="vaccines" /></q-item-section>
            <q-item-section>Vacinas</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="menu-item">
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>Perfil</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <!-- Page container -->
    <q-page-container>
      <q-page class="bg-grey-2">

        <!-- Conteúdo principal -->
        <div class="row no-wrap">
          <div class="col q-pa-md">

            <!-- Próximos eventos -->
            <q-card class="q-mb-md bg-white q-pa-md">
              <div class="text-h6 q-mb-sm">Próximos eventos</div>
              <div class="row q-col-gutter-sm">
                <q-card v-for="i in 5" :key="i" class="col bg-grey-1 q-pa-sm">
                  Evento {{ i }}
                </q-card>
              </div>
            </q-card>

            <!-- Alertas -->
            <q-card class="q-mb-md bg-white q-pa-md">
              <div class="text-h6 q-mb-sm">Alertas</div>
              <div class="bg-grey-3" style="height: 100px; border-radius: 6px;"></div>
            </q-card>

            <!-- Resumo / Histórico / Vacina -->
            <div class="row q-col-gutter-md">
              <q-card class="col bg-white q-pa-md">
                <div class="text-subtitle1">Resumo</div>
              </q-card>
              <q-card class="col bg-white q-pa-md">
                <div class="text-subtitle1">Histórico</div>
              </q-card>
              <q-card class="col bg-white q-pa-md">
                <div class="text-subtitle1">Vacina</div>
              </q-card>
            </div>

          </div>
        </div>

      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref } from 'vue'

const drawerOpen = ref(true)
</script>

<style scoped>
.bg-green-6 {
  background-color: #a3c77b !important;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.drawer-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.menu-list {
  width: 95%;
}

.menu-item {
  background-color: rgba(255, 255, 255, 0.15);
  /* Retângulo translúcido */
  border-radius: 10px;
  margin-bottom: 8px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.25);
  /* Fica mais claro no hover */
  transform: translateY(-2px);
  /* Leve efeito de destaque */
}

.menu-item q-icon {
  color: white;
}

.text-h6 {
  font-weight: 600;
}

.q-mb-md {
  margin-top: 25px;
}
</style>
