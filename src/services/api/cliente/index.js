import API from "../index";

export const ObterClienteChaveUnica = chaveUnica => {
  return API.post("obter/cliente/chave_unica", chaveUnica);
};

export const AlterarSenhaApp = data => {
  return API.post("recuperar_senha/cliente", data);
};
