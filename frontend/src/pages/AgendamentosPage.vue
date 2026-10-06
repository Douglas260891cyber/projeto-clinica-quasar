<template>
  <q-layout view="hHh lpR fFf">
    <q-page-container>
      <q-page class="bg-grey-2 q-pa-md">
        <div class="q-mx-auto" style="max-width: 1280px;">
          <div class="row items-center justify-between q-mb-lg">
            <div>
              <div class="text-h4 text-weight-bold text-green-9">Agendamentos</div>
              <div class="text-body2 text-grey-7">Cadastre, edite e acompanhe os próximos atendimentos do pet.</div>
            </div>
            <q-btn flat color="green-8" icon="refresh" label="Atualizar" @click="carregarAgendamentos" />
          </div>

          <div class="row q-col-gutter-lg">
            <div class="col-12 col-lg-5">
              <q-card flat bordered class="q-mb-lg rounded-borders">
                <q-card-section class="row items-center justify-between">
                  <div class="text-h6">Novo agendamento</div>
                  <q-badge v-if="modoEdicao" color="green-7" label="Edição" />
                </q-card-section>
                <q-separator />

                <q-card-section>
                  <div class="text-subtitle2 text-grey-8 q-mb-sm">Tipo de serviço</div>
                  <div class="row q-col-gutter-sm">
                    <div v-for="tipo in tipos" :key="tipo.value" class="col-6 col-sm-4">
                      <q-card clickable flat bordered class="service-card"
                        :class="{ 'service-card--selected': form.tipo === tipo.value }" @click="form.tipo = tipo.value">
                        <q-card-section class="column items-center text-center q-py-md">
                          <q-icon :name="tipo.icon" size="26px" />
                          <div class="text-subtitle2 q-mt-sm">{{ tipo.label }}</div>
                        </q-card-section>
                      </q-card>
                    </div>
                  </div>
                </q-card-section>

                <q-separator />

                <q-form class="q-pa-md q-gutter-md" @submit.prevent="salvar">
                  <div class="row q-col-gutter-md">
                    <div class="col-12 col-sm-6">
                      <q-select v-model="form.pet" outlined label="Pet *" :options="opcoesPets"
                        :loading="carregandoPets" :rules="[obrigatorio]" />
                    </div>
                    <div class="col-6 col-sm-3">
                      <q-input v-model="form.data" outlined type="date" label="Data *" :rules="[obrigatorio]" />
                    </div>
                    <div class="col-6 col-sm-3">
                      <q-input v-model="form.horario" outlined type="time" label="Horário" />
                    </div>
                    <div class="col-12">
                      <q-select v-model="form.local" outlined label="Local *" :options="locais"
                        :rules="[obrigatorio]" />
                    </div>
                  </div>

                  <div v-if="form.tipo === 'vacina'" class="service-fields">
                    <div class="text-subtitle1 text-green-9">Dados da vacinação</div>
                    <q-input v-model="form.vacina" outlined label="Vacina / imunizante" />
                    <q-select v-model="form.profissional" outlined label="Veterinário(a) responsável"
                      :options="profissionais" />
                  </div>

                  <div v-else-if="form.tipo === 'consulta'" class="service-fields">
                    <div class="text-subtitle1 text-green-9">Dados da consulta</div>
                    <q-input v-model="form.motivo_consulta" outlined type="textarea" label="Motivo da consulta" />
                    <q-select v-model="form.profissional" outlined label="Veterinário(a)" :options="profissionais" />
                  </div>

                  <div v-else-if="form.tipo === 'banho' || form.tipo === 'tosa'" class="service-fields">
                    <div class="text-subtitle1 text-green-9">Dados do serviço</div>
                    <q-select v-model="form.porte" outlined label="Porte do pet"
                      :options="['Pequeno', 'Médio', 'Grande']" />
                    <q-input v-model="form.profissional" outlined label="Profissional (opcional)" />
                    <q-input v-model="form.observacao" outlined type="textarea" label="Preferências do serviço" />
                  </div>

                  <div v-else class="service-fields">
                    <div class="text-subtitle1 text-green-9">Outros serviços</div>
                    <q-input v-model="form.servico_outro" outlined label="Qual serviço?" :rules="[obrigatorio]" />
                    <q-input v-model="form.profissional" outlined label="Profissional (opcional)" />
                  </div>

                  <q-input v-model="form.observacao" outlined type="textarea" label="Observações gerais" />

                  <div class="row justify-end q-gutter-sm">
                    <q-btn flat label="Limpar" @click="resetarFormulario" />
                    <q-btn color="green-7" type="submit" :loading="salvando"
                      :label="modoEdicao ? 'Salvar alterações' : 'Agendar serviço'" />
                  </div>
                </q-form>
              </q-card>
            </div>

            <div class="col-12 col-lg-7">
              <q-card flat bordered class="rounded-borders">
                <q-card-section class="row items-center justify-between q-col-gutter-md">
                  <div>
                    <div class="text-h6">Próximos agendamentos</div>
                    <div class="text-caption text-grey-7">Lista consolidada por tipo e status.</div>
                  </div>
                  <div class="row q-gutter-sm">
                    <q-select v-model="filtroTipo" dense outlined label="Tipo" :options="opcoesFiltroTipo"
                      option-value="value" option-label="label" />
                    <q-select v-model="filtroStatus" dense outlined label="Status" :options="opcoesFiltroStatus"
                      option-value="value" option-label="label" />
                  </div>
                </q-card-section>
                <q-separator />

                <q-list v-if="agendamentosFiltrados.length" separator>
                  <q-item v-for="item in agendamentosFiltrados" :key="item.id" class="q-py-sm">
                    <q-item-section avatar>
                      <q-avatar :color="corTipo(item.tipo)" text-color="white" :icon="iconeTipo(item.tipo)" />
                    </q-item-section>

                    <q-item-section>
                      <q-item-label class="text-weight-medium">{{ rotuloTipo(item.tipo) }} · {{ item.pet
                        }}</q-item-label>
                      <q-item-label caption>{{ formatarData(item.data) }} {{ item.horario ? `· ${item.horario}` : '' }}
                        · {{ item.local }}</q-item-label>
                      <q-item-label v-if="descricaoItem(item)" caption>{{ descricaoItem(item) }}</q-item-label>
                    </q-item-section>

                    <q-item-section side class="text-right">
                      <q-badge :color="corStatus(item)" :label="rotuloStatus(item)" class="q-mb-sm" />
                      <div class="row q-col-gutter-xs justify-end">
                        <q-btn flat dense round icon="edit" color="green-8" @click="carregarAgendamento(item.id)" />
                        <q-btn flat dense round icon="delete" color="negative" @click="deletarAgendamento(item.id)" />
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>

                <q-card-section v-else class="text-center text-grey-7 q-py-xl">
                  <q-icon name="event_available" size="38px" color="grey-5" />
                  <div class="q-mt-sm">Nenhum agendamento encontrado para este filtro.</div>
                </q-card-section>
              </q-card>
            </div>
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/services/api'
import { obterUsuarioAutenticado } from 'src/services/auth'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()
const usuario = obterUsuarioAutenticado() || {}

