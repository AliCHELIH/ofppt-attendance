import axios from "axios";
// import dcryptString from './../security/dcryptString';

export const BACKEND_URL = "http://localhost:8000";

export const axiosClient = axios.create({
    baseURL: BACKEND_URL + "/api",
    withCredentials: true
})

axiosClient.interceptors.request.use(async function (config) {
    const ud = JSON.parse(localStorage.getItem("ud"));
    if (ud) {
        config.headers.Authorization = 'Bearer ' + ud._token;
    }
    return config
})