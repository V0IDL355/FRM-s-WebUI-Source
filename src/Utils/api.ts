import axios from 'axios';

const api = axios.create({
  baseURL: `http://${
    localStorage.getItem("ip")?.toString() || "127.0.0.1:8080"
  }/`,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
