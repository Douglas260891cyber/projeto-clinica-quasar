<template>
  <q-layout view="hHh lpR fFf">
    <q-header class="bg-white text-grey-9 shadow-1">
      <q-toolbar>
        <q-toolbar-title class="text-weight-bold text-green-9">Clínica Pet</q-toolbar-title>
        <q-btn flat color="green-8" icon="dashboard" label="Painel" @click="router.push('/dashboard')" />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <q-page class="bg-grey-2 q-pa-md">
        <div class="page-width">
          <section class="row items-center justify-between q-mb-md">
            <div>
              <h1 class="text-h4 text-weight-bold q-my-none">Meus pets</h1>
              <div class="text-grey-7">Consulte e administre os dados de cada pet.</div>
            </div>
            <q-btn unelevated color="green-7" icon="add" label="Cadastrar pet" @click="cadastroAberto = true" />
          </section>

          <div v-if="carregando" class="flex flex-center q-py-xl"><q-spinner color="green-7" size="42px" /></div>
          <q-banner v-else-if="erro" rounded class="bg-red-1 text-negative">{{ erro }}</q-banner>

          <!-- Cada card leva à ficha individual, evitando que os pets dividam a mesma tela. -->
          <section v-else-if="animais.length" class="row q-col-gutter-md">
            <div v-for="animal in animais" :key="animal.id" class="col-12 col-sm-6 col-md-4">
              <q-card flat bordered class="pet-card cursor-pointer" @click="router.push(`/pets/${animal.id}`)">
                <q-card-section class="row items-center no-wrap">
                  <q-avatar size="62px" color="green-1" text-color="green-9" icon="pets">
                    <img v-if="animal.foto_url" :src="animal.foto_url" :alt="`Foto de ${animal.nome}`" />
                  </q-avatar>
                  <div class="q-ml-md ellipsis">
                    <div class="text-h6 ellipsis">{{ animal.nome }}</div>
                    <div class="text-grey-7">{{ animal.especie }}<span v-if="animal.raca"> · {{ animal.raca }}</span></div>
                    <div class="text-caption text-grey-7">{{ idadeFormatada(animal.idade) }}</div>
                  </div>
                  <q-space /><q-icon name="chevron_right" color="green-8" size="28px" />
                </q-card-section>
              </q-card>
            </div>
          </section>

          <q-card v-else flat bordered class="text-center q-pa-xl text-grey-7">
            <q-icon name="pets" size="48px" color="grey-5" /><div class="q-mt-sm">Você ainda não cadastrou nenhum pet.</div>
            <q-btn flat color="green-8" label="Cadastrar o primeiro pet" @click="cadastroAberto = true" />
          </q-card>
        </div>
      </q-page>
    </q-page-container>

    <q-dialog v-model="cadastroAberto" persistent>
      <q-card style="width: 440px; max-width: 92vw">
        <q-card-section class="row items-center"><div class="text-h6">Cadastrar pet</div><q-space /><q-btn flat round icon="close" v-close-popup /></q-card-section>
        <q-form @submit="salvarPet">
          <q-card-section class="q-gutter-md">
            <q-input v-model="novoPet.nome" outlined label="Nome *" :rules="[obrigatorio]" />
            <q-input v-model="novoPet.especie" outlined label="Espécie *" :rules="[obrigatorio]" />
            <q-input v-model.number="novoPet.idade" outlined type="number" min="0" label="Idade" />
            <q-input v-model="novoPet.raca" outlined label="Raça" />
            <q-input v-model.number="novoPet.peso" outlined type="number" min="0" step="0.01" suffix="kg" label="Peso" />
            <q-input v-model.trim="novoPet.foto_url" outlined type="url" label="URL da foto" hint="Opcional" />
            <q-input v-model="novoPet.descricao" outlined type="textarea" label="Observações" />
          </q-card-section>
          <q-card-actions align="right"><q-btn flat label="Cancelar" v-close-popup /><q-btn color="green-7" label="Salvar pet" type="submit" :loading="salvando" /></q-card-actions>
        </q-form>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { api } from 'src/services/api'
import { obterUsuarioAutenticado } from 'src/services/auth'

const router = useRouter()
const $q = useQuasar()
const animais = ref([])
const carregando = ref(true)
const erro = ref('')
const cadastroAberto = ref(false)
const salvando = ref(false)
const novoPet = reactive({ nome: '', especie: '', idade: null, raca: '', peso: null, foto_url: '', descricao: '' })
const obrigatorio = (valor) => !!valor || 'Campo obrigatório'
const usuario = obterUsuarioAutenticado()

onMounted(carregarPets)

async function carregarPets() {
  carregando.value = true
  try {
    const { data } = await api.get('/animais', { params: { usuario_id: usuario?.id } })
    animais.value = data
  } catch {
    erro.value = 'Não foi possível carregar seus pets. Verifique se o backend está em execução.'
  } finally {
    carregando.value = false
  }
}

async function salvarPet() {
  salvando.value = true
  try {
    const { data } = await api.post('/animais', { ...novoPet, usuario_id: usuario?.id })
    animais.value.push(data.animal)
    Object.assign(novoPet, { nome: '', especie: '', idade: null, raca: '', peso: null, foto_url: '', descricao: '' })
    cadastroAberto.value = false
    $q.notify({ type: 'positive', message: 'Pet cadastrado com sucesso!' })
  } catch (causa) {
    $q.notify({ type: 'negative', message: causa?.response?.data?.mensagem || 'Não foi possível cadastrar o pet.' })
  } finally {
    salvando.value = false
  }
}

function idadeFormatada(idade) { return idade === null || idade === undefined ? 'Idade não informada' : `${idade} ano(s)` }
</script>

<style scoped>
.page-width { max-width: 1180px; margin: 0 auto; }
.pet-card { min-height: 100px; border-radius: 12px; transition: transform .15s ease, box-shadow .15s ease; }
.pet-card:hover { transform: translateY(-2px); box-shadow: 0 4px 12px rgba(0, 0, 0, .12); }
</style>
