import { query } from '../config/database.js';

export const listPets = async () => {
    const result = await query('SELECT * FROM pets ORDER BY id ASC');
    return result.rows;
};

export const createPet = async ({ name, species, age, description }) => {
    const result = await query(
        'INSERT INTO pets (name, species, age, description) VALUES ($1, $2, $3, $4) RETURNING *',
        [name, species, age || null, description || null]
    );

    return result.rows[0];
};
