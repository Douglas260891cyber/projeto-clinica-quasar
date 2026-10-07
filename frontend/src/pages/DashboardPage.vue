<template>
  <q-page class="bg-grey-2 q-pa-md">
    <section class="row items-center justify-between q-mb-md">
      <div>
        <h1 class="text-h5 text-weight-bold q-my-none">Visão geral</h1>
        <div class="text-grey-7">Acompanhe os cuidados dos seus pets.</div>
      </div>
      <div class="row q-gutter-sm q-mt-sm">
        <q-btn outline color="green-8" icon="pets" label="Cadastrar pet" @click="abrirCadastroPet" />
        <q-btn unelevated color="green-7" icon="add" label="Novo agendamento" to="/agendamentos" />
      </div>
    </section>

    <!-- Os cards resumem as informações que exigem atenção imediata. -->
    <section class="row q-col-gutter-md q-mb-md">
      <div v-for="card in cardsResumo" :key="card.label" class="col-12 col-sm-6 col-lg-3">
        <q-card flat bordered class="summary-card">
          <q-card-section class="row items-center no-wrap">
            <q-avatar :color="card.color" text-color="white" :icon="card.icon" size="48px" />
            <div class="q-ml-md">
              <div class="text-h5 text-weight-bold">{{ card.value }}</div>
              <div class="text-grey-7">{{ card.label }}</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <section class="row q-col-gutter-md q-mb-md">
      <div class="col-12 col-lg-7">
        <q-card flat bordered class="full-height">
          <q-card-section class="row items-center justify-between q-pb-sm">
            <div>
              <div class="text-h6">Meus pets</div>
              <div class="text-caption text-grey-7">Dados cadastrados na clínica</div>
            </div>
            <q-btn flat color="green-8" label="Ver todos" icon="pets" to="/pets" />
          </q-card-section>
          <q-separator />
          <!-- Cada pet possui seu próprio atalho; o dashboard não esconde os demais cadastrados. -->
          <q-list v-if="animais.length" separator>
            <q-item v-for="animal in animais" :key="animal.id" clickable v-ripple class="pet-highlight"
              @click="abrirPet(animal.id)">
              <q-item-section avatar><q-avatar color="green-1" text-color="green-9" icon="pets" /></q-item-section>
              <q-item-section>
                <q-item-label class="text-weight-medium">{{ animal.nome }}</q-item-label>
                <q-item-label caption>{{ animal.especie }}<span
                    v-if="animal.idade !== null && animal.idade !== undefined"> · {{ animal.idade }}
                    ano(s)</span></q-item-label>
                <q-item-label v-if="animal.descricao" caption>{{ animal.descricao }}</q-item-label>
              </q-item-section>
              <q-item-section side><q-btn flat color="green-8" icon-right="arrow_forward"
                  label="Ver perfil" /></q-item-section>
            </q-item>
          </q-list>
          <q-card-section v-else class="text-center text-grey-7 q-py-xl">
            <q-icon name="pets" size="42px" color="grey-5" />
            <div class="q-mt-sm">Nenhum pet cadastrado.</div>
            <q-btn flat color="green-8" label="Cadastrar o primeiro pet" @click="abrirCadastroPet" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-12 col-lg-5">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-h6">Alertas</div>
            <div class="text-caption text-grey-7">Seus próximos cuidados</div>
          </q-card-section>
          <q-separator />
          <q-list v-if="alertas.length" separator>
            <q-item v-for="alerta in alertas" :key="alerta.id">
              <q-item-section avatar><q-icon name="notifications" color="orange-8" /></q-item-section>
              <q-item-section>
                <q-item-label>{{ rotuloTipo(alerta.tipo) }} de {{ alerta.pet }}</q-item-label>
                <q-item-label caption>{{ formatarData(alerta.data) }} às {{ alerta.horario || 'horário não informado'
                }}</q-item-label>
              </q-item-section>
            </q-item>
          </q-list>
          <q-card-section v-else class="text-grey-7 text-center q-py-lg">
            <q-icon name="check_circle" color="positive" size="30px" />
            <div>Nenhuma vacina para os próximos 7 dias.</div>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <q-card id="agenda" flat bordered class="q-mb-md scroll-mt">
      <q-card-section class="row items-center justify-between q-col-gutter-md">
        <div>
          <div class="text-h6">Próximos eventos da semana</div>
          <div class="text-caption text-grey-7">Consultas, vacinas e serviços</div>
        </div>
        <!-- O filtro facilita acompanhar a agenda de um pet específico. -->
        <q-select v-model="petSelecionado" :options="opcoesPets" label="Filtrar por pet" dense outlined clearable
          class="filter-select" />
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-col-gutter-sm">
        <div v-for="dia in diasSemana" :key="dia" class="col-12 col-sm">
          <q-card flat class="bg-grey-1 day-card q-pa-sm">
            <div class="text-center text-weight-bold q-mb-sm">{{ dia }}</div>
            <div v-for="evento in eventosPorDia(dia)" :key="evento.id"
              class="event-card q-pa-sm q-mb-sm bg-white shadow-1">
              <q-badge :color="corTipo(evento.tipo)" :label="rotuloTipo(evento.tipo)" class="q-mb-xs" />
              <div class="text-weight-medium">{{ evento.pet }}</div>
              <div class="text-caption">{{ evento.profissional || 'Profissional não informado' }}</div>
              <div class="text-caption">{{ evento.local }} · {{ evento.horario || '--:--' }}</div>
              <div class="row justify-end q-mt-xs">
                <q-btn flat dense round icon="edit" color="green-8" @click="editarAgendamento(evento.id)" />
                <q-btn flat dense round icon="delete" color="negative" @click="deletarAgendamento(evento.id)" />
              </div>
            </div>
            <div v-if="!eventosPorDia(dia).length" class="text-caption text-grey-7 text-center q-py-md">Sem eventos
            </div>
          </q-card>
        </div>
      </q-card-section>
    </q-card>

    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Gráficos da agenda</div>
        <div class="text-caption text-grey-7">Distribuição dos agendamentos exibidos.</div>
      </q-card-section>
      <q-separator />
      <q-card-section class="row q-col-gutter-md">
        <div class="col-12 col-md-6"><canvas ref="barCanvas" /></div>
        <div class="col-12 col-md-6"><canvas ref="pieCanvas" /></div>
      </q-card-section>
    </q-card>
  </q-page>

  <!-- Cadastro rápido para que o estado vazio do dashboard tenha uma ação útil. -->
  <q-dialog v-model="cadastroPetAberto" persistent>
    <q-card style="width: 440px; max-width: 92vw">
      <q-card-section class="row items-center">
        <div class="text-h6">Cadastrar pet</div><q-space /><q-btn flat round icon="close" v-close-popup />
      </q-card-section>
      <q-form @submit="salvarPet">
        <q-card-section class="q-gutter-md">
          <q-input v-model="novoAnimal.nome" outlined label="Nome *" :rules="[val => !!val || 'Informe o nome']" />
          <q-input v-model="novoAnimal.especie" outlined label="Espécie *"
            :rules="[val => !!val || 'Informe a espécie']" />
          <q-input v-model.number="novoAnimal.idade" outlined label="Idade" type="number" min="0" />
          <q-input v-model="novoAnimal.raca" outlined label="Raça" />
          <q-input v-model.number="novoAnimal.peso" outlined label="Peso" type="number" min="0" step="0.01"
            suffix="kg" />
          <q-input v-model.trim="novoAnimal.foto_url" outlined label="URL da foto" type="url" />
          <q-input v-model="novoAnimal.descricao" outlined label="Observações" type="textarea" />
        </q-card-section>
        <q-card-actions align="right"><q-btn flat label="Cancelar" v-close-popup /><q-btn color="green-7"
            label="Salvar pet" type="submit" :loading="salvandoPet" /></q-card-actions>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import Chart from 'chart.js/auto'
