import { createPet, listPets } from '../services/petService.js';

export const getPets = async (_req, res) => {
    try {
        const pets = await listPets();
        return res.status(200).json(pets);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao listar pets.', error: error.message });
    }
};

export const createPetController = async (req, res) => {
    try {
        const { name, species, age, description } = req.body;

        if (!name || !species) {
            return res.status(400).json({ message: 'Nome e espécie são obrigatórios.' });
        }

        const pet = await createPet({ name, species, age, description });
        return res.status(201).json({ message: 'Pet cadastrado com sucesso.', pet });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Erro ao cadastrar pet.', error: error.message });
    }
};
