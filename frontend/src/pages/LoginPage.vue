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

            <!-- O q-form permite enviar tanto pelo botão quanto pela tecla Enter. -->
            <q-form @submit="entrar">
              <q-input filled v-model="email" label="E-mail" type="email" class="q-mb-md" dense
                :rules="[val => !!val || 'Informe o e-mail']" />
              <q-input filled v-model="senha" label="Senha" type="password" dense
                :rules="[val => !!val || 'Informe a senha']">
                <template v-slot:after>
                  <q-btn flat dense no-caps class="text-caption text-primary">
                    Esqueceu a senha?
                  </q-btn>
                </template>
              </q-input>

              <q-btn label="Entrar" color="green-6" class="full-width q-mt-lg" unelevated type="submit"
                :loading="carregando" />
              <q-btn flat class="full-width q-mt-sm text-green-7" @click="irParaCadastro">
                Criar conta
              </q-btn>
            </q-form>
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
import { salvarUsuarioAutenticado } from 'src/services/auth'
import pets from 'src/assets/pets.png'

const email = ref('')
const senha = ref('')
const router = useRouter()
const carregando = ref(false)

// Envia as credenciais para a API e navega para o dashboard em caso de sucesso.
const entrar = async () => {
  if (!email.value || !senha.value) {
    Notify.create({
      message: 'Preencha e-mail e senha para entrar.',
      color: 'orange',
      icon: 'warning',
    })
    return
  }
  carregando.value = true
  try {
    const { data: dados } = await api.post('/autenticacao/entrar', {
      email: email.value,
      senha: senha.value,
    })

    // A sessão só é criada depois que a API confirma e devolve o usuário autenticado.
    salvarUsuarioAutenticado(dados.usuario)

    Notify.create({
      message: 'Login realizado com sucesso!',
      color: 'green',
      icon: 'check',
    })
    // replace evita voltar à tela de login pelo botão "voltar" do navegador.
    router.replace('/dashboard')
  } catch (erro) {
    const mensagem = erro?.response?.data?.mensagem || 'Usuário ou senha incorretos!'
    Notify.create({
      message: mensagem,
      color: 'red',
      icon: 'error',
    })
  } finally {
    carregando.value = false
  }
}

// Direciona o usuário para a tela de cadastro.
const irParaCadastro = () => {
  router.push('/register')
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 20px;
}
</style>
