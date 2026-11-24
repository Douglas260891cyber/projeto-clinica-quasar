import pkg from 'pg';
import dotenv from 'dotenv';
import path from 'path';

const { Pool } = pkg;

dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });

// Configurar a conexão com PostgreSQL usando variáveis de ambiente
const pool = new Pool(
  process.env.DATABASE_URL
    ? {
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        database: process.env.DB_NAME || 'petmarket',
        user: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASSWORD || 'postgres'
      }
);

// Função para executar queries no PostgreSQL
export const executarConsulta = async (texto, parametros = []) => {
  try {
    const resultado = await pool.query(texto, parametros);
    return resultado;
  } catch (erro) {
    console.error('Erro ao executar consulta:', erro.message);
    throw erro;
  }
};

// Inicializar o banco de dados e criar as tabelas se não existirem
export const inicializarBancoDeDados = async () => {
  try {
    // Atualiza instalações criadas com a nomenclatura anterior em inglês.
    await executarConsulta(`
      DO $$
      BEGIN
        IF to_regclass('public.users') IS NOT NULL AND to_regclass('public.usuarios') IS NULL THEN
          ALTER TABLE users RENAME TO usuarios;
        END IF;
        IF to_regclass('public.pets') IS NOT NULL AND to_regclass('public.animais') IS NULL THEN
          ALTER TABLE pets RENAME TO animais;
        END IF;
      END $$;
    `);

    // Criar tabela de usuários se não existir
    await executarConsulta(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        cpf VARCHAR(14) NOT NULL,
        data_nascimento DATE NOT NULL,
        senha_hash VARCHAR(255) NOT NULL,
        telefone VARCHAR(20),
        endereco TEXT,
        tipo VARCHAR(20) NOT NULL DEFAULT 'tutor',
        nivel_perfil SMALLINT NOT NULL DEFAULT 3 CONSTRAINT usuarios_nivel_perfil_valido CHECK (nivel_perfil IN (1, 2, 3, 4)),
        crmv VARCHAR(30),
        especialidade VARCHAR(120),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await executarConsulta(`
      CREATE TABLE IF NOT EXISTS clinicas (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        cnpj VARCHAR(18) UNIQUE,
        email VARCHAR(255),
        telefone VARCHAR(20),
        endereco TEXT,
        cidade VARCHAR(120),
        estado VARCHAR(2),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS sessoes_autenticacao (
        token_hash CHAR(64) PRIMARY KEY,
        usuario_id INTEGER NOT NULL REFERENCES usuarios(id) ON DELETE CASCADE,
        expira_em TIMESTAMP NOT NULL
      );
    `);

    // Criar tabela de animais se não existir
    await executarConsulta(`
      CREATE TABLE IF NOT EXISTS animais (
        id SERIAL PRIMARY KEY,
        nome VARCHAR(255) NOT NULL,
        especie VARCHAR(100) NOT NULL,
        idade INTEGER,
        raca VARCHAR(100),
        peso NUMERIC(6, 2),
        descricao TEXT,
        foto_url TEXT,
        usuario_id INTEGER REFERENCES usuarios(id),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await executarConsulta(`
      CREATE TABLE IF NOT EXISTS vacinas (
        id SERIAL PRIMARY KEY,
        pet VARCHAR(255) NOT NULL,
        data DATE NOT NULL,
        horario TIME,
        local VARCHAR(255) NOT NULL,
        veterinario VARCHAR(255),
        observacao TEXT,
        usuario_id INTEGER REFERENCES usuarios(id),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Agenda unificada: comporta consulta, vacina e serviços de estética sem
    // criar uma tabela para cada modalidade.
    await executarConsulta(`
      CREATE TABLE IF NOT EXISTS agendamentos (
        id SERIAL PRIMARY KEY,
        pet VARCHAR(255) NOT NULL,
        tipo VARCHAR(30) NOT NULL CHECK (tipo IN ('consulta', 'vacina', 'banho', 'tosa', 'outro')),
        data DATE NOT NULL,
        horario TIME,
        local VARCHAR(255) NOT NULL,
        profissional VARCHAR(255),
        observacao TEXT,
        vacina VARCHAR(255),
        motivo_consulta TEXT,
        porte VARCHAR(30),
        servico_outro VARCHAR(255),
        usuario_id INTEGER REFERENCES usuarios(id),
        clinica_id INTEGER REFERENCES clinicas(id),
        profissional_id INTEGER REFERENCES usuarios(id),
        origem_vacina_id INTEGER UNIQUE REFERENCES vacinas(id),
        criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await executarConsulta(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'name') THEN ALTER TABLE usuarios RENAME COLUMN name TO nome; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'date_of_birth') THEN ALTER TABLE usuarios RENAME COLUMN date_of_birth TO data_nascimento; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'password_hash') THEN ALTER TABLE usuarios RENAME COLUMN password_hash TO senha_hash; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'created_at') THEN ALTER TABLE usuarios RENAME COLUMN created_at TO criado_em; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'name') THEN ALTER TABLE animais RENAME COLUMN name TO nome; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'species') THEN ALTER TABLE animais RENAME COLUMN species TO especie; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'age') THEN ALTER TABLE animais RENAME COLUMN age TO idade; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'description') THEN ALTER TABLE animais RENAME COLUMN description TO descricao; END IF;
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'created_at') THEN ALTER TABLE animais RENAME COLUMN created_at TO criado_em; END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'raca') THEN ALTER TABLE animais ADD COLUMN raca VARCHAR(100); END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'peso') THEN ALTER TABLE animais ADD COLUMN peso NUMERIC(6, 2); END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'foto_url') THEN ALTER TABLE animais ADD COLUMN foto_url TEXT; END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'animais' AND column_name = 'usuario_id') THEN ALTER TABLE animais ADD COLUMN usuario_id INTEGER REFERENCES usuarios(id); END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'telefone') THEN ALTER TABLE usuarios ADD COLUMN telefone VARCHAR(20); END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'endereco') THEN ALTER TABLE usuarios ADD COLUMN endereco TEXT; END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'tipo') THEN ALTER TABLE usuarios ADD COLUMN tipo VARCHAR(20) NOT NULL DEFAULT 'tutor'; END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'nivel_perfil') THEN
          ALTER TABLE usuarios ADD COLUMN nivel_perfil SMALLINT NOT NULL DEFAULT 3;
        ELSE
          IF (SELECT data_type FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'nivel_perfil') <> 'smallint' THEN
            ALTER TABLE usuarios ALTER COLUMN nivel_perfil DROP DEFAULT;
            ALTER TABLE usuarios ALTER COLUMN nivel_perfil TYPE SMALLINT USING (
              CASE nivel_perfil::TEXT
                WHEN 'administrador' THEN 1
                WHEN 'profissional' THEN 2
                WHEN 'cliente' THEN 3
                WHEN '1' THEN 1
                WHEN '2' THEN 2
                WHEN '3' THEN 3
                ELSE 3
              END
            );
            ALTER TABLE usuarios ALTER COLUMN nivel_perfil SET DEFAULT 3;
            ALTER TABLE usuarios ALTER COLUMN nivel_perfil SET NOT NULL;
          END IF;
        END IF;
        ALTER TABLE usuarios DROP CONSTRAINT IF EXISTS usuarios_nivel_perfil_valido;
        ALTER TABLE usuarios ADD CONSTRAINT usuarios_nivel_perfil_valido CHECK (nivel_perfil IN (1, 2, 3, 4));
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'crmv') THEN ALTER TABLE usuarios ADD COLUMN crmv VARCHAR(30); END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'especialidade') THEN ALTER TABLE usuarios ADD COLUMN especialidade VARCHAR(120); END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'usuarios' AND column_name = 'clinica_id') THEN ALTER TABLE usuarios ADD COLUMN clinica_id INTEGER REFERENCES clinicas(id); END IF;
        ALTER TABLE usuarios ALTER COLUMN clinica_id DROP NOT NULL;
        IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'usuarios_clinica_obrigatoria_por_perfil' AND conrelid = 'public.usuarios'::regclass) THEN
          ALTER TABLE usuarios ADD CONSTRAINT usuarios_clinica_obrigatoria_por_perfil
            CHECK (nivel_perfil = 4 OR clinica_id IS NOT NULL) NOT VALID;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agendamentos' AND column_name = 'clinica_id') THEN ALTER TABLE agendamentos ADD COLUMN clinica_id INTEGER REFERENCES clinicas(id); END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema = 'public' AND table_name = 'agendamentos' AND column_name = 'profissional_id') THEN ALTER TABLE agendamentos ADD COLUMN profissional_id INTEGER REFERENCES usuarios(id); END IF;
      END $$;
    `);
    await executarConsulta("CREATE UNIQUE INDEX IF NOT EXISTS usuarios_crmv_unico ON usuarios (LOWER(crmv)) WHERE crmv IS NOT NULL");

    // Preserva a agenda de vacinas criada nas versões anteriores.
    await executarConsulta(`
      INSERT INTO agendamentos (pet, tipo, data, horario, local, profissional, observacao, vacina, usuario_id, origem_vacina_id)
      SELECT pet, 'vacina', data, horario, local, veterinario, observacao, observacao, usuario_id, id
      FROM vacinas
      WHERE NOT EXISTS (
        SELECT 1 FROM agendamentos WHERE agendamentos.origem_vacina_id = vacinas.id
      );
    `);

    console.log('Tabelas do banco de dados criadas/verificadas com sucesso.');
    return true;
  } catch (erro) {
    console.error('Erro ao inicializar banco de dados:', erro.message);
    throw erro;
  }
};

// Testar a conexão com o banco de dados
export const testarConexao = async () => {
  try {
    const resultado = await executarConsulta('SELECT NOW()');
    console.log('Conexão com PostgreSQL estabelecida com sucesso.');
    return resultado.rows[0];
  } catch (erro) {
    console.error('Erro ao conectar ao PostgreSQL:', erro.message);
    throw erro;
  }
};

export default pool;