const tipos = [
  { label: 'Consulta', value: 'consulta', icon: 'medical_services' },
  { label: 'Vacinação', value: 'vacina', icon: 'vaccines' },
  { label: 'Banho', value: 'banho', icon: 'shower' },
  { label: 'Tosa', value: 'tosa', icon: 'content_cut' },
  { label: 'Outros', value: 'outro', icon: 'more_horiz' },
]

const locais = ['Clínica Central', 'Unidade Norte', 'Unidade Sul', 'HospVet Municipal', 'Posto Veterinário São José']
const profissionais = ['Dr. Ricardo Silva', 'Dra. Ana Paula Mendes', 'Dr. Júlio Carrara', 'Dra. Beatriz Nunes', 'Dr. Marcos Torres']
const opcoesFiltroTipo = computed(() => [{ label: 'Todos', value: 'todos' }, ...tipos.map((tipo) => ({ label: tipo.label, value: tipo.value }))])
const opcoesFiltroStatus = [
  { label: 'Todos', value: 'todos' },
  { label: 'Agendado', value: 'agendado' },
  { label: 'Realizado', value: 'realizado' },
]

const opcoesPets = ref([])
const carregandoPets = ref(true)
const agendamentos = ref([])
const filtroTipo = ref('todos')
const filtroStatus = ref('todos')
const salvando = ref(false)

const form = ref({
  pet: '',
  tipo: 'consulta',
  data: '',
  horario: '',
  local: '',
  profissional: '',
  observacao: '',
  vacina: '',
  motivo_consulta: '',
  porte: '',
  servico_outro: '',
})

const itemEditandoId = computed(() => route.query.editar || route.params.id)
const modoEdicao = computed(() => Boolean(itemEditandoId.value))

const agendamentosFiltrados = computed(() => {
  return [...agendamentos.value]
    .filter((item) => {
      const tipoOk = filtroTipo.value === 'todos' || item.tipo === filtroTipo.value
      const statusOk = filtroStatus.value === 'todos' || statusAgendamento(item) === filtroStatus.value
      return tipoOk && statusOk
    })
    .sort((a, b) => new Date(`${a.data}T12:00:00`) - new Date(`${b.data}T12:00:00`))
})

const obrigatorio = (valor) => !!valor || 'Campo obrigatório'

onMounted(async () => {
  await carregarPets()
  await carregarAgendamentos()

  if (route.query.pet) form.value.pet = String(route.query.pet)
  if (route.query.tipo && tipos.some((tipo) => tipo.value === route.query.tipo)) {
    form.value.tipo = String(route.query.tipo)
  }

  if (modoEdicao.value) {
    await carregarAgendamento(itemEditandoId.value)
  }
})

