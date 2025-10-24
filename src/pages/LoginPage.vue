<template>
  <div class="flex flex-center bg-grey-2" style="min-height: 100vh">
    <div class="q-pa-md" style="width: 400px; max-width: 90vw">
      <!-- Card principal -->
      <q-card flat bordered class="q-pa-lg bg-white text-center rounded-borders">

        <!-- Imagem superior -->
        <div class="q-mb-lg">
          <div class="relative-position">
            <q-img src="https://placekitten.com/800/400" alt="Imagem de login"
              style="border-radius: 50% 50% 0 0; height: 180px; object-fit: cover" />
            <q-avatar size="64px" class="absolute-center shadow-3" style="top: 140px; transform: translateY(-50%)">
              <q-icon name="mdi-paw" size="40px" color="green-6" />
            </q-avatar>
          </div>
        </div>

        <!-- Botões sociais -->
        <div class="row q-col-gutter-sm justify-center q-mb-md">
          <q-btn round flat color="grey-8" icon="mdi-google" />
          <q-btn round flat color="blue-8" icon="mdi-facebook" />
          <q-btn round flat color="grey-8" icon="mdi-twitter" />
        </div>

        <div class="text-grey q-mb-md">Faça login para continuar</div>

        <!-- Campos de login -->
        <q-input filled v-model="username" label="Usuário" class="q-mb-md" dense />
        <q-input filled v-model="password" label="Senha" type="password" dense>
          <template v-slot:after>
            <q-btn flat dense no-caps class="text-caption text-primary">
              Esqueceu a senha?
            </q-btn>
          </template>
        </q-input>

        <!-- Botão Entrar -->
        <q-btn label="Entrar" color="green-6" class="full-width q-mt-lg" unelevated />
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const username = ref('')
const password = ref('')
</script>

<style scoped>
.rounded-borders {
  border-radius: 20px;
}
</style>
