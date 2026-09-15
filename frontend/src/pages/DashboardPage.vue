<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-grey-9 shadow-1">
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="lt-md" @click="drawerOpen = !drawerOpen" />
        <q-toolbar-title class="text-weight-bold text-green-9">Clínica Pet</q-toolbar-title>
        <div class="gt-xs text-body2 q-mr-sm">Olá, {{ primeiroNome }}</div>
        <q-avatar color="green-6" text-color="white" size="34px">{{ iniciaisUsuario }}</q-avatar>
        <q-btn flat round dense icon="logout" color="negative" class="q-ml-sm" aria-label="Sair" @click="logout">
          <q-tooltip>Sair da conta</q-tooltip>
        </q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="drawerOpen" show-if-above width="250" bordered class="bg-green-7 text-white">
      <div class="drawer-content q-pa-md">
        <q-avatar size="82px" class="bg-white text-green-8 q-mb-sm">{{ iniciaisUsuario }}</q-avatar>
        <div class="text-h6">{{ usuario.nome || 'Usuário' }}</div>
        <div class="text-caption q-mb-lg text-green-1">{{ dataAtual }}</div>

        <q-list padding>
          <q-item clickable v-ripple active active-class="menu-active" @click="rolarPara('agenda')">
            <q-item-section avatar><q-icon name="event" /></q-item-section>
            <q-item-section>Agenda</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/pets">
            <q-item-section avatar><q-icon name="pets" /></q-item-section>
            <q-item-section>Pets</q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="recursoEmBreve('Consultas')">
            <q-item-section avatar><q-icon name="medical_services" /></q-item-section>
            <q-item-section>Consultas</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/vacinas/nova">
            <q-item-section avatar><q-icon name="vaccines" /></q-item-section>
            <q-item-section>Agendar vacina</q-item-section>
          </q-item>
          <q-item clickable v-ripple to="/perfil">
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>Perfil</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="bg-grey-2 q-pa-md">
        <section class="row items-center justify-between q-mb-md">
          <div>
            <h1 class="text-h5 text-weight-bold q-my-none">Visão geral</h1>
            <div class="text-grey-7">Acompanhe os cuidados dos seus pets.</div>
          </div>
          <div class="row q-gutter-sm q-mt-sm">
            <q-btn outline color="green-8" icon="pets" label="Cadastrar pet" @click="abrirCadastroPet" />
            <q-btn unelevated color="green-7" icon="add" label="Agendar vacina" to="/vacinas/nova" />
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
                <q-item v-for="animal in animais" :key="animal.id" clickable v-ripple class="pet-highlight" @click="abrirPet(animal.id)">
                  <q-item-section avatar><q-avatar color="green-1" text-color="green-9" icon="pets" /></q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">{{ animal.nome }}</q-item-label>
                    <q-item-label caption>{{ animal.especie }}<span v-if="animal.idade !== null && animal.idade !== undefined"> · {{ animal.idade }} ano(s)</span></q-item-label>
                    <q-item-label v-if="animal.descricao" caption>{{ animal.descricao }}</q-item-label>
                  </q-item-section>
                  <q-item-section side><q-btn flat color="green-8" icon-right="arrow_forward" label="Ver perfil" /></q-item-section>
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
                <div class="text-caption text-grey-7">Vacinas que merecem atenção</div>
              </q-card-section>
              <q-separator />
              <q-list v-if="alertas.length" separator>
                <q-item v-for="alerta in alertas" :key="alerta.id">
                  <q-item-section avatar><q-icon name="notifications" color="orange-8" /></q-item-section>
                  <q-item-section>
                    <q-item-label>Vacina de {{ alerta.pet }}</q-item-label>
                    <q-item-label caption>{{ formatarData(alerta.data) }} às {{ alerta.horario || 'horário não informado' }}</q-item-label>
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
              <div class="text-caption text-grey-7">Agenda de vacinação</div>
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
                <div v-for="evento in eventosPorDia(dia)" :key="evento.id" class="event-card q-pa-sm q-mb-sm bg-white shadow-1">
                  <q-badge color="red-7" label="Vacina" class="q-mb-xs" />
                  <div class="text-weight-medium">{{ evento.pet }}</div>
                  <div class="text-caption">{{ evento.veterinario || 'Veterinário não informado' }}</div>
                  <div class="text-caption">{{ evento.local }} · {{ evento.horario || '--:--' }}</div>
                  <div class="row justify-end q-mt-xs">
                    <q-btn flat dense round icon="edit" color="green-8" @click="editarVacina(evento.id)" />
                    <q-btn flat dense round icon="delete" color="negative" @click="deletarVacina(evento.id)" />
                  </div>
                </div>
                <div v-if="!eventosPorDia(dia).length" class="text-caption text-grey-7 text-center q-py-md">Sem eventos</div>
              </q-card>
            </div>
          </q-card-section>
        </q-card>

        <q-card flat bordered>
          <q-card-section>
            <div class="text-h6">Gráficos de vacinas</div>
            <div class="text-caption text-grey-7">Distribuição dos eventos exibidos na agenda.</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row q-col-gutter-md">
            <div class="col-12 col-md-6"><canvas ref="barCanvas" /></div>
            <div class="col-12 col-md-6"><canvas ref="pieCanvas" /></div>
          </q-card-section>
        </q-card>
      </q-page>
    </q-page-container>

    <!-- Cadastro rápido para que o estado vazio do dashboard tenha uma ação útil. -->
    <q-dialog v-model="cadastroPetAberto" persistent>
      <q-card style="width: 440px; max-width: 92vw">
        <q-card-section class="row items-center"><div class="text-h6">Cadastrar pet</div><q-space /><q-btn flat round icon="close" v-close-popup /></q-card-section>
        <q-form @submit="salvarPet">
          <q-card-section class="q-gutter-md">
            <q-input v-model="novoAnimal.nome" outlined label="Nome *" :rules="[val => !!val || 'Informe o nome']" />
            <q-input v-model="novoAnimal.especie" outlined label="Espécie *" :rules="[val => !!val || 'Informe a espécie']" />
            <q-input v-model.number="novoAnimal.idade" outlined label="Idade" type="number" min="0" />
            <q-input v-model="novoAnimal.raca" outlined label="Raça" />
            <q-input v-model.number="novoAnimal.peso" outlined label="Peso" type="number" min="0" step="0.01" suffix="kg" />
            <q-input v-model.trim="novoAnimal.foto_url" outlined label="URL da foto" type="url" />
            <q-input v-model="novoAnimal.descricao" outlined label="Observações" type="textarea" />
          </q-card-section>
          <q-card-actions align="right"><q-btn flat label="Cancelar" v-close-popup /><q-btn color="green-7" label="Salvar pet" type="submit" :loading="salvandoPet" /></q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import Chart from 'chart.js/auto'
