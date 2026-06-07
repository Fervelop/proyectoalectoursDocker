import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  username: string;
  id_cliente?: number;
  [key: string]: any;
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('token');
    const savedUser = sessionStorage.getItem('usuario');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUsuario(JSON.parse(savedUser));
    }
  }, []);

  function login(token: string, usuario: Usuario) {
    setToken(token);
    setUsuario(usuario);
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('usuario', JSON.stringify(usuario));
  }

  function logout() {
    setToken(null);
    setUsuario(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
  }

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, isAuthenticated: !!token }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}