import { api } from 'src/services/api'
import { obterUsuarioAutenticado } from 'src/services/auth'
import { useAgendamentosStore } from 'src/stores/agendamentosStore'
import { formatDateOnly } from 'src/utils/dates'

const router = useRouter()
const $q = useQuasar()
const store = useAgendamentosStore()
const cadastroPetAberto = ref(false)
const salvandoPet = ref(false)
const petSelecionado = ref(null)
const animais = ref([])
const barCanvas = ref(null)
const pieCanvas = ref(null)
const barChartInstance = ref(null)
const pieChartInstance = ref(null)
const usuario = obterUsuarioAutenticado() || {}
const novoAnimal = reactive({ nome: '', especie: '', idade: null, raca: '', peso: null, foto_url: '', descricao: '' })
const diasSemana = ['Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo']

const opcoesPets = computed(() => [...new Set(store.semana.map((evento) => evento.pet).filter(Boolean))])
const eventosFiltrados = computed(() => store.semana.filter((evento) => !petSelecionado.value || evento.pet === petSelecionado.value))

// Alertas são calculados a partir da agenda, evitando informações fixas no template.
const alertas = computed(() => {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const limite = new Date(hoje)
  limite.setDate(limite.getDate() + 7)
  return store.lista.filter((evento) => {
    if (!evento?.data) return false
    const data = new Date(`${evento.data}T12:00:00`)
    return data >= hoje && data <= limite
  }).sort((a, b) => a.data.localeCompare(b.data))
})

