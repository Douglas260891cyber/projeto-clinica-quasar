<template>
  <q-card class="q-pa-md bg-white shadow-2 rounded-borders">

    <q-card-section class="text-h5 text-green-7 q-mb-md">
      <q-btn flat round icon="arrow_back" @click="$router.back()" color="green-7" />
      Vacina
    </q-card-section>

    <q-form @submit="salvarVacina" class="q-gutter-md">

      <q-card-section>
        <q-select filled v-model="form.pet" :options="pets" label="Pet *" option-label="nome" option-value="id"
          emit-value map-options color="green-7" />
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
        <q-select filled v-model="form.local" :options="locais" label="Local *" color="green-7"
          :rules="[val => !!val || 'Campo obrigatório']" />
      </q-card-section>

      <q-card-section>
        <q-select filled v-model="form.veterinario" :options="veterinarios" label="Veterinário(a) *" color="green-7"
          :rules="[val => !!val || 'Campo obrigatório']" />
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
import { ref } from 'vue'
import { useQuasar } from 'quasar'
import { vacinaService } from 'src/services/vacinaService'

const $q = useQuasar()

const form = ref({
  pet: null,
  data: '',
  horario: '',
  local: '',
  veterinario: '',
  observacao: ''
})

// Essas opções viriam de uma API (exemplo fixo por enquanto)
const pets = ref([
  { id: 1, nome: 'Zeus' },
  { id: 2, nome: 'Luna' }
])

const locais = ref(['Clínica Central', 'Pet Center', 'VetLife'])
const veterinarios = ref(['Dra. Júlia', 'Dr. Carlos', 'Dra. Fernanda'])

async function salvarVacina() {
  try {
    await vacinaService.agendarVacina(form.value)
    $q.notify({ type: 'positive', message: 'Vacina cadastrada com sucesso!' })
    $q.router.back()
  } catch (error) {
    console.error(error)
    $q.notify({ type: 'negative', message: 'Erro ao salvar vacina.' })
  }
}
</script>

<style scoped>
.rounded-borders {
  border-radius: 16px;
}
</style>
