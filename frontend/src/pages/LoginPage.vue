<template>
  <q-layout view="hHh lpR fFf">

    <!-- Page container obrigatório -->
    <q-page-container>
      <q-page class="bg-grey-2 flex flex-center">

        <div class="q-pa-md" style="width: 400px; max-width: 90vw">
          <!-- Card principal -->
          <q-card flat bordered class="q-pa-lg bg-white text-center rounded-borders">
            <!-- Imagem superior -->
            <div class="q-mb-lg">
              <div class="relative-position">
                <q-img :src="pets" alt="Imagem de login"
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
            <q-input filled v-model="email" label="E-mail" type="email" class="q-mb-md" dense />
            <q-input filled v-model="password" label="Senha" type="password" dense>
              <template v-slot:after>
                <q-btn flat dense no-caps class="text-caption text-primary">
                  Esqueceu a senha?
                </q-btn>
              </template>
            </q-input>

            <!-- Botões -->
            <q-btn label="Entrar" color="green-6" class="full-width q-mt-lg" unelevated :loading="loading"
              @click="login" />
            <q-btn flat class="full-width q-mt-sm text-green-7" @click="goToRegister">
              Criar conta
            </q-btn>
          </q-card>
        </div>

      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
// Página de login do frontend. Recebe e-mail e senha e autentica o usuário.
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { api } from 'src/services/api'
import pets from 'src/assets/pets.png'

const email = ref('')
const password = ref('')
const router = useRouter()
const loading = ref(false)

// Envia as credenciais para a API e navega para o dashboard em caso de sucesso.
const login = async () => {
  if (!email.value || !password.value) {
    Notify.create({
      message: 'Preencha e-mail e senha para entrar.',
      color: 'orange',
      icon: 'warning',
    })
    return
  }
  loading.value = true
  try {
    await api.post('/auth/login', {
      email: email.value,
      password: password.value,
    })

    Notify.create({
      message: 'Login realizado com sucesso!',
      color: 'green',
      icon: 'check',
    })
    router.push('/dashboard')
  } catch (error) {
    const message = error?.response?.data?.message || 'Usuário ou senha incorretos!'
    Notify.create({
      message,
      color: 'red',
      icon: 'error',
    })
  } finally {
    loading.value = false
  }
}

// Direciona o usuário para a tela de cadastro.
const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 20px;
}
</style>
