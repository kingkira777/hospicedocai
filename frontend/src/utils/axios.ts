import axios from "axios";
import { API_URL } from "../../secret";

const api = axios.create({
    baseURL: API_URL
});

export default api;