import { api } from 'src/services/api'
import { limparUsuarioAutenticado, obterUsuarioAutenticado } from 'src/services/auth'
import { useVacinasStore } from 'src/stores/vacinasStore'

const router = useRouter()
const $q = useQuasar()
const store = useVacinasStore()
const drawerOpen = ref(true)
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

const dataAtual = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' }).format(new Date())
const primeiroNome = computed(() => usuario.nome?.split(' ')[0] || 'usuário')
const iniciaisUsuario = computed(() => (usuario.nome || 'U').split(' ').map((nome) => nome[0]).slice(0, 2).join('').toUpperCase())
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
  { label: 'Vacinas nesta semana', value: store.semana.length, icon: 'vaccines', color: 'red-7' },
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
  barChartInstance.value = new Chart(barCanvas.value, { type: 'bar', data: { labels, datasets: [{ label: 'Vacinas por pet', data: valores, backgroundColor: cores }] }, options: { responsive: true, plugins: { legend: { display: false } } } })
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

function editarVacina(id) { router.push(`/vacinas/editar/${id}`) }

function deletarVacina(id) {
  $q.dialog({ title: 'Excluir vacina', message: 'Tem certeza que deseja excluir?', cancel: true, persistent: true })
    .onOk(() => store.deletarVacina(id))
}

function formatarData(data) { return new Date(`${data}T12:00:00`).toLocaleDateString('pt-BR') }
function rolarPara(id) { document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }) }
function recursoEmBreve(nome) { $q.notify({ message: `${nome} estará disponível em breve.`, color: 'blue-7', icon: 'info' }) }

function logout() {
  // A remoção da sessão faz a guarda do roteador bloquear novamente as páginas protegidas.
  limparUsuarioAutenticado()
  router.replace('/')
  $q.notify({ type: 'positive', message: 'Você saiu da conta.' })
}
</script>

<style scoped>
.drawer-content { min-height: 100%; }
.menu-active, .q-item:hover { background: rgba(255, 255, 255, .16); border-radius: 8px; }
.summary-card { min-height: 96px; border-radius: 12px; }
.day-card { height: 100%; min-height: 150px; border-radius: 10px; }
.event-card { border-left: 3px solid #43a047; border-radius: 8px; }
.filter-select { width: 230px; max-width: 100%; }
.pet-highlight { cursor: pointer; }
.scroll-mt { scroll-margin-top: 70px; }
@media (max-width: 599px) { .filter-select { width: 100%; margin-top: 12px; } }
</style>