const cardsResumo = computed(() => [
  { label: 'Pets cadastrados', value: animais.value.length, icon: 'pets', color: 'green-7' },
  { label: 'Agendamentos nesta semana', value: store.semana.length, icon: 'event_available', color: 'red-7' },
  { label: 'Próximos alertas', value: alertas.value.length, icon: 'notifications', color: 'orange-8' },
  { label: 'Eventos exibidos', value: eventosFiltrados.value.length, icon: 'event_available', color: 'blue-7' },
])

onMounted(async () => {
  await Promise.all([store.carregarSemana(), carregarAnimais()])
  await nextTick()
  criarGraficos()
})

// Recria os gráficos quando a agenda ou o filtro forem alterados.
watch(eventosFiltrados, async () => {
  await nextTick()
  criarGraficos()
}, { deep: true })

onBeforeUnmount(() => {
  barChartInstance.value?.destroy()
  pieChartInstance.value?.destroy()
})

async function carregarAnimais() {
  try {
    const { data: dados } = await api.get('/animais', { params: { usuario_id: usuario.id } })
    animais.value = dados
  } catch (erro) {
    // A tela continua utilizável se o backend de animais não estiver iniciado.
    console.error('Erro ao carregar animais:', erro)
  }
}

function eventosPorDia(diaNome) {
  const indiceDia = diasSemana.indexOf(diaNome)
  return eventosFiltrados.value.filter((evento) => {
    if (!evento?.data) return false
    return (new Date(`${evento.data}T12:00:00`).getDay() + 6) % 7 === indiceDia
  })
}

function criarGraficos() {
  if (!barCanvas.value || !pieCanvas.value) return
  const quantidadePorPet = eventosFiltrados.value.reduce((acumulador, evento) => {
    acumulador[evento.pet] = (acumulador[evento.pet] || 0) + 1
    return acumulador
  }, {})
  const labels = Object.keys(quantidadePorPet)
  const valores = Object.values(quantidadePorPet)
  const cores = ['#43a047', '#8bc34a', '#ffb300', '#e53935', '#1e88e5']

  barChartInstance.value?.destroy()
  pieChartInstance.value?.destroy()
  barChartInstance.value = new Chart(barCanvas.value, { type: 'bar', data: { labels, datasets: [{ label: 'Agendamentos por pet', data: valores, backgroundColor: cores }] }, options: { responsive: true, plugins: { legend: { display: false } } } })
  pieChartInstance.value = new Chart(pieCanvas.value, { type: 'doughnut', data: { labels, datasets: [{ data: valores, backgroundColor: cores }] }, options: { responsive: true } })
}

function abrirCadastroPet() {
  cadastroPetAberto.value = true
}

function abrirPet(id) {
  router.push(`/pets/${id}`)
}

async function salvarPet() {
  salvandoPet.value = true
  try {
    const { data: dados } = await api.post('/animais', { ...novoAnimal, usuario_id: usuario.id })
    animais.value.push(dados.animal)
    Object.assign(novoAnimal, { nome: '', especie: '', idade: null, raca: '', peso: null, foto_url: '', descricao: '' })
    cadastroPetAberto.value = false
    $q.notify({ type: 'positive', message: 'Pet cadastrado com sucesso!' })
  } catch (erro) {
    $q.notify({ type: 'negative', message: erro?.response?.data?.mensagem || 'Não foi possível cadastrar o pet.' })
  } finally {
    salvandoPet.value = false
  }
}

function editarAgendamento(id) { router.push(`/agendamentos/editar/${id}`) }

function deletarAgendamento(id) {
  $q.dialog({ title: 'Excluir agendamento', message: 'Tem certeza que deseja excluir?', cancel: true, persistent: true })
    .onOk(() => store.deletarAgendamento(id))
}

function formatarData(data) { return formatDateOnly(data) }
function rotuloTipo(tipo) { return ({ consulta: 'Consulta', vacina: 'Vacina', banho: 'Banho', tosa: 'Tosa', outro: 'Outro serviço' })[tipo] || 'Agendamento' }
function corTipo(tipo) { return ({ consulta: 'blue-7', vacina: 'red-7', banho: 'cyan-7', tosa: 'purple-7', outro: 'grey-7' })[tipo] || 'green-7' }
</script>

<style scoped>
.summary-card {
  min-height: 96px;
  border-radius: 12px;
}

.day-card {
  height: 100%;
  min-height: 150px;
  border-radius: 10px;
}

.event-card {
  border-left: 3px solid #43a047;
  border-radius: 8px;
}

.filter-select {
  width: 230px;
  max-width: 100%;
}

.pet-highlight {
  cursor: pointer;
}

.scroll-mt {
  scroll-margin-top: 70px;
}

@media (max-width: 599px) {
  .filter-select {
    width: 100%;
    margin-top: 12px;
  }
}
</style>
