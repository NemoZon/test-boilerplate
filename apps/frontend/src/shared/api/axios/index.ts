import axios from "axios";

export const API_URL = "https://test-boilerplate-gqxl.onrender.com/api";

export const $api = axios.create({
    baseURL: API_URL,
});