import { createUser, findUserByEmail, verifyPassword } from '../services/authService.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, cpf, date_of_birth } = req.body;

    if (!name || !email || !password || !cpf || !date_of_birth) {
      return res.status(400).json({ message: 'Nome, CPF, data de nascimento, e-mail e senha são obrigatórios.' });
    }

    const existingUser = await findUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ message: 'Já existe um usuário com este e-mail.' });
    }

    const user = await createUser({ name, email, password, cpf, date_of_birth });

    return res.status(201).json({ message: 'Usuário cadastrado com sucesso.', user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao cadastrar usuário.', error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    return res.status(200).json({
      message: 'Login realizado com sucesso.',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Erro ao autenticar usuário.', error: error.message });
  }
};
