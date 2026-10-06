import express from 'express';
import { atualizarAgendamento, cadastrarAgendamento, excluirAgendamento, obterAgendamento, obterAgendamentos } from '../controllers/appointmentController.js';

const roteador = express.Router();
roteador.get('/', obterAgendamentos);
roteador.post('/', cadastrarAgendamento);
roteador.get('/:id', obterAgendamento);
roteador.put('/:id', atualizarAgendamento);
roteador.delete('/:id', excluirAgendamento);
export default roteador;
