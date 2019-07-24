import axios from "axios";
import { getToken, logout } from "../auth";

const api = axios.create({
  baseURL: "http://localhost:3000/api/"
});

api.interceptors.request.use(async config => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  response => successHandler(response),
  error => errorHandler(error)
);

const isHandlerEnabled = (config = {}) => {
  return config.hasOwnProperty("handlerEnabled") && !config.handlerEnabled
    ? false
    : true;
};
const errorHandler = error => {
  if (isHandlerEnabled(error.config)) {
    if (error.message.includes("401")) {
      logout();
      window.location.href = "/login";
    }
  }
  return Promise.reject({ ...error });
};

const successHandler = response => {
  if (isHandlerEnabled(response.config)) {
    // Handle responses
  }
  return response;
};
export default api;
