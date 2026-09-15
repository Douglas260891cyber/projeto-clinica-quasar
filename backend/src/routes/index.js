import express from 'express';
import rotasAutenticacao from './authRoutes.js';
import rotasAnimais from './petRoutes.js';
import rotasVacinas from './vaccineRoutes.js';

const roteador = express.Router();

roteador.use('/autenticacao', rotasAutenticacao);
roteador.use('/animais', rotasAnimais);
roteador.use('/vacinas', rotasVacinas);

export default roteador;
