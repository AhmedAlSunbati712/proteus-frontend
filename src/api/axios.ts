import axios from "axios";
import * as credentials from "./credentials";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://proteus-api.live";
axios.defaults.withCredentials = true;
axios.defaults.headers["Content-Type"] = "application/json";

credentials.restoreCredentials(axios);

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      credentials.clearCredentials(axios);
    }
    return Promise.reject(error);
  }
);

export const setCredentials = (token: string) =>
  credentials.setCredentials(axios, token);
export const clearCredentials = () => credentials.clearCredentials(axios);

export default axios;
