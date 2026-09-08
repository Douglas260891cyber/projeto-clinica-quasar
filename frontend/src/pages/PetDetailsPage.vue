<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-grey-9 shadow-1">
      <q-toolbar><q-toolbar-title class="text-weight-bold text-green-9">Clínica Pet</q-toolbar-title><q-btn flat color="green-8" icon="dashboard" label="Painel" @click="router.push('/dashboard')" /></q-toolbar>
    </q-header>
    <q-page-container>
  <q-page class="bg-grey-2 q-pa-md">
    <div class="page-width">
      <q-btn flat color="green-8" icon="arrow_back" label="Voltar ao painel" @click="router.push('/dashboard')" />

      <div v-if="carregando" class="flex flex-center q-py-xl">
        <q-spinner color="green-7" size="42px" />
      </div>

      <q-banner v-else-if="erro" rounded class="bg-red-1 text-negative q-mt-md">
        {{ erro }}
        <template #action><q-btn flat color="negative" label="Voltar" @click="router.push('/dashboard')" /></template>
      </q-banner>

      <template v-else-if="pet">
        <section class="row items-center justify-between q-col-gutter-md q-mt-sm q-mb-md">
          <div class="col-12 col-md">
            <div class="text-h4 text-weight-bold">Perfil do pet</div>
            <div class="text-grey-7">Informações de saúde e cuidados de {{ pet.nome }}.</div>
          </div>
          <div class="col-12 col-md-auto row q-gutter-sm">
            <q-btn outline color="green-8" icon="edit" label="Editar dados" @click="abrirEdicao" />
            <!-- A agenda ainda usa o nome do pet; este atalho evita o preenchimento manual. -->
            <q-btn unelevated color="green-7" icon="vaccines" label="Registrar vacina" @click="registrarVacina" />
            <q-btn unelevated color="green-7" icon="event" label="Agendar consulta" @click="consultaEmBreve" />
          </div>
        </section>

        <section class="row q-col-gutter-md q-mb-md">
          <div class="col-12 col-md-5">
            <q-card flat bordered class="full-height profile-card">
              <q-card-section class="text-center q-pt-xl">
                <q-avatar size="132px" color="green-1" text-color="green-9" icon="pets">
                  <img v-if="pet.foto_url" :src="pet.foto_url" :alt="`Foto de ${pet.nome}`" @error="pet.foto_url = null" />
                </q-avatar>
                <div class="text-h5 text-weight-bold q-mt-md">{{ pet.nome }}</div>
                <div class="text-grey-7">{{ pet.especie }}<span v-if="pet.raca"> · {{ pet.raca }}</span></div>
              </q-card-section>
              <q-separator />
              <q-list separator>
                <q-item><q-item-section avatar><q-icon name="cake" color="green-8" /></q-item-section><q-item-section><q-item-label caption>Idade</q-item-label><q-item-label>{{ idadeFormatada }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section avatar><q-icon name="monitor_weight" color="green-8" /></q-item-section><q-item-section><q-item-label caption>Peso</q-item-label><q-item-label>{{ pesoFormatado }}</q-item-label></q-item-section></q-item>
                <q-item><q-item-section avatar><q-icon name="notes" color="green-8" /></q-item-section><q-item-section><q-item-label caption>Observações</q-item-label><q-item-label>{{ pet.descricao || 'Nenhuma observação cadastrada.' }}</q-item-label></q-item-section></q-item>
              </q-list>
            </q-card>
          </div>

          <div class="col-12 col-md-7">
            <q-card flat bordered class="q-mb-md">
              <q-card-section class="row items-center">
                <div><div class="text-h6">Próxima vacina</div><div class="text-caption text-grey-7">Acompanhamento preventivo</div></div>
                <q-space />
                <q-icon :name="proximaVacina ? 'event_available' : 'check_circle'" :color="proximaVacina ? 'orange-8' : 'positive'" size="34px" />
              </q-card-section>
              <q-separator />
              <q-card-section v-if="proximaVacina">
                <div class="text-subtitle1 text-weight-medium">{{ rotuloVacina(proximaVacina) }}</div>
                <div class="text-grey-7">{{ formatarData(proximaVacina.data) }} <span v-if="proximaVacina.horario">às {{ proximaVacina.horario }}</span></div>
              </q-card-section>
              <q-card-section v-else class="text-grey-7">Não há vacina futura agendada para este pet.</q-card-section>
            </q-card>

            <q-card flat bordered>
              <q-card-section><div class="text-h6">Histórico de consultas</div><div class="text-caption text-grey-7">Consultas serão exibidas aqui quando o módulo estiver disponível.</div></q-card-section>
              <q-separator />
              <q-card-section class="text-center text-grey-7 q-py-lg"><q-icon name="medical_services" size="32px" color="grey-5" /><div class="q-mt-sm">Nenhuma consulta registrada.</div></q-card-section>
            </q-card>
          </div>
        </section>

        <q-card flat bordered>
          <q-card-section class="row items-center justify-between">
            <div><div class="text-h6">Histórico de vacinas</div><div class="text-caption text-grey-7">Vacinas agendadas e já realizadas para {{ pet.nome }}.</div></div>
            <q-btn flat color="green-8" icon="add" label="Registrar vacina" @click="registrarVacina" />
          </q-card-section>
          <q-separator />
          <q-list v-if="vacinas.length" separator>
            <q-item v-for="vacina in vacinas" :key="vacina.id">
              <q-item-section avatar><q-avatar color="green-1" text-color="green-8" icon="vaccines" /></q-item-section>
              <q-item-section><q-item-label>{{ rotuloVacina(vacina) }}</q-item-label><q-item-label caption>{{ formatarData(vacina.data) }}<span v-if="vacina.local"> · {{ vacina.local }}</span></q-item-label></q-item-section>
              <q-item-section side><q-btn flat round dense icon="edit" color="green-8" @click="router.push(`/vacinas/editar/${vacina.id}`)" /></q-item-section>
            </q-item>
          </q-list>
          <q-card-section v-else class="text-center text-grey-7 q-py-xl"><q-icon name="vaccines" size="38px" color="grey-5" /><div class="q-mt-sm">Nenhuma vacina registrada.</div></q-card-section>
        </q-card>
      </template>
    </div>

    <q-dialog v-model="edicaoAberta" persistent>
      <q-card style="width: 580px; max-width: 94vw">
        <q-card-section class="row items-center"><div class="text-h6">Editar dados de {{ pet?.nome }}</div><q-space /><q-btn flat round icon="close" v-close-popup /></q-card-section>
        <q-form @submit="salvarEdicao">
          <q-card-section class="row q-col-gutter-md">
            <div class="col-12 col-sm-6"><q-input v-model="form.nome" outlined label="Nome *" :rules="[obrigatorio]" /></div>
            <div class="col-12 col-sm-6"><q-input v-model="form.especie" outlined label="Espécie *" :rules="[obrigatorio]" /></div>
            <div class="col-12 col-sm-6"><q-input v-model="form.raca" outlined label="Raça" /></div>
            <div class="col-12 col-sm-6"><q-input v-model.number="form.idade" outlined type="number" min="0" label="Idade (anos)" /></div>
            <div class="col-12 col-sm-6"><q-input v-model.number="form.peso" outlined type="number" min="0" step="0.01" suffix="kg" label="Peso" /></div>
            <div class="col-12 col-sm-6"><q-input v-model="form.foto_url" outlined type="url" label="URL da foto" /></div>
            <div class="col-12"><q-input v-model="form.descricao" outlined type="textarea" label="Observações" /></div>
          </q-card-section>
          <q-card-actions align="right"><q-btn flat label="Cancelar" v-close-popup /><q-btn color="green-7" label="Salvar alterações" type="submit" :loading="salvando" /></q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import axios from 'axios'
import { api } from 'src/services/api'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()
const pet = ref(null)
const vacinas = ref([])
const carregando = ref(true)
const erro = ref('')
const edicaoAberta = ref(false)
const salvando = ref(false)
const form = reactive({ nome: '', especie: '', raca: '', idade: null, peso: null, foto_url: '', descricao: '' })

const idadeFormatada = computed(() => pet.value?.idade === null || pet.value?.idade === undefined ? 'Não informada' : `${pet.value.idade} ano(s)`)
const pesoFormatado = computed(() => pet.value?.peso ? `${Number(pet.value.peso).toLocaleString('pt-BR')} kg` : 'Não informado')
// O histórico é decrescente; para o alerta, selecionamos a data futura mais próxima.
const proximaVacina = computed(() => vacinas.value
  .filter((vacina) => new Date(`${vacina.data}T12:00:00`) >= inicioDoDia())
  .sort((a, b) => a.data.localeCompare(b.data))[0])
const obrigatorio = (valor) => !!valor || 'Campo obrigatório'

onMounted(carregarFicha)

async function carregarFicha() {
  carregando.value = true
  try {
    const [respostaPet, respostaVacinas] = await Promise.all([
      api.get(`/animais/${route.params.id}`),
      // O serviço de agenda atual é separado da API principal, por isso esta chamada mantém a URL existente.
      axios.get('http://localhost:3000/vacinas').catch(() => ({ data: [] })),
    ])
    pet.value = respostaPet.data
    vacinas.value = respostaVacinas.data.filter((vacina) => normalizarNome(vacina.pet) === normalizarNome(pet.value.nome)).sort((a, b) => b.data.localeCompare(a.data))
  } catch (causa) {
    erro.value = causa?.response?.status === 404 ? 'Não encontramos este pet.' : 'Não foi possível carregar a ficha do pet.'
  } finally {
    carregando.value = false
  }
}

function abrirEdicao() {
  Object.assign(form, pet.value)
  edicaoAberta.value = true
}

async function salvarEdicao() {
  salvando.value = true
  try {
    const { data } = await api.put(`/animais/${pet.value.id}`, form)
    pet.value = data.animal
    edicaoAberta.value = false
    $q.notify({ type: 'positive', message: 'Dados do pet atualizados.' })
  } catch (causa) {
    $q.notify({ type: 'negative', message: causa?.response?.data?.mensagem || 'Não foi possível salvar as alterações.' })
  } finally {
    salvando.value = false
  }
}

function registrarVacina() { router.push({ path: '/vacinas/nova', query: { pet: pet.value.nome } }) }
function consultaEmBreve() { $q.notify({ color: 'blue-7', icon: 'info', message: 'O agendamento de consultas será disponibilizado em breve.' }) }
function inicioDoDia() { const data = new Date(); data.setHours(0, 0, 0, 0); return data }
function formatarData(data) { return new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR') }
function normalizarNome(nome) { return String(nome || '').trim().toLocaleLowerCase('pt-BR') }
function rotuloVacina(vacina) { return vacina.observacao || 'Vacina agendada' }
</script>

<style scoped>
.page-width { max-width: 1180px; margin: 0 auto; }
.profile-card { overflow: hidden; }
</style>
