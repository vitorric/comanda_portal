import API from "../index";

export const CadastrarDesafio = desafio => {
  return API.post("cadastrar/desafio", desafio);
};

export const AlterarDesafio = desafio => {
  return API.post("alterar/desafio", desafio);
};

export const ObterDesafio = desafioId => {
  return API.post("obter/desafio", desafioId);
};

export const ListarDesafios = () => {
  return API.post("listar/desafios");
};
