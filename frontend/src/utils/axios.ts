import axios from "axios";

const devURL = "https://hospicedociqdev.imanagedhealthcare.com/api/v1";
const locURL = "http://localhost:3001/api/v1";


const api = axios.create({
    baseURL: devURL
});

export default api;