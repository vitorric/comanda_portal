import API from "../index";

export const CadastrarItemLoja = itemLoja => {
  return API.post("cadastrar/itemLoja", itemLoja);
};

export const AlterarItemLoja = itemLoja => {
  return API.post("alterar/itemLoja", itemLoja);
};

export const ObterItemLoja = itemId => {
  return API.post("obter/itemLoja", itemId);
};

export const ListarItensLoja = () => {
  return API.post("listar/itemLoja");
};
