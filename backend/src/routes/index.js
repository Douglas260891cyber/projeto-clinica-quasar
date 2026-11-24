import express from 'express';
import rotasAutenticacao from './rotasAutenticacao.js';
import rotasAnimais from './rotasAnimais.js';
import rotasVacinas from './rotasVacinas.js';
import rotasAgendamentos from './rotasAgendamentos.js';
import rotasVeterinarios from './rotasVeterinarios.js';
import rotasUsuarios from './rotasUsuarios.js';
import rotasClinicas from './rotasClinicas.js';

const roteador = express.Router();

roteador.use('/autenticacao', rotasAutenticacao);
roteador.use('/animais', rotasAnimais);
roteador.use('/vacinas', rotasVacinas);
roteador.use('/agendamentos', rotasAgendamentos);
roteador.use('/veterinarios', rotasVeterinarios);
roteador.use('/usuarios', rotasUsuarios);
roteador.use('/clinicas', rotasClinicas);

export default roteador;
