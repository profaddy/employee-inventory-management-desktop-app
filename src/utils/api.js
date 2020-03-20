import axios from "axios";

// const apiEndPointHost = process.env.REACT_APP_API_ENDPOINT_HOST ? process.env.REACT_APP_API_ENDPOINT_HOST : "";
const apiEndPointHost = "http://localhost:4000";

const api = axios.create({
    baseURL: apiEndPointHost
});

export const arrayBufferApi = axios.create({
    baseURL: apiEndPointHost + "/api/v1",
    responseType: "arraybuffer"
});
export const apiRoot = axios.create({
    baseURL: apiEndPointHost
});

export default api;


