import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('access_token');
      const refreshToken = localStorage.getItem('refresh_token');

      if (!accessToken) {
        setIsAuthenticated(false);
        return;
      }

      try {
        // Токен существует, считаем пользователя аутентифицированным
        setIsAuthenticated(true);
      } catch (error) {
        // Если возникла ошибка, попробуем обновить токен
        if (refreshToken) {
          try {
            const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/token/refresh/`, {
              refresh: refreshToken,
            });
            localStorage.setItem('access_token', response.data.access);
            setIsAuthenticated(true);
          } catch (refreshError) {
            // Если обновление токена не удалось, перенаправляем на страницу логина
            setIsAuthenticated(false);
          }
        } else {
          setIsAuthenticated(false);
        }
      }
    };

    checkAuth();
  }, []);

  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
