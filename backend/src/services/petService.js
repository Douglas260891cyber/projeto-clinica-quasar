// Serviço responsável por acessar os dados de animais no banco.
import { executarConsulta } from '../config/database.js';

// Lista todos os animais cadastrados em ordem crescente de ID.
export const listarAnimais = async () => {
    const resultado = await executarConsulta('SELECT * FROM animais ORDER BY id ASC');
    return resultado.rows;
};

// Cria um novo registro de pet no banco de dados.
export const criarAnimal = async ({ nome, especie, idade, descricao }) => {
    const resultado = await executarConsulta(
        'INSERT INTO animais (nome, especie, idade, descricao) VALUES ($1, $2, $3, $4) RETURNING *',
        [nome, especie, idade || null, descricao || null]
    );

    return resultado.rows[0];
};
