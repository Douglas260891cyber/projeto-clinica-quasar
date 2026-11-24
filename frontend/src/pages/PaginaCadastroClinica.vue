<template>
  <q-page class="bg-grey-2 q-pa-md flex flex-center">
    <q-card flat bordered class="q-pa-lg bg-white" style="width: 720px; max-width: 96vw">
      <div class="text-h5 text-weight-bold text-green-9">Cadastrar clínica veterinária</div>
      <div class="text-grey-7 q-mt-sm q-mb-lg">Cadastre uma clínica para que usuários e veterinários possam se vincular a ela.</div>

      <q-form class="row q-col-gutter-md" @submit.prevent="cadastrar">
        <div class="col-12"><q-input v-model.trim="form.nome" outlined label="Nome da clínica *" :rules="[obrigatorio]" /></div>
        <div class="col-12 col-sm-6"><q-input v-model="form.cnpj" outlined label="CNPJ" mask="##.###.###/####-##" /></div>
        <div class="col-12 col-sm-6"><q-input v-model.trim="form.email" outlined label="E-mail" type="email" /></div>
        <div class="col-12 col-sm-6"><q-input v-model="form.telefone" outlined label="Telefone" /></div>
        <div class="col-12 col-sm-6"><q-input v-model.trim="form.endereco" outlined label="Endereço" /></div>
        <div class="col-12 col-sm-8"><q-input v-model.trim="form.cidade" outlined label="Cidade" /></div>
        <div class="col-12 col-sm-4"><q-input v-model.trim="form.estado" outlined label="UF" maxlength="2" /></div>
        <div class="col-12 row justify-end q-gutter-sm">
          <q-btn flat label="Voltar" color="grey-8" to="/dashboard" />
          <q-btn unelevated label="Cadastrar clínica" color="green-7" type="submit" :loading="salvando" />
        </div>
      </q-form>

      <q-separator class="q-my-lg" />
      <div class="text-subtitle1 text-weight-medium q-mb-sm">Clínicas cadastradas</div>
      <q-list bordered separator v-if="clinicas.length">
        <q-item v-for="clinica in clinicas" :key="clinica.id">
          <q-item-section>{{ clinica.nome }}</q-item-section>
          <q-item-section side>{{ [clinica.cidade, clinica.estado].filter(Boolean).join(' - ') }}</q-item-section>
        </q-item>
      </q-list>
      <div v-else class="text-grey-7">Nenhuma clínica cadastrada.</div>
    </q-card>
  </q-page>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { Notify } from 'quasar'
import { api } from 'src/services/clienteApi'

const salvando = ref(false)
const clinicas = ref([])
const form = reactive({ nome: '', cnpj: '', email: '', telefone: '', endereco: '', cidade: '', estado: '' })
const obrigatorio = (valor) => !!valor || 'Campo obrigatório'

async function carregarClinicas() {
  const { data } = await api.get('/clinicas')
  clinicas.value = data
}

onMounted(async () => {
  try { await carregarClinicas() } catch { Notify.create({ type: 'negative', message: 'Não foi possível carregar as clínicas.' }) }
})

async function cadastrar() {
  salvando.value = true
  try {
    const { data } = await api.post('/clinicas', form)
    Notify.create({ type: 'positive', message: data.mensagem })
    Object.assign(form, { nome: '', cnpj: '', email: '', telefone: '', endereco: '', cidade: '', estado: '' })
    await carregarClinicas()
  } catch (erro) {
    Notify.create({ type: 'negative', message: erro.response?.data?.mensagem || 'Não foi possível cadastrar a clínica.' })
  } finally {
    salvando.value = false
  }
}
</script>
