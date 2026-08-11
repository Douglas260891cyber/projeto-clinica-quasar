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

            <q-form @submit.prevent="cadastrar" class="q-gutter-md">
              <q-input filled v-model="form.nome" label="Nome completo" dense
                :rules="[val => !!val || 'Campo obrigatório']" />
              <q-input filled v-model="formulario.cpf" label="CPF" dense mask="###.###.###-##"
                :rules="[val => !!val || 'Campo obrigatório']" />
              <q-input filled v-model="formulario.data_nascimento" label="Data de nascimento" type="date" dense
                :rules="[val => !!val || 'Campo obrigatório']" />
              <q-input filled v-model="formulario.email" label="E-mail" type="email" dense
                :rules="[val => !!val || 'Campo obrigatório']" />
              <q-input filled v-model="formulario.senha" label="Senha" type="password" dense
                :rules="[val => !!val || 'Campo obrigatório']" />

              <q-btn label="Cadastrar" color="green-6" class="full-width" unelevated type="submit" :loading="carregando" />
              <q-btn flat class="full-width text-green-7" @click="irParaLogin">
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
const carregando = ref(false)
const formulario = reactive({
  nome: '',
  cpf: '',
  data_nascimento: '',
  email: '',
  senha: ''
})

// Envia os dados de cadastro para a API e redireciona para a tela de login.
const cadastrar = async () => {
  if (!formulario.nome || !formulario.cpf || !formulario.data_nascimento || !formulario.email || !formulario.senha) {
    Notify.create({
      message: 'Preencha todos os campos para continuar.',
      color: 'orange',
      icon: 'warning'
    })
    return
  }

  carregando.value = true
  try {
    await api.post('/autenticacao/cadastro', {
      nome: formulario.nome,
      cpf: formulario.cpf,
      data_nascimento: formulario.data_nascimento,
      email: formulario.email,
      senha: formulario.senha
    })

    Notify.create({
      message: 'Conta criada com sucesso! Faça login.',
      color: 'green',
      icon: 'check'
    })
    router.push('/')
  } catch (erro) {
    const mensagem = erro?.response?.data?.mensagem || 'Erro ao cadastrar usuário.'
    Notify.create({
      message: mensagem,
      color: 'red',
      icon: 'error'
    })
  } finally {
    carregando.value = false
  }
}

// Volta para a tela de login.
const irParaLogin = () => {
  router.push('/')
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 20px;
}
</style>
