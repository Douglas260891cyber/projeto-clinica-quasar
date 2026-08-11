import express from 'express';
import { cadastrarUsuario, entrarUsuario } from '../controllers/authController.js';

const roteador = express.Router();

roteador.post('/cadastro', cadastrarUsuario);
roteador.post('/entrar', entrarUsuario);

export default roteador;
