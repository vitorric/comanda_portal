import API from "../index";

export const CadastrarProduto = produto => {
  return API.post("cadastrar/produto", produto);
};

export const AlterarProduto = produto => {
  return API.post("alterar/produto", produto);
};

export const ObterProduto = produtoId => {
  return API.post("obter/produto", produtoId);
};

export const ListarProdutos = () => {
  return API.post("listar/produto");
};
