import API from "../index";

export const LoginEstabelecimento = auth => {
  return API.post("login/estabelecimento", auth);
};
