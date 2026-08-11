import express from 'express';
import rotasAutenticacao from './authRoutes.js';
import rotasAnimais from './petRoutes.js';

const roteador = express.Router();

roteador.use('/autenticacao', rotasAutenticacao);
roteador.use('/animais', rotasAnimais);

export default roteador;
