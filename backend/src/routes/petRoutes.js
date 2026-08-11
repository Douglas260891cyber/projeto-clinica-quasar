import express from 'express';
import { obterAnimais, cadastrarAnimal } from '../controllers/petController.js';

const roteador = express.Router();

roteador.get('/', obterAnimais);
roteador.post('/', cadastrarAnimal);

export default roteador;
