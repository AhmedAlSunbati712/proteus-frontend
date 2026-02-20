import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_API_URL || "https://proteus-api.live";
axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json';

export default axios;
