import express from 'express';
import rotasAutenticacao from './authRoutes.js';
import rotasAnimais from './petRoutes.js';
import rotasVacinas from './vaccineRoutes.js';
import rotasAgendamentos from './appointmentRoutes.js';

const roteador = express.Router();

roteador.use('/autenticacao', rotasAutenticacao);
roteador.use('/animais', rotasAnimais);
roteador.use('/vacinas', rotasVacinas);
roteador.use('/agendamentos', rotasAgendamentos);

export default roteador;