async function carregarPets() {
  try {
    const { data } = await api.get('/animais', { params: { usuario_id: usuario?.id } })
    opcoesPets.value = data.map((pet) => pet.nome)
  } catch {
    $q.notify({ type: 'negative', message: 'Não foi possível carregar os pets.' })
  } finally {
    carregandoPets.value = false
  }
}

async function carregarAgendamentos() {
  try {
    const { data } = await api.get('/agendamentos', { params: { usuario_id: usuario?.id } })
    agendamentos.value = data
  } catch {
    $q.notify({ type: 'negative', message: 'Não foi possível carregar os agendamentos.' })
  }
}

async function carregarAgendamento(id) {
  try {
    const { data } = await api.get(`/agendamentos/${id}`)
    form.value = { ...form.value, ...data }
  } catch {
    $q.notify({ type: 'negative', message: 'Não foi possível carregar o agendamento selecionado.' })
  }
}

function resetarFormulario() {
  form.value = {
    pet: route.query.pet ? String(route.query.pet) : '',
    tipo: route.query.tipo && tipos.some((tipo) => tipo.value === route.query.tipo) ? String(route.query.tipo) : 'consulta',
    data: '',
    horario: '',
    local: '',
    profissional: '',
    observacao: '',
    vacina: '',
    motivo_consulta: '',
    porte: '',
    servico_outro: '',
  }
  router.replace({ path: '/agendamentos', query: route.query })
}

async function salvar() {
  salvando.value = true
  try {
    const payload = { ...form.value, usuario_id: usuario?.id }

    if (modoEdicao.value) {
      await api.put(`/agendamentos/${itemEditandoId.value}`, payload)
      $q.notify({ type: 'positive', message: 'Agendamento atualizado com sucesso!' })
    } else {
      await api.post('/agendamentos', payload)
      $q.notify({ type: 'positive', message: 'Agendamento criado com sucesso!' })
    }

    await carregarAgendamentos()
    resetarFormulario()
    router.push('/agendamentos')
  } catch (erro) {
    $q.notify({ type: 'negative', message: erro.response?.data?.mensagem || 'Não foi possível salvar o agendamento.' })
  } finally {
    salvando.value = false
  }
}

async function deletarAgendamento(id) {
  $q.dialog({
    title: 'Excluir agendamento',
    message: 'Tem certeza que deseja remover este agendamento?',
    cancel: true,
    persistent: true,
  }).onOk(async () => {
    try {
      await api.delete(`/agendamentos/${id}`)
      await carregarAgendamentos()
      if (Number(itemEditandoId.value) === Number(id)) {
        resetarFormulario()
      }
      $q.notify({ type: 'positive', message: 'Agendamento removido com sucesso!' })
    } catch {
      $q.notify({ type: 'negative', message: 'Não foi possível excluir o agendamento.' })
    }
  })
}

function formatarData(valor) {
  if (!valor) return ''
  return new Date(`${valor}T12:00:00`).toLocaleDateString('pt-BR')
}

function descricaoItem(item) {
  if (item.tipo === 'vacina') return item.vacina || 'Vacina agendada.'
  if (item.tipo === 'consulta') return item.motivo_consulta || 'Consulta programada.'
  if (item.tipo === 'banho' || item.tipo === 'tosa') return item.porte ? `Porte: ${item.porte}` : 'Serviço agendado.'
  return item.servico_outro || 'Serviço agendado.'
}

function statusAgendamento(item) {
  if (!item?.data) return 'agendado'
  const data = new Date(`${item.data}T23:59:59`)
  const hoje = new Date()
  return data < hoje ? 'realizado' : 'agendado'
}

function rotuloStatus(item) {
  return statusAgendamento(item) === 'realizado' ? 'Realizado' : 'Agendado'
}

function corStatus(item) {
  return statusAgendamento(item) === 'realizado' ? 'grey-7' : 'green-7'
}

function iconeTipo(tipo) {
  return tipos.find((item) => item.value === tipo)?.icon || 'event'
}

function rotuloTipo(tipo) {
  return tipos.find((item) => item.value === tipo)?.label || 'Agendamento'
}

function corTipo(tipo) {
  return ({ consulta: 'blue-7', vacina: 'red-7', banho: 'cyan-7', tosa: 'purple-7', outro: 'grey-7' })[tipo] || 'green-7'
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}

.service-card {
  cursor: pointer;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.service-card--selected {
  border-color: #2e7d32 !important;
  background: #e8f5e9;
  box-shadow: 0 2px 10px rgba(46, 125, 50, 0.15);
}

.service-fields {
  display: grid;
  gap: 16px;
  padding: 16px;
  background: #f3faf5;
  border-radius: 12px;
}
</style>
