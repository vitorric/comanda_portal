import API from "../index";

export const AlterarStatusEstab = online => {
  return API.post("alterar/estabelecimento/online", online);
};

export const AlterarEstabelecimento = estabelecimento => {
  return API.post("alterar/estabelecimento", estabelecimento);
};

export const ObterEstabelecimento = () => {
  return API.post("obter/estabelecimento");
};

export const ObterEstabelecimentoDashboard = () => {
  return API.post("obter/estabelecimento/dashboard");
};
