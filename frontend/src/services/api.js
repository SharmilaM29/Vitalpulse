import axios from 'axios';

let api;

try {
  api = axios.create({
    baseURL: 'http://localhost:8080/api'
  });
} catch (e) {
  api = axios;
}

if (!api || typeof api.get !== 'function') {
  api = axios;
}

if (api && api.interceptors) {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }

      return Promise.reject(error);
    }
  );
}

export default api;