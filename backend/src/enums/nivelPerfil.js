// Códigos numéricos usados pela coluna usuarios.nivel_perfil.
export const NivelPerfil = Object.freeze({
  ADMINISTRADOR: 1,
  PROFISSIONAL: 2,
  CLIENTE: 3,
  MASTER: 4
});

export const NomeNivelPerfil = Object.freeze({
  [NivelPerfil.ADMINISTRADOR]: 'Administrador',
  [NivelPerfil.PROFISSIONAL]: 'Profissional',
  [NivelPerfil.CLIENTE]: 'Cliente',
  [NivelPerfil.MASTER]: 'Master'
});
