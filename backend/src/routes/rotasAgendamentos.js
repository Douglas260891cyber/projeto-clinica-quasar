import express from 'express';
import { atualizarAgendamento, cadastrarAgendamento, excluirAgendamento, obterAgendamento, obterAgendamentos } from '../controllers/controladorAgendamentos.js';
import { exigirUsuarioAutenticado } from '../middlewares/exigirUsuarioAutenticado.js';

const roteador = express.Router();
roteador.get('/', obterAgendamentos);
roteador.post('/', exigirUsuarioAutenticado, cadastrarAgendamento);
roteador.get('/:id', obterAgendamento);
roteador.put('/:id', exigirUsuarioAutenticado, atualizarAgendamento);
roteador.delete('/:id', excluirAgendamento);
export default roteador;
