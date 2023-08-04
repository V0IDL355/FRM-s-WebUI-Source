import axios from 'axios';

const api = axios.create({
  baseURL: `http://${localStorage.getItem("ip")}/`,
});

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
