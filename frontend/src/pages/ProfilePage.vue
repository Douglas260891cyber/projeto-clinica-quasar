<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-grey-9 shadow-1">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold text-green-9">Clínica Pet</q-toolbar-title>
        <q-btn flat color="green-8" icon="dashboard" label="Painel" to="/dashboard" />
      </q-toolbar>
    </q-header>
    <q-page-container>
      <q-page class="bg-grey-2 q-pa-md">
    <div class="page-width">
      <section class="row items-center justify-between q-mb-lg">
        <div>
          <h1 class="text-h5 text-weight-bold q-my-none">Meu perfil</h1>
          <div class="text-grey-7">Mantenha seus dados de contato atualizados.</div>
        </div>
        <q-btn flat color="green-8" icon="arrow_back" label="Voltar ao início" to="/dashboard" />
      </section>

      <q-banner v-if="erro" rounded class="bg-red-1 text-negative q-mb-md" icon="error_outline">{{ erro }}</q-banner>

      <div v-if="carregando" class="flex flex-center q-py-xl"><q-spinner color="green-8" size="42px" /></div>
      <template v-else>
        <q-card flat bordered class="profile-hero q-mb-md">
          <q-card-section class="row items-center q-gutter-md">
            <q-avatar size="76px" color="green-7" text-color="white" class="text-h5">{{ iniciais }}</q-avatar>
            <div class="col">
              <div class="text-h6 text-weight-bold">{{ perfil.nome }}</div>
              <div class="text-grey-7">{{ perfil.email }}</div>
            </div>
            <q-badge outline color="green-8" class="q-pa-sm">Tutor(a) cadastrado(a)</q-badge>
          </q-card-section>
        </q-card>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-md-8">
            <q-card flat bordered>
              <q-card-section><div class="text-h6">Dados pessoais</div><div class="text-caption text-grey-7">Informações usadas pela clínica para seu atendimento.</div></q-card-section>
              <q-separator />
              <q-form @submit="salvarPerfil">
                <q-card-section class="row q-col-gutter-md">
                  <div class="col-12"><q-input v-model.trim="perfil.nome" outlined label="Nome completo *" :rules="[obrigatorio]" /></div>
                  <div class="col-12 col-sm-6"><q-input v-model.trim="perfil.email" outlined type="email" label="E-mail *" :rules="[obrigatorio]" /></div>
                  <div class="col-12 col-sm-6"><q-input v-model="perfil.telefone" outlined label="Telefone / WhatsApp" mask="(##) #####-####" unmasked-value /></div>
                  <div class="col-12 col-sm-6"><q-input v-model="perfil.cpf" outlined label="CPF *" mask="###.###.###-##" unmasked-value :rules="[obrigatorio]" /></div>
                  <div class="col-12 col-sm-6"><q-input v-model="perfil.data_nascimento" outlined type="date" label="Data de nascimento *" :rules="[obrigatorio]" /></div>
                  <div class="col-12"><q-input v-model.trim="perfil.endereco" outlined label="Endereço" placeholder="Rua, número, bairro e cidade" /></div>
                </q-card-section>
                <q-card-actions align="right" class="q-pa-md"><q-btn type="submit" unelevated color="green-7" label="Salvar alterações" :loading="salvando" /></q-card-actions>
              </q-form>
            </q-card>
          </div>

          <div class="col-12 col-md-4">
            <q-card flat bordered class="q-mb-md">
              <q-card-section><div class="text-h6">Seu resumo</div></q-card-section><q-separator />
              <q-list>
                <q-item><q-item-section avatar><q-avatar color="green-1" text-color="green-9" icon="pets" /></q-item-section><q-item-section><q-item-label class="text-weight-bold">{{ totalPets }}</q-item-label><q-item-label caption>pets cadastrados no sistema</q-item-label></q-item-section><q-item-section side><q-btn flat dense color="green-8" icon="arrow_forward" to="/pets" /></q-item-section></q-item>
                <q-item><q-item-section avatar><q-avatar color="green-1" text-color="green-9" icon="calendar_month" /></q-item-section><q-item-section><q-item-label class="text-weight-medium">Conta criada</q-item-label><q-item-label caption>{{ dataCadastro }}</q-item-label></q-item-section></q-item>
              </q-list>
            </q-card>

            <q-card flat bordered>
              <q-card-section><div class="text-h6">Segurança</div><div class="text-caption text-grey-7">Atualize sua senha quando necessário.</div></q-card-section><q-separator />
              <q-card-section class="q-gutter-sm"><q-btn outline color="green-8" class="full-width" icon="lock" label="Alterar senha" @click="dialogSenha = true" /><q-btn flat color="negative" class="full-width" icon="logout" label="Sair da conta" @click="sair" /></q-card-section>
            </q-card>
          </div>
        </div>
      </template>
    </div>

    <q-dialog v-model="dialogSenha"><q-card style="width: 400px; max-width: 92vw"><q-card-section class="row items-center"><div class="text-h6">Alterar senha</div><q-space /><q-btn flat round icon="close" v-close-popup /></q-card-section><q-form @submit="salvarSenha"><q-card-section class="q-gutter-md"><q-input v-model="senha.senhaAtual" outlined :type="mostrarSenha ? 'text' : 'password'" label="Senha atual" :rules="[obrigatorio]" /><q-input v-model="senha.novaSenha" outlined :type="mostrarSenha ? 'text' : 'password'" label="Nova senha" :rules="[val => val?.length >= 6 || 'Use ao menos 6 caracteres']" /><q-input v-model="senha.confirmacao" outlined :type="mostrarSenha ? 'text' : 'password'" label="Confirmar nova senha" :rules="[val => val === senha.novaSenha || 'As senhas não coincidem']" /><q-toggle v-model="mostrarSenha" color="green-7" label="Mostrar senhas" /></q-card-section><q-card-actions align="right"><q-btn flat label="Cancelar" v-close-popup /><q-btn type="submit" unelevated color="green-7" label="Alterar senha" :loading="salvandoSenha" /></q-card-actions></q-form></q-card></q-dialog>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRouter } from 'vue-router'
