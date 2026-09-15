// Controlador responsável pelas operações de animais recebidas pela API.
import { atualizarAnimalPorId, buscarAnimalPorId, criarAnimal, listarAnimais } from '../services/petService.js';

// Busca e retorna todos os animais cadastrados.
export const obterAnimais = async (requisicao, resposta) => {
    try {
        const animais = await listarAnimais(requisicao.query.usuario_id);
        return resposta.status(200).json(animais);
    } catch (erro) {
        console.error(erro);
        return resposta.status(500).json({ mensagem: 'Erro ao listar animais.', erro: erro.message });
    }
};

// Cria um novo pet com os dados recebidos na requisição.
export const cadastrarAnimal = async (requisicao, resposta) => {
    try {
        const { nome, especie, idade, descricao, raca, peso, foto_url, usuario_id } = requisicao.body;

        if (!nome || !especie) {
            return resposta.status(400).json({ mensagem: 'Nome e espécie são obrigatórios.' });
        }

        const animal = await criarAnimal({ nome, especie, idade, descricao, raca, peso, foto_url, usuario_id });
        return resposta.status(201).json({ mensagem: 'Animal cadastrado com sucesso.', animal });
    } catch (erro) {
        console.error(erro);
        return resposta.status(500).json({ mensagem: 'Erro ao cadastrar animal.', erro: erro.message });
    }
};

// Retorna um único pet para compor sua ficha completa no frontend.
export const obterAnimal = async (requisicao, resposta) => {
    try {
        const animal = await buscarAnimalPorId(requisicao.params.id);
        if (!animal) return resposta.status(404).json({ mensagem: 'Pet não encontrado.' });
        return resposta.status(200).json(animal);
    } catch (erro) {
        console.error(erro);
        return resposta.status(500).json({ mensagem: 'Erro ao buscar o pet.', erro: erro.message });
    }
};

// Atualiza apenas os campos permitidos na ficha do pet.
export const atualizarAnimal = async (requisicao, resposta) => {
    try {
        const { nome, especie, idade, descricao, raca, peso, foto_url } = requisicao.body;
        if (!nome || !especie) return resposta.status(400).json({ mensagem: 'Nome e espécie são obrigatórios.' });

        const animal = await atualizarAnimalPorId(requisicao.params.id, { nome, especie, idade, descricao, raca, peso, foto_url });
        if (!animal) return resposta.status(404).json({ mensagem: 'Pet não encontrado.' });
        return resposta.status(200).json({ mensagem: 'Pet atualizado com sucesso.', animal });
    } catch (erro) {
        console.error(erro);
        return resposta.status(500).json({ mensagem: 'Erro ao atualizar o pet.', erro: erro.message });
    }
};
