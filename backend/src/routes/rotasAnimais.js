import express from 'express';
import { obterAnimal, obterAnimais, atualizarAnimal, cadastrarAnimal } from '../controllers/controladorAnimais.js';

const roteador = express.Router();

roteador.get('/', obterAnimais);
roteador.post('/', cadastrarAnimal);
roteador.get('/:id', obterAnimal);
roteador.put('/:id', atualizarAnimal);

export default roteador;
