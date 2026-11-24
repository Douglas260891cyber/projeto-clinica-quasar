import express from 'express';
import { cadastrarClinica, obterClinicaDoUsuario, obterClinicas } from '../controllers/controladorClinicas.js';
import { exigirMaster } from '../middlewares/exigirMaster.js';
import { exigirUsuarioAutenticado } from '../middlewares/exigirUsuarioAutenticado.js';

const roteador = express.Router();

roteador.get('/', obterClinicas);
roteador.get('/minha', exigirUsuarioAutenticado, obterClinicaDoUsuario);
roteador.post('/', exigirMaster, cadastrarClinica);

export default roteador;
