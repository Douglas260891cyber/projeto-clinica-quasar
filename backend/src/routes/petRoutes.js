import express from 'express';
import { obterAnimal, obterAnimais, atualizarAnimal, cadastrarAnimal } from '../controllers/petController.js';

const roteador = express.Router();

roteador.get('/', obterAnimais);
roteador.post('/', cadastrarAnimal);
roteador.get('/:id', obterAnimal);
roteador.put('/:id', atualizarAnimal);

export default roteador;
