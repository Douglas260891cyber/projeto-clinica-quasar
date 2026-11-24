import express from 'express';
import { cadastrarVeterinario } from '../controllers/controladorVeterinarios.js';
import { exigirAdministrador } from '../middlewares/exigirAdministrador.js';

const roteador = express.Router();

roteador.post('/cadastro', exigirAdministrador, cadastrarVeterinario);

export default roteador;
