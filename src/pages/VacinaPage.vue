<template>
  <q-card class="q-pa-md bg-white shadow-2 rounded-borders">

    <q-card-section class="text-h5 text-green-7 q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.back()" color="green-7" />
      {{ isEdit ? "Editar Vacina" : "Agendar Vacina" }}
    </q-card-section>

    <q-form @submit="salvarVacina" class="q-gutter-md">

      <q-card-section>
        <q-input filled v-model="form.pet" label="Pet" color="green-7" />
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col">
            <q-input filled v-model="form.data" type="date" label="Data *" color="green-7"
              :rules="[val => !!val || 'Campo obrigatório']" />
          </div>
          <div class="col">
            <q-input filled v-model="form.horario" type="time" label="Horário" color="green-7" />
          </div>
        </div>
      </q-card-section>

      <q-card-section>
        <q-select filled v-model="form.local" :options="locais" label="Local *" color="green-7" />
      </q-card-section>

      <q-card-section>
        <q-select filled v-model="form.veterinario" :options="veterinarios" label="Veterinário(a)" color="green-7" />
      </q-card-section>

      <q-card-section>
        <q-input filled v-model="form.observacao" label="Observação" type="textarea" color="green-7" />
      </q-card-section>

      <q-card-section class="row justify-between q-mt-md">
        <q-btn label="Cancelar" color="grey-6" flat @click="$router.back()" />
        <q-btn label="Confirmar" color="green-7" type="submit" />
      </q-card-section>

    </q-form>
  </q-card>

</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { api } from "src/services/api";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();

// Verifica se está em modo edição
const isEdit = computed(() => !!route.params.id);

// Formulário reativo
const form = ref({
  pet: "",
  data: "",
  horario: "",
  local: "",
  veterinario: "",
  observacao: ""
});

// Lista ficticia
const locais = [
  "Clínica Central",
  "Unidade Norte",
  "Unidade Sul",
  "Posto Veterinário São José"
];

const veterinarios = [
  "Dr. Ricardo Silva",
  "Dra. Ana Paula Mendes",
  "Dr. Júlio Carrara",
  "Dra. Beatriz Nunes",
];


// Carrega dados da vacina ao editar
onMounted(async () => {
  if (!isEdit.value) return;

  try {
    const { data } = await api.get(`/vacinas/${route.params.id}`);

    // Garante que apenas campos existentes sejam preenchidos
    Object.assign(form.value, {
      pet: data.pet ?? "",
      data: formatarData(data.data),
      horario: data.horario ?? "",
      local: data.local ?? "",
      veterinario: data.veterinario ?? "",
      observacao: data.observacao ?? ""
    });

  } catch (e) {
    console.error(e);
    $q.notify({ type: "negative", message: "Erro ao carregar a vacina." });
  }
});

// Função para garantir compatibilidade com <q-input type="date">
function formatarData(d) {
  if (!d) return "";
  // Se já estiver no formato yyyy-mm-dd, retorna direto
  if (/^\d{4}-\d{2}-\d{2}$/.test(d)) return d;
  // Tenta converter para iso
  const obj = new Date(d);
  if (isNaN(obj)) return "";
  return obj.toISOString().substring(0, 10);
}

// Criar ou atualizar vacina
async function salvarVacina() {
  try {
    if (isEdit.value) {
      await api.put(`/vacinas/${route.params.id}`, form.value);
      $q.notify({ type: "positive", message: "Vacina atualizada!" });

    } else {
      await api.post("/vacinas", form.value);
      $q.notify({ type: "positive", message: "Vacina cadastrada!" });
    }

    router.push("/dashboard");

  } catch (error) {
    console.error(error);
    $q.notify({
      type: "negative",
      message: "Erro ao salvar a vacina."
    });
  }
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>
