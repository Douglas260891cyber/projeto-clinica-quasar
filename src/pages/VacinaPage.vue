<template>
  <q-card class="q-pa-md bg-white shadow-2 rounded-borders">

    <q-card-section class="text-h5 text-green-7 q-mb-md flex items-center">
      <q-btn flat round icon="arrow_back" @click="$router.back()" color="green-7" />
      <span class="q-ml-sm">{{ isEdit ? "Editar Vacina" : "Nova Vacina" }}</span>
    </q-card-section>

    <q-form @submit="salvarVacina" class="q-gutter-md">

      <!-- PET -->
      <q-card-section>
        <q-input filled v-model="form.pet" label="Pet *" color="green-7"
          :rules="[val => !!val || 'Campo obrigatório']" />
      </q-card-section>

      <!-- DATA E HORÁRIO -->
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

      <!-- LOCAL -->
      <q-card-section>
        <q-select filled v-model="form.local" :options="locais" label="Local da aplicação *" color="green-7"
          :rules="[val => !!val || 'Campo obrigatório']" />
      </q-card-section>

      <!-- VETERINÁRIO -->
      <q-card-section>
        <q-select filled v-model="form.veterinario" :options="veterinarios" label="Veterinário(a) responsável"
          color="green-7" />
      </q-card-section>

      <!-- OBSERVAÇÃO -->
      <q-card-section>
        <q-input filled v-model="form.observacao" label="Observação" type="textarea" color="green-7" />
      </q-card-section>

      <!-- BOTÕES -->
      <q-card-section class="row justify-between q-mt-md">
        <q-btn label="Cancelar" color="grey-7" flat @click="$router.back()" />
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

// --------------------------
//  OPÇÕES FICTÍCIAS
// --------------------------
const locais = [
  "Clínica Central",
  "Unidade Norte",
  "Unidade Sul",
  "HospVet Municipal",
  "Posto Veterinário São José"
];

const veterinarios = [
  "Dr. Ricardo Silva",
  "Dra. Ana Paula Mendes",
  "Dr. Júlio Carrara",
  "Dra. Beatriz Nunes",
  "Dr. Marcos Torres"
];

// Verifica se está editando
const isEdit = computed(() => !!route.params.id);

// Formulário
const form = ref({
  pet: "",
  data: "",
  horario: "",
  local: "",
  veterinario: "",
  observacao: ""
});

// Carregar dados ao editar
onMounted(async () => {
  if (isEdit.value) {
    try {
      const resp = await api.get(`/vacinas/${route.params.id}`);
      form.value = resp.data;
    } catch (e) {
      console.error(e)
      $q.notify({ type: "negative", message: "Erro ao carregar vacina." })
    }

  }
});

// Criar ou atualizar
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
  } catch (e) {
    console.error(e)
    $q.notify({ type: "negative", message: "Erro ao carregar vacina." })
  }

}
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>
