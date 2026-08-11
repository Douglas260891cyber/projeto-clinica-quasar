// Controlador responsável pelas operações de animais recebidas pela API.
import { criarAnimal, listarAnimais } from '../services/petService.js';

// Busca e retorna todos os animais cadastrados.
export const obterAnimais = async (_requisicao, resposta) => {
    try {
        const animais = await listarAnimais();
        return resposta.status(200).json(animais);
    } catch (erro) {
        console.error(erro);
        return resposta.status(500).json({ mensagem: 'Erro ao listar animais.', erro: erro.message });
    }
};

// Cria um novo pet com os dados recebidos na requisição.
export const cadastrarAnimal = async (requisicao, resposta) => {
    try {
        const { nome, especie, idade, descricao } = requisicao.body;

        if (!nome || !especie) {
            return resposta.status(400).json({ mensagem: 'Nome e espécie são obrigatórios.' });
        }

        const animal = await criarAnimal({ nome, especie, idade, descricao });
        return resposta.status(201).json({ mensagem: 'Animal cadastrado com sucesso.', animal });
    } catch (erro) {
        console.error(erro);
        return resposta.status(500).json({ mensagem: 'Erro ao cadastrar animal.', erro: erro.message });
    }
};
