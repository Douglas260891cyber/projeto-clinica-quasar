<template>
  <q-layout view="hHh lpR fFf">
    <q-drawer show-if-above v-model="drawerOpen" width="250" bordered class="bg-green-6 text-white">

      <div class="drawer-center">
        <q-avatar size="150px" class="q-mb-md">
          <img src="src/assets/ops.jpeg" alt="User" />
        </q-avatar>

        <div class="user-info">
          <div class="text-h6">Olá, Douglas</div>
          <p class="data">{{ dataAtual }}</p>
        </div>

        <q-list dense class="menu-list">
          <q-item clickable v-ripple class="menu-item">
            <q-item-section avatar><q-icon name="event" /></q-item-section>
            <q-item-section>Agenda</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="menu-item">
            <q-item-section avatar><q-icon name="pets" /></q-item-section>
            <q-item-section>Pets</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="menu-item">
            <q-item-section avatar><q-icon name="medication" /></q-item-section>
            <q-item-section>Consultas</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="menu-item" to="/vacinas/nova">
            <q-item-section avatar>
              <q-icon name="vaccines" />
            </q-item-section>
            <q-item-section>Agendar vacinas</q-item-section>
          </q-item>

          <q-item clickable v-ripple class="menu-item">
            <q-item-section avatar><q-icon name="person" /></q-item-section>
            <q-item-section>Perfil</q-item-section>
          </q-item>
        </q-list>
      </div>
    </q-drawer>

    <q-page-container>
      <q-page class="bg-grey-2">
        <div class="row no-wrap">
          <div class="col q-pa-md">

            <!-- PET CARD -->
            <q-card class="dog-card bg-green-4 q-pa-none q-mb-md">
              <div class="dog-card-content">
                <img src="src/assets/pet-particular.jpg" alt="Dog" class="dog-image" />
                <div class="dog-info">
                  <div class="text-subtitle1 text-weight-bold">Nome: Zeus</div>
                  <div class="text-caption">Idade: 4 anos</div>
                  <div class="text-caption">Peso: 15 kg</div>
                </div>
              </div>
            </q-card>

            <!-- EVENTOS SEMANA -->
            <q-card class="q-mb-md bg-white q-pa-md">
              <div class="text-h6 q-mb-sm">Próximos eventos da semana</div>
              <div class="row q-col-gutter-sm">

                <q-card v-for="(dia, i) in diasSemana" :key="i" class="col bg-grey-1 q-pa-sm">

                  <div class="text-center text-weight-bold q-mb-sm">{{ dia }}</div>

                  <div v-for="ev in eventosPorDia(dia)" :key="ev.id"
                    class="q-pa-sm bg-white q-mb-sm rounded-borders shadow-1">
                    <q-badge color="red" text-color="white" class="q-mb-sm flex items-center">
                      <q-icon name="vaccines" size="14px" class="q-mr-xs" />
                      Vacina
                    </q-badge>
                    <div><b>Pet:</b> {{ ev.pet }}</div>
                    <div><b>Veterinário(a):</b> {{ ev.veterinario }}</div>
                    <div><b>Local:</b> {{ ev.local }}</div>
                    <div><b>Hora:</b> {{ ev.horario }}</div>

                    <div class="row justify-end q-mt-sm">
                      <q-btn icon="edit" color="green-7" flat @click="$router.push(`/vacinas/editar/${ev.id}`)" />
                      <q-btn flat dense size="sm" icon="delete" color="negative" class="q-ml-sm"
                        @click="deletarVacina(ev.id)" />
                    </div>

                  </div>

                  <div v-if="eventosPorDia(dia).length === 0" class="text-grey text-center text-caption">
                    Sem eventos
                  </div>

                </q-card>
              </div>
            </q-card>

            <!-- ALERTAS -->
            <q-card class="q-mb-md bg-white q-pa-md">
              <div class="text-h6 q-mb-sm">Alertas</div>
              <div class="bg-grey-3" style="height: 100px; border-radius: 6px;"></div>
            </q-card>

            <!-- GRÁFICOS -->
            <q-card class="q-mb-md bg-white q-pa-md">
              <div class="text-h6 q-mb-md">Gráficos de Vacinas</div>

              <div class="row q-col-gutter-md">
                <div class="col-12 col-md-6">
                  <canvas id="barChart"></canvas>
                </div>
                <div class="col-12 col-md-6">
                  <canvas id="pieChart"></canvas>
                </div>
              </div>
            </q-card>

          </div>
        </div>
      </q-page>
    </q-page-container>

  </q-layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useVacinasStore } from "src/stores/vacinasStore";
import { useQuasar } from "quasar";
import Chart from "chart.js/auto";

const drawerOpen = ref(true);

const diasSemana = ["Segunda-feira", "Terça-feira", "Quarta-feira", "Quinta-feira", "Sexta-feira"];

const hoje = new Date();
const dataAtual = ref(
  hoje.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric"
  })
);

// STORE
const store = useVacinasStore();
const $q = useQuasar();

onMounted(() => {
  store.carregarSemana();
  setTimeout(criarGraficos, 600); // espera carregar os dados
});

// EVENTOS POR DIA
const eventosPorDia = (diaNome) => {
  const map = {
    "Segunda-feira": 1,
    "Terça-feira": 2,
    "Quarta-feira": 3,
    "Quinta-feira": 4,
    "Sexta-feira": 5
  };

  return store.semana.filter(ev => {
    const data = new Date(ev.data + "T00:00:00");
    return data.getDay() === map[diaNome];
  });
};

// CRIAR GRÁFICOS
function criarGraficos() {
  const pets = {};
  store.semana.forEach(ev => {
    if (!pets[ev.pet]) pets[ev.pet] = 0;
    pets[ev.pet]++;
  });

  const labels = Object.keys(pets);
  const values = Object.values(pets);

  // BARRAS
  new Chart(document.getElementById("barChart"), {
    type: "bar",
    data: {
      labels,
      datasets: [{
        label: "Vacinas por Pet",
        data: values,
        backgroundColor: ["#4caf50", "#8bc34a", "#cddc39"]
      }]
    },
    options: { responsive: true }
  });

  // PIZZA
  new Chart(document.getElementById("pieChart"), {
    type: "pie",
    data: {
      labels,
      datasets: [{
        data: values,
        backgroundColor: ["#4caf50", "#8bc34a", "#cddc39"]
      }]
    },
    options: { responsive: true }
  });
}

// DELETAR
function deletarVacina(id) {
  $q.dialog({
    title: "Excluir vacina",
    message: "Tem certeza que deseja excluir?",
    cancel: true,
    persistent: true
  }).onOk(() => store.deletarVacina(id));
}
</script>

<style scoped>
.bg-green-6 {
  background-color: #a3c77b !important;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.drawer-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100vh;
  text-align: center;
  margin-top: 30px;
}

.user-info {
  margin-bottom: 20px;
}

.menu-list {
  width: 95%;
}

.menu-item {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 10px;
  margin-bottom: 8px;
  transition: 0.2s;
}

.menu-item:hover {
  background-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-2px);
}

.dog-card {
  border-radius: 12px;
  overflow: hidden;
  height: 180px;
}

.dog-card-content {
  display: flex;
  align-items: center;
  padding: 16px;
  gap: 16px;
  background-color: #a3c77b;
}

.dog-image {
  width: 120px;
  height: 120px;
  border-radius: 12px;
  object-fit: cover;
}

.rounded-borders {
  border-radius: 10px;
}
</style>
