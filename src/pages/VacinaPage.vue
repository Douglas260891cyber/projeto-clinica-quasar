<template>
  <q-card class="q-pa-md bg-white shadow-2 rounded-borders">

    <q-card-section class="text-h5 text-green-7 q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.back()" color="green-7" />
      Vacina
    </q-card-section>

    <q-form @submit="salvarVacina" class="q-gutter-md">

      <q-card-section>
        <q-input filled v-model="form.pet" :options="pets" label="Pet" option-label="nome" option-value="id" emit-value
          map-options color="green-7" />
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
        <q-input filled v-model="form.local" :options="locais" label="Local *" color="green-7" />
      </q-card-section>

      <q-card-section>
        <q-input filled v-model="form.veterinario" :options="veterinarios" label="Veterinário(a)" color="green-7" />
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
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useQuasar } from "quasar";
import { api } from "src/services/api";

const $q = useQuasar();
const router = useRouter();

// Formulário reativo
const form = ref({
  pet: "",
  data: "",
  horario: "",
  local: "",
  veterinario: "",
  observacao: ""
});

// ENVIAR PARA JSON SERVER
async function salvarVacina() {
  try {
    const payload = {
      pet: form.value.pet,
      data: form.value.data,
      horario: form.value.horario,
      local: form.value.local,
      veterinario: form.value.veterinario,
      observacao: form.value.observacao
    };

    await api.post("/vacinas", payload);

    $q.notify({
      type: "positive",
      message: "Vacina salva com sucesso!"
    });

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
