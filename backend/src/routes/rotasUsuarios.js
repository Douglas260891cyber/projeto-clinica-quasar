import express from 'express';
import { cadastrarUsuario, obterPerfil, atualizarPerfil, alterarSenha } from '../controllers/controladorUsuarios.js';

const roteador = express.Router();

roteador.post('/cadastro', cadastrarUsuario);
roteador.get('/:id', obterPerfil);
roteador.put('/:id', atualizarPerfil);
roteador.put('/:id/senha', alterarSenha);

export default roteador;
