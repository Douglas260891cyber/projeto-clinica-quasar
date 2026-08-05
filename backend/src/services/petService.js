// Serviço responsável por acessar os dados de pets no banco.
import { query } from '../config/database.js';

// Lista todos os pets cadastrados em ordem crescente de ID.
export const listPets = async () => {
    const result = await query('SELECT * FROM pets ORDER BY id ASC');
    return result.rows;
};

// Cria um novo registro de pet no banco de dados.
export const createPet = async ({ name, species, age, description }) => {
    const result = await query(
        'INSERT INTO pets (name, species, age, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, species, age || null, description || null]
    );

    return result.rows[0];
};
