import express from 'express';
import rotasAutenticacao from './rotasAutenticacao.js';
import rotasAnimais from './rotasAnimais.js';
import rotasVacinas from './rotasVacinas.js';
import rotasAgendamentos from './rotasAgendamentos.js';

const roteador = express.Router();

roteador.use('/autenticacao', rotasAutenticacao);
roteador.use('/animais', rotasAnimais);
roteador.use('/vacinas', rotasVacinas);
roteador.use('/agendamentos', rotasAgendamentos);

export default roteador;
