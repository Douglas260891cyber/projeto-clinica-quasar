import express from 'express';
import { entrarUsuario } from '../controllers/controladorAutenticacao.js';

const roteador = express.Router();

roteador.post('/entrar', entrarUsuario);

export default roteador;
