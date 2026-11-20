import express from 'express';
import { atualizarVacina, cadastrarVacina, excluirVacina, obterVacina, obterVacinas } from '../controllers/controladorVacinas.js';

const roteador = express.Router();
roteador.get('/', obterVacinas);
roteador.post('/', cadastrarVacina);
roteador.get('/:id', obterVacina);
roteador.put('/:id', atualizarVacina);
roteador.delete('/:id', excluirVacina);
export default roteador;
