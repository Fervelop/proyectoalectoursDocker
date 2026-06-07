import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  username: string;
  user_id?: number;
  id_cliente?: number;
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

  function login(newToken: string, newUsuario: Usuario) {
    // Recupera id_cliente existente si el nuevo no lo trae
    const savedUser = sessionStorage.getItem('usuario');
    const idClienteExistente = savedUser ? JSON.parse(savedUser).id_cliente : undefined;
    
    const usuarioFinal = {
      ...newUsuario,
      id_cliente: newUsuario.id_cliente ?? idClienteExistente,
    };

    setToken(newToken);
    setUsuario(usuarioFinal);
    sessionStorage.setItem('token', newToken);
    sessionStorage.setItem('usuario', JSON.stringify(usuarioFinal));
  }

  function logout() {
    setToken(null);
    setUsuario(null);
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('usuario');
    sessionStorage.removeItem('id_cliente_pendiente');
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