import { api } from 'src/services/api'
import { limparUsuarioAutenticado, obterUsuarioAutenticado, salvarUsuarioAutenticado } from 'src/services/auth'

const $q = useQuasar()
const router = useRouter()
const usuarioSessao = obterUsuarioAutenticado()
const perfil = reactive({ nome: '', email: '', cpf: '', data_nascimento: '', telefone: '', endereco: '', criado_em: '' })
const senha = reactive({ senhaAtual: '', novaSenha: '', confirmacao: '' })
const carregando = ref(true), salvando = ref(false), salvandoSenha = ref(false), dialogSenha = ref(false), mostrarSenha = ref(false), erro = ref(''), totalPets = ref(0)
const obrigatorio = val => !!val || 'Campo obrigatório'
const iniciais = computed(() => perfil.nome.split(' ').filter(Boolean).slice(0, 2).map(nome => nome[0]).join('').toUpperCase() || 'U')
const dataCadastro = computed(() => perfil.criado_em ? new Date(perfil.criado_em).toLocaleDateString('pt-BR') : 'Não informada')

function aviso (mensagem, tipo = 'positive') { $q.notify({ message: mensagem, color: tipo, position: 'top' }) }
async function carregarPerfil () {
  if (!usuarioSessao?.id) { router.replace('/'); return }
  try {
    const [{ data }, respostaPets] = await Promise.all([api.get(`/autenticacao/usuarios/${usuarioSessao.id}`), api.get('/animais', { params: { usuario_id: usuarioSessao.id } }).catch(() => ({ data: [] }))])
    Object.assign(perfil, data, { data_nascimento: data.data_nascimento?.slice(0, 10) || '' })
    totalPets.value = respostaPets.data.length
  } catch (e) { erro.value = e.response?.data?.mensagem || 'Não foi possível carregar o perfil.' } finally { carregando.value = false }
}
async function salvarPerfil () {
  salvando.value = true
  try {
    const { data } = await api.put(`/autenticacao/usuarios/${usuarioSessao.id}`, perfil)
    Object.assign(perfil, data.usuario, { data_nascimento: data.usuario.data_nascimento?.slice(0, 10) || '' })
    salvarUsuarioAutenticado({ id: data.usuario.id, nome: data.usuario.nome, email: data.usuario.email })
    aviso(data.mensagem)
  } catch (e) { aviso(e.response?.data?.mensagem || 'Não foi possível salvar o perfil.', 'negative') } finally { salvando.value = false }
}
async function salvarSenha () {
  salvandoSenha.value = true
  try { const { data } = await api.put(`/autenticacao/usuarios/${usuarioSessao.id}/senha`, senha); aviso(data.mensagem); dialogSenha.value = false; Object.assign(senha, { senhaAtual: '', novaSenha: '', confirmacao: '' }) } catch (e) { aviso(e.response?.data?.mensagem || 'Não foi possível alterar a senha.', 'negative') } finally { salvandoSenha.value = false }
}
function sair () { limparUsuarioAutenticado(); router.replace('/') }
onMounted(carregarPerfil)
</script>

<style scoped>
.page-width { max-width: 1120px; margin: 0 auto; }
.profile-hero { background: linear-gradient(110deg, #edf8ee, #fff); }
</style>
