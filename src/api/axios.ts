import axios from "axios";

axios.defaults.baseURL = import.meta.env.VITE_REACT_APP_BASE_API_URL || "http://localhost:3000"; // adjust to your backend
axios.defaults.withCredentials = true;
axios.defaults.headers['Content-Type'] = 'application/json';

export default axios;