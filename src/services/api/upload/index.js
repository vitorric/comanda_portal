import API from "../index";

export const UploadDesafioIcon = (desafioId, file) => {
  let data = new FormData();
  data.set("file", file, file.fileName);
  data.set("desafioId", desafioId);

  return API.post("upload/desafio/icon", data, {
    headers: {
      accept: "application/json",
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`
    }
  });
};

export const UploadProdutoIcon = (produtoId, file) => {
  let data = new FormData();
  data.set("file", file, file.fileName);
  data.set("produtoId", produtoId);

  return API.post("upload/produto/icon", data, {
    headers: {
      accept: "application/json",
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`
    }
  });
};

export const UploadItemLojaIcon = (itemLojaId, file) => {
  let data = new FormData();
  data.set("file", file, file.fileName);
  data.set("itemLojaId", itemLojaId);

  return API.post("upload/item_loja/icon", data, {
    headers: {
      accept: "application/json",
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`
    }
  });
};

export const UploadEstabelecimentoIcon = file => {
  let data = new FormData();
  data.set("file", file, file.fileName);

  return API.post("upload/estabelecimento/icon", data, {
    headers: {
      accept: "application/json",
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`
    }
  });
};
