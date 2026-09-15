import express from 'express';
import { cadastrarUsuario, entrarUsuario, obterPerfil, atualizarPerfil, alterarSenha } from '../controllers/authController.js';

const roteador = express.Router();

roteador.post('/cadastro', cadastrarUsuario);
roteador.post('/entrar', entrarUsuario);
roteador.get('/usuarios/:id', obterPerfil);
roteador.put('/usuarios/:id', atualizarPerfil);
roteador.put('/usuarios/:id/senha', alterarSenha);

export default roteador;
