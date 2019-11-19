import API from "../index";

export const ListarPremiosCompras = () => {
  return API.post("listar/estabelecimento/entrega/item");
};

export const AlterarStatusEntrega = data => {
  return API.post("alterar/estabelecimento/entrega/item", data);
};
