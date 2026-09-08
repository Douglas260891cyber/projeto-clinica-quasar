// Serviço responsável por acessar os dados de animais no banco.
import { executarConsulta } from '../config/database.js';

// Lista todos os animais cadastrados em ordem crescente de ID.
export const listarAnimais = async () => {
    const resultado = await executarConsulta('SELECT * FROM animais ORDER BY id ASC');
    return resultado.rows;
};

export const buscarAnimalPorId = async (id) => {
    const resultado = await executarConsulta('SELECT * FROM animais WHERE id = $1', [id]);
    return resultado.rows[0] || null;
};

// Cria um novo registro de pet no banco de dados.
export const criarAnimal = async ({ nome, especie, idade, descricao }) => {
    const resultado = await executarConsulta(
        'INSERT INTO animais (nome, especie, idade, descricao) VALUES ($1, $2, $3, $4) RETURNING *',
        [nome, especie, idade || null, descricao || null]
    );

    return resultado.rows[0];
};

export const atualizarAnimalPorId = async (id, { nome, especie, idade, descricao, raca, peso, foto_url }) => {
    const resultado = await executarConsulta(
        `UPDATE animais
         SET nome = $1, especie = $2, idade = $3, descricao = $4, raca = $5, peso = $6, foto_url = $7
         WHERE id = $8 RETURNING *`,
        [nome, especie, idade || null, descricao || null, raca || null, peso || null, foto_url || null, id]
    );
    return resultado.rows[0] || null;
};
