import axios from "axios";
import secret from '../../secret.json';

const api = axios.create({
    baseURL: secret.API_URL,
    headers: {
        "API-KEY": secret.API_KEY,
    },
});

export default api;