<template>
  <q-page class="bg-grey-2 q-pa-md">
    <q-card class="form-card q-mx-auto" flat bordered>
      <q-card-section class="row items-center">
        <q-btn flat round icon="arrow_back" color="green-8" @click="router.back()" />
        <div class="q-ml-sm"><div class="text-h5 text-weight-bold">{{ isEdit ? 'Editar agendamento' : 'Novo agendamento' }}</div><div class="text-grey-7">Escolha o serviço para ver os dados necessários.</div></div>
      </q-card-section>
      <q-separator />
      <q-form class="q-pa-md q-gutter-md" @submit="salvar">
        <q-btn-toggle v-model="form.tipo" spread unelevated toggle-color="green-7" color="grey-3" text-color="grey-8" :options="tipos" />
        <div class="row q-col-gutter-md">
          <div class="col-12 col-sm-6"><q-select v-model="form.pet" outlined label="Pet *" :options="opcoesPets" :loading="carregandoPets" :rules="[obrigatorio]" /></div>
          <div class="col-6 col-sm-3"><q-input v-model="form.data" outlined type="date" label="Data *" :rules="[obrigatorio]" /></div>
          <div class="col-6 col-sm-3"><q-input v-model="form.horario" outlined type="time" label="Horário" /></div>
          <div class="col-12"><q-select v-model="form.local" outlined label="Local *" :options="locais" :rules="[obrigatorio]" /></div>
        </div>

        <div v-if="form.tipo === 'vacina'" class="service-fields">
          <div class="text-subtitle1 text-green-9">Dados da vacinação</div>
          <q-input v-model="form.vacina" outlined label="Vacina / imunizante" />
          <q-select v-model="form.profissional" outlined label="Veterinário(a) responsável" :options="profissionais" />
        </div>
        <div v-else-if="form.tipo === 'consulta'" class="service-fields">
          <div class="text-subtitle1 text-green-9">Dados da consulta</div>
          <q-input v-model="form.motivo_consulta" outlined type="textarea" label="Motivo da consulta" />
          <q-select v-model="form.profissional" outlined label="Veterinário(a)" :options="profissionais" />
        </div>
        <div v-else-if="form.tipo === 'banho' || form.tipo === 'tosa'" class="service-fields">
          <div class="text-subtitle1 text-green-9">Dados do serviço</div>
          <q-select v-model="form.porte" outlined label="Porte do pet" :options="['Pequeno', 'Médio', 'Grande']" />
          <q-input v-model="form.profissional" outlined label="Profissional (opcional)" />
        </div>
        <div v-else class="service-fields"><q-input v-model="form.servico_outro" outlined label="Qual serviço?" :rules="[obrigatorio]" /><q-input v-model="form.profissional" outlined label="Profissional (opcional)" /></div>

        <q-input v-model="form.observacao" outlined type="textarea" label="Observações" />
        <div class="row justify-end q-gutter-sm"><q-btn flat label="Cancelar" @click="router.back()" /><q-btn color="green-7" type="submit" :loading="salvando" label="Confirmar agendamento" /></div>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useQuasar } from 'quasar'
import { useRoute, useRouter } from 'vue-router'
import { api } from 'src/services/api'
import { obterUsuarioAutenticado } from 'src/services/auth'

const router = useRouter(); const route = useRoute(); const $q = useQuasar(); const usuario = obterUsuarioAutenticado()
const opcoesPets = ref([]); const carregandoPets = ref(true); const salvando = ref(false)
const isEdit = computed(() => Boolean(route.params.id))
const tipos = [{ label: 'Consulta', value: 'consulta', icon: 'medical_services' }, { label: 'Vacina', value: 'vacina', icon: 'vaccines' }, { label: 'Banho', value: 'banho', icon: 'shower' }, { label: 'Tosa', value: 'tosa', icon: 'content_cut' }, { label: 'Outro', value: 'outro', icon: 'more_horiz' }]
const locais = ['Clínica Central', 'Unidade Norte', 'Unidade Sul', 'HospVet Municipal', 'Posto Veterinário São José']
const profissionais = ['Dr. Ricardo Silva', 'Dra. Ana Paula Mendes', 'Dr. Júlio Carrara', 'Dra. Beatriz Nunes', 'Dr. Marcos Torres']
const form = ref({ pet: '', tipo: 'consulta', data: '', horario: '', local: '', profissional: '', observacao: '', vacina: '', motivo_consulta: '', porte: '', servico_outro: '' })
const obrigatorio = (valor) => !!valor || 'Campo obrigatório'
onMounted(async () => {
  try { const { data } = await api.get('/animais', { params: { usuario_id: usuario?.id } }); opcoesPets.value = data.map((pet) => pet.nome) } catch { $q.notify({ type: 'negative', message: 'Não foi possível carregar seus pets.' }) } finally { carregandoPets.value = false }
  if (route.query.pet) form.value.pet = String(route.query.pet)
  if (route.query.tipo && tipos.some((tipo) => tipo.value === route.query.tipo)) form.value.tipo = String(route.query.tipo)
  if (isEdit.value) { try { const { data } = await api.get(`/agendamentos/${route.params.id}`); form.value = { ...form.value, ...data } } catch { $q.notify({ type: 'negative', message: 'Não foi possível carregar o agendamento.' }) } }
})
async function salvar () {
  salvando.value = true
  try { if (isEdit.value) await api.put(`/agendamentos/${route.params.id}`, form.value); else await api.post('/agendamentos', { ...form.value, usuario_id: usuario?.id }); $q.notify({ type: 'positive', message: 'Agendamento salvo com sucesso!' }); router.push('/dashboard') } catch (erro) { $q.notify({ type: 'negative', message: erro.response?.data?.mensagem || 'Não foi possível salvar o agendamento.' }) } finally { salvando.value = false }
}
</script>
<style scoped>.form-card { max-width: 820px; border-radius: 16px; }.service-fields { display: grid; gap: 16px; padding: 16px; background: #f1f8f2; border-radius: 10px; }</style>
