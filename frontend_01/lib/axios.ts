import axios from 'axios';
import { API_URL, API_URL_LOCAL } from '../secret';
const api = axios.create({
    baseURL: API_URL_LOCAL
});

export default api;