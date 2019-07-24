export const TOKEN_KEY = "@cpg-token";
export const ESTABELECIMENTO_KEY = "@estab-info";

export const isAuthenticated = () => localStorage.getItem(TOKEN_KEY) !== null;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getEstabelecimento = () =>
  localStorage.getItem(ESTABELECIMENTO_KEY);

export const login = (token, estabelecimento) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(ESTABELECIMENTO_KEY, estabelecimento);
};

export const logout = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(ESTABELECIMENTO_KEY);
};
