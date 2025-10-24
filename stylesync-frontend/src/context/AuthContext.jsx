import { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; 

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      try {
        const decodedUser = jwtDecode(storedToken);
        if (decodedUser.exp * 1000 > Date.now()) {
          setUser(decodedUser);
          setToken(storedToken);
        } else {
          localStorage.removeItem('authToken');
        }
      } catch (error) {
        console.error("Token inválido no localStorage", error);
        localStorage.removeItem('authToken');
      }
    }
  }, []);


  const login = async (email, password) => {
    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL}/api/auth/login', { email, password });
      const receivedToken = response.data.token;
      const decodedUser = jwtDecode(receivedToken);

      localStorage.setItem('authToken', receivedToken);
      setUser(decodedUser);
      setToken(receivedToken);
      return { success: true, role: decodedUser.role };
    } catch (error) {
      console.error("Erro no login:", error);
      return { success: false, message: error.response?.data?.error || 'Falha no login.' };
    }
  };

  const register = async (name, email, phoneNumber, password) => {
    try {
      const response = await axios.post('${import.meta.env.VITE_API_URL}/api/auth/register', {
        name,
        email,
        phoneNumber,
        password,
      });

      const receivedToken = response.data.token;
      const decodedUser = jwtDecode(receivedToken); 

      localStorage.setItem('authToken', receivedToken);
      setUser(decodedUser);
      setToken(receivedToken);

      return { success: true };
    } catch (error) {
      console.error("Erro no registro:", error);
      if (error.response) {
        return { success: false, message: error.response.data.error };
      }
      return { success: false, message: 'Ocorreu um erro no aplicativo após o registro.' };
    }
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
    setToken(null);
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}