import axios from 'axios';

// Backend'imizin ana adresi
const API_BASE_URL = "http://localhost:8080/api";

// Genel bir axios instance'ı oluşturuyoruz
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json"
    }
});

export default api;