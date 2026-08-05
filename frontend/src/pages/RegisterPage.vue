<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="bg-grey-2 flex flex-center">
        <div class="q-pa-md" style="width: 420px; max-width: 95vw">
          <q-card flat bordered class="q-pa-lg bg-white text-center rounded-borders">
            <div class="q-mb-lg">
              <q-avatar size="70px" class="q-mb-md bg-green-6 text-white">
                <q-icon name="mdi-account-plus" size="36px" />
              </q-avatar>
              <div class="text-h6 text-green-9 q-mb-sm">Criar conta</div>
              <div class="text-grey">Preencha seus dados para se cadastrar.</div>
            </div>

            <q-form @submit.prevent="register" class="q-gutter-md">
              <q-input filled v-model="form.name" label="Nome completo" dense
                :rules="[val => !!val || 'Campo obrigatório']" />
              <q-input filled v-model="form.cpf" label="CPF" dense mask="###.###.###-##"
                :rules="[val => !!val || 'Campo obrigatório']" />
              <q-input filled v-model="form.date_of_birth" label="Data de nascimento" type="date" dense
                :rules="[val => !!val || 'Campo obrigatório']" />
              <q-input filled v-model="form.email" label="E-mail" type="email" dense
                :rules="[val => !!val || 'Campo obrigatório']" />
              <q-input filled v-model="form.password" label="Senha" type="password" dense
                :rules="[val => !!val || 'Campo obrigatório']" />

              <q-btn label="Cadastrar" color="green-6" class="full-width" unelevated type="submit" :loading="loading" />
              <q-btn flat class="full-width text-green-7" @click="goToLogin">
                Já tenho conta
              </q-btn>
            </q-form>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
// Página de cadastro do frontend. Coleta os dados do usuário e envia para o backend.
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { Notify } from 'quasar'
import { api } from 'src/services/api'

const router = useRouter()
const loading = ref(false)
const form = reactive({
  name: '',
  cpf: '',
  date_of_birth: '',
  email: '',
  password: ''
})

// Envia os dados de cadastro para a API e redireciona para a tela de login.
const register = async () => {
  if (!form.name || !form.cpf || !form.date_of_birth || !form.email || !form.password) {
    Notify.create({
      message: 'Preencha todos os campos para continuar.',
      color: 'orange',
      icon: 'warning'
    })
    return
  }

  loading.value = true
  try {
    await api.post('/auth/register', {
      name: form.name,
      cpf: form.cpf,
      date_of_birth: form.date_of_birth,
      email: form.email,
      password: form.password
    })

    Notify.create({
      message: 'Conta criada com sucesso! Faça login.',
      color: 'green',
      icon: 'check'
    })
    router.push('/')
  } catch (error) {
    const message = error?.response?.data?.message || 'Erro ao cadastrar usuário.'
    Notify.create({
      message,
      color: 'red',
      icon: 'error'
    })
  } finally {
    loading.value = false
  }
}

// Volta para a tela de login.
const goToLogin = () => {
  router.push('/')
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 20px;
}
</style>
