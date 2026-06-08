import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Usuario {
  username: string;
  user_id?: number;
  id_cliente?: number;
  roles?: string[];          // ← nuevo
}

interface AuthContextType {
  usuario: Usuario | null;
  token: string | null;
  login: (token: string, usuario: Usuario) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;          // ← nuevo helper
  isEmpleado: boolean;       // ← nuevo helper
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('usuario');
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUsuario(JSON.parse(savedUser));
    }
  }, []);

  function login(newToken: string, newUsuario: Usuario) {
    const savedUser = localStorage.getItem('usuario');
    const idClienteExistente = savedUser
      ? JSON.parse(savedUser).id_cliente
      : undefined;

    const usuarioFinal: Usuario = {
      ...newUsuario,
      id_cliente: newUsuario.id_cliente ?? idClienteExistente,
    };

    setToken(newToken);
    setUsuario(usuarioFinal);
    localStorage.setItem('token', newToken);
    localStorage.setItem('usuario', JSON.stringify(usuarioFinal));
    sessionStorage.setItem('token', newToken);
  }

  function logout() {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('id_cliente_pendiente');
  }

  const isAdmin = usuario?.roles?.includes('admin') ?? false;
  const isEmpleado = usuario?.roles?.includes('empleado') ?? false;

  return (
    <AuthContext.Provider
      value={{ usuario, token, login, logout, isAuthenticated: !!token, isAdmin, isEmpleado }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
}