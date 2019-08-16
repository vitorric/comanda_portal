import API from "../index";

export const AlterarStatusEstab = online => {
  return API.post("alterar/estabelecimento/online", online);
};

export const ObterEstabelecimento = () => {
  return API.post("obter/estabelecimento");
};
