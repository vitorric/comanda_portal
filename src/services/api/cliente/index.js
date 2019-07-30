import API from "../index";

export const ObterClienteChaveUnica = chaveUnica => {
  return API.post("obter/cliente/chave_unica", chaveUnica);
};
