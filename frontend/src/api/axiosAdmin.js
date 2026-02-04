import axios from 'axios';

const api = axios.create({
  // Utiliser la variable d'environnement ou une valeur par défaut
  baseURL: import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: true
});

// Ajoute automatiquement le token à chaque requête
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Gère les erreurs automatiquement
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
  
          const token = localStorage.getItem('token');
          if (token && window.location.pathname !== '/login') {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
          }
  
          break;
        case 403:
          console.error('Accès refusé');
          break;
        case 404:
          console.error('Ressource introuvable');
          break;
        case 422:
          console.error('Erreurs de validation:', error.response.data.errors);
          break;
        case 500:
          console.error('Erreur serveur');
          break;
        default:
          console.error('Erreur:', error.response.status);
      }
    } else if (error.request) {
      console.error('Pas de réponse du serveur');
    } else {
      console.error('Erreur de configuration:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;