<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="bg-grey-2 flex flex-center q-py-lg">
        <div class="q-pa-md" style="width: 760px; max-width: 96vw">
          <q-card flat bordered class="bg-white rounded-borders">
            <q-card-section class="text-center q-pt-lg">
              <q-avatar size="64px" class="bg-green-1 text-green-8 q-mb-sm">
                <q-icon name="medical_services" size="34px" />
              </q-avatar>
              <div class="text-h5 text-weight-bold text-green-9">Cadastro de veterinário</div>
              <div class="text-grey-7 q-mt-xs">Informe seus dados profissionais e crie seu acesso à clínica.</div>
            </q-card-section>

            <q-form @submit.prevent="cadastrar">
              <q-card-section class="row q-col-gutter-md q-pt-sm">
                <div class="col-12 col-sm-6"><q-input v-model.trim="formulario.nome" outlined label="Nome completo *" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-sm-6"><q-input v-model="formulario.cpf" outlined label="CPF *" mask="###.###.###-##" unmasked-value :rules="[obrigatorio]" /></div>
                <div class="col-12 col-sm-6"><q-input v-model="formulario.data_nascimento" outlined type="date" label="Data de nascimento *" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-sm-6"><q-input v-model.trim="formulario.email" outlined type="email" label="E-mail *" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-sm-6"><q-input v-model="formulario.telefone" outlined label="Telefone / WhatsApp" mask="(##) #####-####" /></div>
                <div class="col-12 col-sm-6"><q-input v-model.trim="formulario.endereco" outlined label="Endereço" /></div>
                <div class="col-12 col-sm-6"><q-input v-model.trim="formulario.crmv" outlined label="CRMV *" hint="Informe o número e a UF, se aplicável" :rules="[obrigatorio]" /></div>
                <div class="col-12 col-sm-6"><q-input v-model.trim="formulario.especialidade" outlined label="Especialidade *" :rules="[obrigatorio]" /></div>
                <div class="col-12"><q-select v-model="formulario.clinica_id" :options="opcoesClinicas" outlined label="Clínica *" emit-value map-options :rules="[obrigatorio]" /></div>
                <div class="col-12 col-sm-6"><q-input v-model="formulario.senha" outlined label="Senha *" :type="mostrarSenha ? 'text' : 'password'" :rules="[val => val?.length >= 6 || 'Use ao menos 6 caracteres']"><template #append><q-icon :name="mostrarSenha ? 'visibility_off' : 'visibility'" class="cursor-pointer" @click="mostrarSenha = !mostrarSenha" /></template></q-input></div>
                <div class="col-12 col-sm-6"><q-input v-model="confirmacaoSenha" outlined label="Confirmar senha *" :type="mostrarSenha ? 'text' : 'password'" :rules="[val => val === formulario.senha || 'As senhas não coincidem']" /></div>
              </q-card-section>
              <q-card-actions vertical class="q-px-md q-pb-lg">
                <q-btn label="Cadastrar veterinário" color="green-7" unelevated type="submit" :loading="carregando" />
                <q-btn flat color="green-8" label="Já tenho conta" @click="router.push('/')" />
                <q-btn flat color="grey-7" label="Sou tutor e quero criar uma conta" @click="router.push('/register')" />
              </q-card-actions>
            </q-form>
          </q-card>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/services/clienteApi'

const router = useRouter()
const $q = useQuasar()
const carregando = ref(false)
const mostrarSenha = ref(false)
const confirmacaoSenha = ref('')
const opcoesClinicas = ref([])
const obrigatorio = valor => !!valor || 'Campo obrigatório'
const formulario = reactive({ nome: '', cpf: '', data_nascimento: '', email: '', telefone: '', endereco: '', crmv: '', especialidade: '', senha: '', clinica_id: null })

onMounted(async () => {
  try {
    const { data } = await api.get('/clinicas')
    opcoesClinicas.value = data.map((clinica) => ({ label: [clinica.nome, clinica.cidade, clinica.estado].filter(Boolean).join(' - '), value: clinica.id }))
  } catch {
    $q.notify({ type: 'warning', message: 'Não foi possível carregar a lista de clínicas.' })
  }
})

async function cadastrar() {
  if (!formulario.clinica_id) {
    $q.notify({ type: 'negative', message: 'Selecione uma clínica.' })
    return
  }
  if (formulario.senha !== confirmacaoSenha.value) {
    $q.notify({ type: 'negative', message: 'As senhas não coincidem.' })
    return
  }
  carregando.value = true
  try {
    const { data } = await api.post('/veterinarios/cadastro', { ...formulario, confirmar_senha: confirmacaoSenha.value })
    $q.notify({ type: 'positive', message: data.mensagem || 'Veterinário cadastrado com sucesso.' })
    router.replace('/')
  } catch (erro) {
    $q.notify({ type: 'negative', message: erro.response?.data?.mensagem || 'Não foi possível concluir o cadastro.' })
  } finally {
    carregando.value = false
  }
}
</script>

<style scoped>
.rounded-borders { border-radius: 20px; }
</style>
