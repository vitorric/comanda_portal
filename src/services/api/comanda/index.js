import API from "../index";

export const CadastrarComanda = comanda => {
  return API.post("cadastrar/comanda", comanda);
};

export const AdicionarProdutoComanda = novoProduto => {
  return API.post("cadastrar_item/comanda", novoProduto);
};

export const ObterComanda = comandaId => {
  return API.post("obter/comanda", comandaId);
};

export const ListarComandas = () => {
  return API.post("listar/comandas");
};

export const ClientePagarComanda = infoPagamento => {
  return API.post("cliente/pagar/comanda", infoPagamento);
};
