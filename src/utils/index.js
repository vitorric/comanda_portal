export const FormatarDinheiro = num => {
  if (typeof num === "undefined") return "0,00";

  return `${num.toFixed(2)}`;
};

export const APIUrl = () => "http://localhost:3000/";
